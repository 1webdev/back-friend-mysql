require('../../root');

module.exports = {
    root: _root,
    started: new Date(),
    port: 3000,
    domain: 'localhost',
    secret: 'chairbedcowthepole',
    tokens: {
        algorithm: 'ES256'
    },
    db: {
        connectionLimit: process.env.MYSQL_CONNECTION_LIMIT,
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        debug: process.env.MYSQL_DEBUG
    },
    googleApiKey: 'AIzaSyA3yVWnAFAwssKvq6hMdf18i8cQXUjDVlg',
};
