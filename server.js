//import app from 'expressjs';
const express = require('express');
const parseFile = require('./parseFile');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
const simplify = require('./simplify');
const diff = require('./diff');
const Polynomial = require('polynomial');
const path = require('path');

const math = require('mathjs');
const integral = require('mathjs-simple-integral')
const nameFiles = [
    "./events/19092057.txt",
    "./events/18060009.txt"
]
let app = express();

app.use(express.static('client'));
const PORT = process.env.NODE_ENV | 5001;
let signal
let original_signal
app.get('/signal', function (req, res) {
    res.send(signal);
})
/**
 * derivate v = mm/s2
 */
app.get('/gradient', function (req, res) {

    gradient(original_signal, function (err, data) {
        if (err) return res.send(err)
        res.send(data)
    })
});
/**
 * displacement v = mm
 */
app.get('/integration', function (req, res) {
    integration(original_signal, function (err, data) {
        if (err) return res.send(err)
        res.send(data)
    })
});
app.listen(PORT, function (err) {
    console.log('Listen in port %s', PORT);

});
gradient = function (data, cb) {    
    var array = []
    data.t.forEach(function (t, i) {
        array.push([ data.x[i], data.y[i], data.z[i]])
    })
    var command = 'python ' + path.resolve(__dirname, './python/gradient.py ') + JSON.stringify(data.x);
    var arg = path.resolve(__dirname, './python/gradient.py')
   
    var a = JSON.stringify(array)
    const python = spawn('python', [arg])
    
    let dataString = ''
   
    python.stdout.on('data', (chunk) => {
        dataString += chunk
        //cb(null, JSON.parse(data.toString()));  
    });
    python.stdout.on('end', function(){
        console.log('Sum of numbers=',dataString);
        dataString = dataString.replace("['",'')
        dataString = dataString.replace("']",'')
        try{
            let array = JSON.parse(dataString)
            let result = []
            
            array.forEach(function(e, i){
                result.push({
                    t: original_signal.t[i],
                    x: e[0],
                    y: e[1],
                    z: e[2]
                })
            })            
            cb(null, result);
        }catch(ex){
            cb("error JSON.parse");
        }
        
      });
    python.stderr.on('data', (data) => {
        console.log(`ps stderr: ${data}`);
    })
    python.on('close', (code) => {
        if (code !== 0) {
            console.log(`grep process exited with code ${code}`);
        }
    })
    python.stdin.write(a)
    python.stdin.end()
    /* 
     exec(command, (err, stdout, stderr) => {
         if (err) return cb(err);
        
         let b= JSON.parse(stdout)
         cb(null, JSON.parse(stdout));        
     });
     */

}

integration = function (data, cb) {
    var array = []
    data.t.forEach(function (t, i) {
        array.push([data.x[i], data.y[i], data.z[i]])
    })
    var command = 'python ' + path.resolve(__dirname, './python/gradient.py ') + JSON.stringify(data.x);
    var arg = path.resolve(__dirname, './python/integration.py')
   
    var a = JSON.stringify(original_signal)
    const python = spawn('python', [arg])
    
    let dataString = ''
   
    python.stdout.on('data', (chunk) => {
        dataString += chunk
        //cb(null, JSON.parse(data.toString()));  
    });
    python.stdout.on('end', function(){
        console.log('Sum of numbers=',dataString);
        dataString = dataString.replace("['",'')
        dataString = dataString.replace("']",'')
        try{
            let array = JSON.parse(dataString)
            let result = []
            array.x.forEach(function(e, i){
                result.push({
                    t: original_signal.t[i],
                    x: array.x[i],
                    y: array.y[i], //original_signal.y[i], //e[1],
                    z: array.z[i], //original_signal.z[i] //e[2]
                })
            })            
            cb(null, result);
        }catch(ex){
            cb("error JSON.parse");
        }
        
      });
    python.stderr.on('data', (data) => {
        console.log(`ps stderr: ${data}`);
    })
    python.on('close', (code) => {
        if (code !== 0) {
            console.log(`grep process exited with code ${code}`);
        }
    })
    python.stdin.write(a)
    python.stdin.end()
    /* 
     exec(command, (err, stdout, stderr) => {
         if (err) return cb(err);
        
         let b= JSON.parse(stdout)
         cb(null, JSON.parse(stdout));        
     });
     */

}
parseFile(nameFiles[0], function (err, signal_parse) {

    if (err) {
        console.log(err);
    } else {
        const date_init = new Date();
        let data = [];
        original_signal = {
            t: [],
            x: [],
            y: [],
            z: []
        };
        let date = new Date();
        signal_parse.t.forEach(function (element, index) {
            element = new Date(date_init.getTime() + (element * 1000)).getTime();
            if (signal_parse.x[index] !== NaN)
                data.push({
                    d: signal_parse.t[index],
                    t: element,
                    x: signal_parse.x[index],
                    y: signal_parse.y[index],
                    z: signal_parse.z[index],
                })
        });
        var rs = data.slice(0, data.length - 1)
        let points = simplify(rs, 0.0001)
        original_signal.d = []
        points.forEach(function (e) {
            original_signal.d.push(e.d)
            original_signal.t.push(e.t)
            original_signal.x.push(e.x)
            original_signal.y.push(e.y)
            original_signal.z.push(e.z)
        })

        //let points = simplify(data, 2.49, false)
        /*
        let date_length = signal_parse.t[signal_parse.t.length - 2];
        let hz = Math.trunc((data.length-1) / date_length);
        let total_group = (date_length * 1000) / 10;
        let group = 10;
        if (total_group > 7500){
            total_group = Math.trunc((date_length * 1000) / 100);
            group = 100;
        }
        hz_group = hz * group / 1000;  
        let hz_8000 = 7000 / date_length;
        let num = (hz_8000 * group) / 1000;
        let frecuency_8000 = Math.ceil(num);
        let sample = [];
        for (i=0; sample.length < 7000; i++){
            let sub_sampling_array = data.slice(i, i * hz_group);
            sub_sampling_array.sort();
            sample = sample.concat(sub_sampling_array.slice(0, frecuency_8000));
            //console.log(i)
        }
        console.log(data.length-1)
        console.log(Number(data[0].t))
        console.log(Number(data[data.length - 1]))
        */
        signal = points;

    }
})