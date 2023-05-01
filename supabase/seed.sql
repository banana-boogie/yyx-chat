INSERT INTO users (name, phone_number)
VALUES ('Richard Hendricks', '555-1234'),
       ('Erlich Bachman', '555-5678'),
       ('Jared Dunn', '555-9012');

INSERT INTO messages (message, user_id, openai_response)
VALUES ('Hey guys, we should start a tech company!', (SELECT id FROM users WHERE name = 'Richard Hendricks'), 'Richard, keep pushing forward with your passion and perseverance in building your tech company, and remember that success is not just about achieving your goals, but also about the journey and the people you meet along the way.'),
       ('Check out this logo design I came up with!', (SELECT id FROM users WHERE name = 'Erlich Bachman'), 'Erlich, strive to treat others with respect and dignity, and remember that true success doesnt come at the expense of others'),
       ('I found a really interesting article on machine learning.', (SELECT id FROM users WHERE name = 'Jared Dunn'), 'This guy f**ks');
