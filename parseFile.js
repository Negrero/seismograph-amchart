const path = require('path');
const fs = require('fs');

const parsefile = function(namefile, cb){
    var event = path.resolve(__dirname, namefile);

    fs.readFile(event, 'utf8', (err, result) => {
        if (err) return cb(err);
        
        var signal = {t: [],
                      x: [],
                      y: [],
                      z: []};

        result.split(/\r?\n/).forEach(function(line) {
            if (!line.includes("#")) {
                var data = line.split(' ');
                
                signal.t.push(parseFloat(data[0]));
                signal.x.push(parseFloat(data[1]));
                signal.y.push(parseFloat(data[2]));
                signal.z.push(parseFloat(data[3]));
            }
        });

        cb(null, signal);        
    });
}

module.exports = parsefile