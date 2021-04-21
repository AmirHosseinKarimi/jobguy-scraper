const fetch = require("node-fetch");
const fs = require("fs");

fs.readdir("../jobguy/companies/", async (err, companies) => {
  var errors = [];
  var rawData, data, reviewJson;

  for (const companyName of companies) {
    path = `../jobguy/companies/${companyName}/`;

    console.log(`Company: ${companyName}`);

    rawData = fs.readFileSync(`${path}review.json`);
    data = JSON.parse(rawData);

    if (data.data.length) {
      for (const review of data.data) {
        try {
          var response = await fetch(
            "https://api.jobguy.ir/public/company_review/" + review.id
          );

          if (!response.ok) {
            throw response.status;
          }

          console.info(`${review.id}: ✅`);

          reviewJson = await response.json();

          fs.writeFileSync(
            `../jobguy/reviews/${review.id}.json`,
            JSON.stringify(reviewJson)
          );
        } catch (error) {
          errors.push(review.id);
          console.error(`${review.id}: ❌`);
        }
      }
    }
  }

  if (errors) {
    fs.writeFileSync(`reviews-errors.json`, JSON.stringify(errors));
  }
});
