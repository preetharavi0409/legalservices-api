const { response } = require('express');
let express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  bodyParser = require('body-parser');
const { envconfig } = require('dotenv').config();


// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

// Set up express js port
const caseRoute = require('./routes/case.route')
const userRoute = require('./routes/users.route')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());

// Setting up static directory
app.use(express.static(path.join(__dirname, 'dist/angular8-meanstack-angular-material')));


// RESTful API root
app.use('/api/case', caseRoute)
app.use('/api/user', userRoute)

// PORT
/*const port = process.env.PORT; //|| 8000;

app.listen(port, () => {
  console.log('Connected to port ' + port);
}) */

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});

 app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/angular8-meanstack-angular-material/index.html'));
}); 



// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

module.exports=app;