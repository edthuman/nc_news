const fs = require("fs/promises");

exports.selectEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((result) => {
        const parsedEndpoints = JSON.parse(result)
        
        return parsedEndpoints;
    });
}