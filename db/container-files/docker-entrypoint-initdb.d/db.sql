CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    body VARCHAR(32)
);
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    hashed_password VARCHAR(255)
);
CREATE TABLE Comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users (id),
    post_id INTEGER REFERENCES Posts (id),
    body VARCHAR(32)
)
