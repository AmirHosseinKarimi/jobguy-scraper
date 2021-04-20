const fetch = require("node-fetch");
const fs = require("fs");

fs.readdir("../jobguy/companies/", async (err, companies) => {
  var errors = [];
  var rawData, data, interviewJson;

  for (const companyName of companies) {
    path = `../jobguy/companies/${companyName}/`;

    console.log(`Company: ${companyName}`);

    rawData = fs.readFileSync(`${path}interview.json`);
    data = JSON.parse(rawData);

    if (data.data.length) {
      for (const interview of data.data) {
        try {
          var response = await fetch(
            "https://api.jobguy.ir/public/interview/" + interview.id
          );

          if (!response.ok) {
            throw response.status;
          }

          console.info(`${interview.id}: ✅`);

          interviewJson = await response.json();

          fs.writeFileSync(
            `../jobguy/interviews/${interview.id}.json`,
            JSON.stringify(interviewJson)
          );
        } catch (error) {
          errors.push(interview.id);
          console.error(`${interview.id}: ❌`);
        }
      }
    }
  }

  fs.writeFileSync(`interviews-errors.json`, JSON.stringify(errors));
});
