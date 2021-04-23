const fetch = require("node-fetch");
const fs = require("fs");

fs.readdir("../jobguy/companies/", async (err, companies) => {
  var errors = [];
  var questionsJson;

  for (const companyName of companies) {
    path = `../jobguy/companies/${companyName}/`;

    try {
      var response = await fetch(
        `https://api.jobguy.ir/public/company/${companyName}/questions/?size=1000`
      );

      if (!response.ok) {
        throw response.status;
      }

      console.info(`${companyName}: ✅`);

      questionsJson = await response.json();

      if (questionsJson.data.length) {
        fs.writeFileSync(
          `${path}questions.json`,
          JSON.stringify(questionsJson)
        );
      }
    } catch (error) {
      errors.push(companyName);
      console.error(`${companyName}: ❌`);
    }
  }

  if (errors) {
    fs.writeFileSync(`questions-errors.json`, JSON.stringify(errors));
  }
});
