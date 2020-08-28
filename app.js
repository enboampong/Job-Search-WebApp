const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = require('./config/database')



  //testing db is connected
  db.authenticate().
  then(()=> console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

  //using the handlebars template engine to define the layouts
  app.engine('handlebars', exphbs({defaultLayout:'main'}));
  app.set('view engine', 'handlebars');

  //because we are going to be getting data from a form we need to use body parser package
  app.use(bodyParser.urlencoded({extended:false}));

  //setting the static folder for our interface and layouts
app.use(express.static(path.join(__dirname, 'public')));

//index route
app.get('/', (req,res) => res.render('index', {layout: 'landing'}));

//routes for jobs
app.use('/jobs', require('./routes/jobs'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

