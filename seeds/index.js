const path = require('path');
const fs = require('fs');
const { exec } = require("child_process");
const db = require('../config/keys').mongoURI;

const users = require('./data/users');

const data = { users };

const output = "./output";

if (!fs.existsSync(output)) {
  fs.mkdirSync(output);
}

Object.entries(data).forEach(([key, value]) => {
  fs.writeFile(`output/${key}.json`, JSON.stringify(value), err => {
    if (err) throw err;
    console.log(`The file, ${key}.json has been saved!`);
  });

  const command = `mongoimport --uri "${db}" \
       --collection ${key} --jsonArray \
       --file ${path.join(__dirname, output, `${key}.json`)}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
});
