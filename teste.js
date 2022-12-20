const fs = require('fs');

fs.readdir('medias', (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
});