var express = require('express.io');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var five = require("johnny-five");
var Spark = require("spark-io");

var board = new five.Board({
  io: new Spark({
    token: "7550da40ccf9ac697211eb17c031bbe7ac16a20a",
    // /deviceId: "53ff6b066667574841281667"
    deviceId:"53ff6c066667574819132467"
  })
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.http().io();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.io.on('connection', function (socket){
    console.log('client: ',socket.id);
});


app.io.route('hi', function(req){
        console.log('cliente dice hola!');
        app.io.broadcast('hi server', {socketId: req.socket.id});
    });


board.on("ready", function() {
    var led = new five.Led("D7");
    led.blink();

    servo1 = new five.Servo({
        pin: 'A0',    
        type: "continuous"
    });

    servo2 = new five.Servo({
        pin: 'A4',    
        type: "continuous"
    });

    app.io.route('fwd', function( req ){
        fnPararServos(req.data.tiempo);
        servo1.cw();
        servo2.ccw();
    });
    app.io.route('right', function( req ){    
        fnPararServos(req.data.tiempo);
        servo1.ccw();  
        servo2.ccw();
    });
    app.io.route('stop', function( req ){    
        servo1.stop();  
        servo2.stop();
    });
    app.io.route('left', function( req ){    
        fnPararServos(req.data.tiempo);
        servo1.cw();  
        servo2.cw();
    });
    
    app.io.route('back', function( req ){    
        fnPararServos(req.data.tiempo);
        servo1.ccw();  
        servo2.cw(); 
    });

    app.io.route('comando',function (req) {
        var tiempo = req.data.tiempo;
        var comando = req.data.comando;
        console.log('Se recibio el comando: ' + comando);
        switch(comando){
            case 'adelante-atras':
                servo1.cw();
                servo2.ccw();
                setTimeout(function () {
                    servo1.ccw();  
                    servo2.ccw();
                    setTimeout(function () {
                        servo1.cw();
                        servo2.ccw();
                        setTimeout(function () {
                            fnPararServos2();
                        },tiempo*1000);
                    },1000);
                },tiempo*1000)
                break;
        }
    })
});


function fnPararServos (tiempo) {
    if (!isNaN(parseInt(tiempo))) {
        setTimeout(function () {
            servo1.stop();
            servo2.stop();
        },tiempo*1000);
    };
}

function fnPararServos2 () {
    servo1.stop();  
    servo2.stop();
}

app.listen(8000, function(){
    console.log("Servidor Express.io listo.");
});