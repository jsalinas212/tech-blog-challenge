const path = require('path');
const express = require('express');
const session = reqiure('express-session');
const templating = require('express-handlebars');
const sequelize = require('./config/connection');
const { Sequelize } = require('sequelize/types');
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

const userSession = {
  secret: 'f23h90f23h90hf83',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
}

app.use(session(userSession));

const frontEnd = templating.create({
  helpers: {
    format_date: date => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }
  }
});

app.engine('handlebars', frontEnd.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(require('./controllers/'));

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
});

