const express = require('express');
const path = require('path');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');

const sequelize = require('./utils/database');
const schema = require('./graphql/schema');
const resolver = require('./graphql/resolver');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true
}));

app.use((req, res, next) => {
    res.sendFile('/index.html');
});

const start = async () => {
    try {
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();