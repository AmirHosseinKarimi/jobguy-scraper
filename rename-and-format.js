const fetch = require("node-fetch");
const fs = require("fs");

fs.readdir("../jobguy/companies/", (err, companies) => {
  var files, rawData, data;

  for (const companyName of companies) {
    path = `../jobguy/companies/${companyName}/`;

    console.log(`Company: ${companyName}`);
    files = fs.readdirSync(path);

    for (var file of files) {
      // Rename company info file
      if (file !== "interview" && file !== "review") {
        fs.renameSync(`${path}${file}`, `${path}info`);
        file = "info";
      }

      rawData = fs.readFileSync(`${path}${file}`);

      data = JSON.parse(rawData);

      rawData = JSON.stringify(data);

      fs.unlinkSync(`${path}${file}`);
      fs.writeFileSync(`${path}${file}.json`, rawData);
    }
  }
});
