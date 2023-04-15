INSERT INTO users (name, phone_number, whatsapp_id)
VALUES ('Richard Hendricks', '555-1234', 'richard-hendricks'),
       ('Erlich Bachman', '555-5678', 'erlich-bachman'),
       ('Jared Dunn', '555-9012', 'jared-dunn');

INSERT INTO messages (phone_number, whatsapp_id, message, user_id)
VALUES ('555-1234', 'richard-hendricks', 'Hey guys, we should start a tech company!', (SELECT id FROM users WHERE name = 'Richard Hendricks')),
       ('555-5678', 'erlich-bachman', 'Check out this logo design I came up with!', (SELECT id FROM users WHERE name = 'Erlich Bachman')),
       ('555-9012', 'jared-dunn', 'I found a really interesting article on machine learning.', (SELECT id FROM users WHERE name = 'Jared Dunn'));
