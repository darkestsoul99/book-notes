
---

# BookNotes App

A simple web application for managing book notes, allowing users to add, view, edit, and delete entries related to their favorite books. The app is built with Node.js and Express.js, and it uses PostgreSQL for the database. Additional features include user authentication, email notifications, and integration with the Open Library API to fetch book details.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Simple login/logout functionality with admin access.
- **Book Management**: Add, view, edit, and delete book entries.
- **Email Notifications**: Receive email notifications via a contact form.
- **API Integration**: Fetch book details using the Open Library API.
- **Session Management**: Secure session handling with `express-session`.
- **Responsive Design**: Basic responsive design using EJS templating.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: bcrypt.js, express-session
- **Email**: Nodemailer
- **API**: Open Library API
- **Templating**: EJS
- **Styling**: Bootstrap (optional for front-end design)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/booknotes-app.git
   cd booknotes-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Add the following environment variables:

     ```
     EMAIL=your-email@gmail.com
     EMAIL_PASSWORD=your-email-password
     ```

4. **Set up the database:**
   - Ensure you have PostgreSQL installed and running.
   - Create a database named `booknotes`.
   - Configure the database connection in `index.js`:

     ```javascript
     const db = new pg.Client({
         user: "postgres",
         host: "localhost",
         database: "booknotes",
         password: "123456",
         port: 5432,
     });
     db.connect();
     ```

5. **Run the application:**
   ```bash
   npm start
   ```

6. **Access the application:**
   - Open your browser and go to `http://localhost:3000`.

## Environment Variables

The application requires the following environment variables:

- `EMAIL`: The email address used to send contact form submissions.
- `EMAIL_PASSWORD`: The password for the email account.

Make sure to create a `.env` file in the root directory and add these variables.

## Database Setup

To set up the PostgreSQL database:

1. Create a new database named `booknotes`.
2. Create the necessary tables for `books` and `entries` using the following SQL commands:

   ```sql
   CREATE TABLE books (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       author VARCHAR(255),
       book_year INT
   );

   CREATE TABLE entries (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       rating INT,
       article TEXT,
       date_created DATE,
       book_id INT REFERENCES books(id) ON DELETE CASCADE
   );
   ```

## Usage

- **Login**: Access the admin area by logging in with the admin credentials.
- **Add/Edit Entries**: Add new book entries and edit existing ones.
- **View Entries**: View all entries and their associated book information.
- **Contact**: Submit feedback via the contact form, which sends an email to the admin.

## Project Structure

```
booknotes-app/
│
├── public/             # Static files (CSS, images, etc.)
├── views/              # EJS templates
│   ├── index.ejs
│   ├── about.ejs
│   ├── entries.ejs
│   ├── article.ejs
│   ├── new-article.ejs
│   ├── edit-article.ejs
│   ├── contact.ejs
│   └── login.ejs
├── .env                # Environment variables
├── .gitignore          # Files to ignore in Git
├── index.js            # Main server file
├── package.json        # Node.js dependencies and scripts
└── README.md           # Project documentation
```

## Contributing

Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

