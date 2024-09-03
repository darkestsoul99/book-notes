import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import methodOverride from "method-override";

const app = express();
const port = 3000;

const adminUser = {
    username: 'admin',
    password: bcrypt.hashSync('password', 10) // hashed password
};

const db = new pg.Client(
    {
        user: "postgres",
        host: "localhost",
        database: "booknotes",
        password: "123456",
        port: 5432,
    } 
)
db.connect();

dotenv.config();
// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
});

app.use(bodyParser.urlencoded({ extended : true}));
app.use(express.static("public"));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));
app.use(methodOverride('_method'));

function checkAuth(req, res, next) {
    res.locals.isAdmin = req.session.authenticated || false;
    next();
}
app.use(checkAuth);

async function getBook(book_id) {
    if(book_id) {
        const result = await db.query(
            "SELECT * FROM books WHERE id = $1;",
            [book_id]
        );
        let output = result.rows[0];
        return output;
    } else {
        const result = await db.query(
            "SELECT * FROM books;"
        );
        let output = result.rows;
        return output;
    }
}

async function getEntry(entry_id) {
    if (entry_id) {
        const result = await db.query(
            "SELECT id, rating, title, article, TO_CHAR(date_created, 'Mon DD, YYYY') as date_created, book_id FROM entries WHERE id = $1;",
            [entry_id]
        );
        let output = result.rows[0];
        return output;
    } else {
        const result = await db.query(
            "SELECT id, rating, title, LEFT(article, 100) AS article, TO_CHAR(date_created, 'Mon DD, YYYY') as date_created, book_id \
             FROM entries ORDER BY id ASC;"
        );
        let output = result.rows;
        return output;
    }
}

async function sortByDate() {
    const result = await db.query(
        "SELECT id, rating, title, LEFT(article, 100) AS article, TO_CHAR(date_created, 'Mon DD, YYYY') as date_created, book_id \
         FROM entries ORDER BY date_created DESC LIMIT 3;"
    );
    let newestentries = result.rows;
    return newestentries;
}

async function sortByRating() {
    const result = await db.query(
        "SELECT id, rating, title, LEFT(article, 100) AS article, TO_CHAR(date_created, 'Mon DD, YYYY') as date_created, book_id \
         FROM entries ORDER BY rating DESC LIMIT 3;"
    );
    let popularentries = result.rows;
    return popularentries;
}

app.get("/", async (req, res) => {
    try {
        const popular_entries = await sortByRating();
        const newest_entries = await sortByDate();
        res.render( "index.ejs" , {
            newestentries: newest_entries,
            popularentries: popular_entries
        });

    } catch(err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching main page.");
    }
});

app.get("/about", (req, res) => {
    res.render("about.ejs");
});

app.get("/entries", async (req, res) => {
    try {
        const all_entries = await getEntry();
        res.render("entries.ejs", {
            entries: all_entries
        });
    } catch(err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching entries.");
    }
});

app.get("/entries/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const entry_info = await getEntry(id);
        const db_book_info = await getBook(entry_info.book_id);
        try {
            const formattedTitle = entry_info.title.toLowerCase().replace(/ /g, "+");
            const response = await axios.get("https://openlibrary.org/search.json", {
                params: { title: formattedTitle }
            });
            const book_info = response.data.docs[0];
            const book_cover = book_info.cover_i;
            const book_cover_url_medium = `https://covers.openlibrary.org/b/id/${book_cover}-M.jpg`;
            res.render("article.ejs", {
                entry: entry_info,
                book_cover: book_cover_url_medium,
                book_info: db_book_info
            });
        } catch(err) {
            console.log(err);
            res.render("article.ejs", {
                entry: entry_info,
                book_cover: null,
                book_info: db_book_info
            });
        }

    } catch(err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching the entry.");
    }
});

app.delete("/entries/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await db.query(
            "DELETE FROM entries WHERE id = $1",
            [id]
        );
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }     
});

app.get("/add-article", (req, res) => {
    res.render("new-article.ejs");
});

app.post("/add-article", async (req, res) => {

    try {
        const { title, rating, article } = req.body;
        const formattedTitle = title.toLowerCase().replace(/ /g, "+");
        const date_created = new Date().toISOString().slice(0, 10);
        const response = await axios.get("https://openlibrary.org/search.json", {
            params: { title: formattedTitle }
        });
        const book_info = response.data.docs[0];
        const book_title = book_info.title;
        const book_author = book_info.author_name[0];
        const book_year = book_info.first_publish_year;
        const book = await db.query(
                "INSERT INTO books (title, author, book_year) VALUES ($1, \
                $2, $3) RETURNING *;",
                [book_title, book_author, book_year]
        );
        await db.query(
                "INSERT INTO entries (title, rating, article, date_created, book_id) VALUES ($1, $2, $3, $4, $5)",
                [title, rating, article, date_created, book.rows[0].id]
        );
        res.redirect("/");
    } catch(err) {
        console.log(err);
        res.status(500).send("An error occurred while posting new entry.");
    }
});

app.get("/edit-article", async (req, res) => {
    try {
        const entry_id = req.query.id;
        const entry = await getEntry(entry_id);
        res.render("edit-article.ejs", {
            entry: entry
        });
    } catch(err) {
        console.log(err);
    }
});

app.patch("/edit-article", async (req, res) => {
    try {
        const { id, title, rating, article } = req.body;
        await db.query(
            "UPDATE entries SET title = $1, rating = $2, article = $3 WHERE \
            id = $4",
            [title, rating, article, id]
        );
        res.redirect("/");
    } catch(err) {
        console.log(err);
    }
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.post("/contact", (req, res) => {
    const { inputEmail, message } = req.body;

    const mailOptions = {
        from: inputEmail,
        to: process.env.EMAIL,
        subject: 'New Contact Form Submission',
        text: `You have a new contact form submission from: ${inputEmail}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.render("contact.ejs", { msg: "There was an error sending your message. Please try again later." });
        } else {
            console.log('Email sent: ' + info.response);
            res.render("contact.ejs", { msg: "Your message has been sent successfully!" });
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === adminUser.username && bcrypt.compareSync(password, adminUser.password)) {
        req.session.authenticated = true;
        res.redirect('/admin');
    } else {
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});


app.get('/admin', (req, res) => {
    if (req.session.authenticated) {
        res.redirect("/");
    } else {
        res.redirect('/login');
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});