const fetch = require("node-fetch");
const fs = require("fs");

fs.readdir("../jobguy/companies/", async (err, companies) => {
  var errors = [];
  var salaryJson;

  for (const companyName of companies) {
    path = `../jobguy/companies/${companyName}/`;

    try {
      var response = await fetch(
        `https://api.jobguy.ir/public/company/${encodeURI(companyName)}/salary/`
      );

      if (!response.ok) {
        throw response.status;
      }

      console.info(`${companyName}: ✅`);

      salaryJson = await response.json();

      if (salaryJson.data.length) {
        fs.writeFileSync(`${path}salary.json`, JSON.stringify(salaryJson));
      }
    } catch (error) {
      errors.push(companyName);
      console.error(`${companyName}: ❌`);
    }
  }

  if (errors) {
    fs.writeFileSync(`salaries-errors.json`, JSON.stringify(errors));
  }
});
