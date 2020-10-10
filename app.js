var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');


app.use(session({
    secret: 'secret for blood donation',
    resave: false,
    saveUninitialized: true
  }));

app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

const AdminRoute = require('./routes/Admin');
const UserRoute = require('./routes/User');
const adminRoute = require('./routes/adminRoute');
const userRoute = require('./routes/userRoute');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/bloodDonation/admin/login')
})
app.use('/bloodDonation/adminRoute', adminRoute);
app.use('/bloodDonation/userRoute', userRoute);
app.use('/bloodDonation/admin', AdminRoute);
app.use('/bloodDonation/user', UserRoute);


app.listen(7900);