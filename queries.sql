CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    book_year INTEGER NOT NULL
);

INSERT INTO books (title, author, book_year) VALUES
('To Kill a Mockingbird', 'Harper Lee', 1960),
('1984', 'George Orwell', 1949),
('The Great Gatsby', 'F. Scott Fitzgerald', 1925),
('Pride and Prejudice', 'Jane Austen', 1813),
('Moby-Dick', 'Herman Melville', 1851);

CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    rating NUMERIC(2, 1) CHECK (rating >= 1.0 AND rating <= 5.0),
    title VARCHAR(255),
    article TEXT,
    date_created DATE,
    book_id INTEGER,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

INSERT INTO entries (rating, title, article, date_created, book_id) VALUES
(4.5, 'To Kill a Mockingbird', 'To Kill a Mockingbird is a powerful exploration of moral growth and racial injustice in the Deep South. Harper Lee masterfully weaves a tale that challenges societal norms and encourages readers to reflect on their own values. The novel''s characters are richly developed, and the narrative is both engaging and thought-provoking.', '2024-08-01', 1),
(4.8, '1984', '1984 is a chilling dystopian novel that remains profoundly relevant today. George Orwell paints a terrifying picture of a totalitarian regime that controls every aspect of life, from thoughts to actions. The novel''s themes of surveillance, censorship, and propaganda resonate in our modern world, making it a must-read for those concerned with personal freedom and democracy.', '2024-08-02', 2),
(4.2, 'The Great Gatsby', 'The Great Gatsby is a tragic tale of love, wealth, and the American Dream. F. Scott Fitzgerald captures the spirit of the roaring twenties with vivid descriptions and complex characters. The novel explores the illusion of the American Dream and the emptiness that often lies behind wealth and glamour. Gatsby''s pursuit of an unattainable love is both heartbreaking and compelling.', '2024-08-03', 3),
(4.7, 'Pride and Prejudice', 'Pride and Prejudice is a timeless classic that delves into love, class, and society in 19th-century England. Jane Austen''s wit and social commentary are on full display as she crafts a story that is both romantic and critical of societal norms. The relationship between Elizabeth Bennet and Mr. Darcy is one of the most enduring in literature, filled with misunderstandings, growth, and eventual mutual respect.', '2024-08-04', 4),
(4.3, 'Moby-Dick', 'Moby-Dick is an epic sea adventure that delves deep into the human soul and the obsession that can drive a man to madness. Herman Melville''s tale of Captain Ahab''s relentless pursuit of the white whale is a complex exploration of vengeance, fate, and the unknown. The novel is rich in symbolism and offers readers a challenging but rewarding experience as they navigate its dense and poetic prose.', '2024-08-05', 5);
