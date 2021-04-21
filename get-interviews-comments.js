const fetch = require("node-fetch");
const fs = require("fs");

const interviewsDir = "../jobguy/interviews/";
const interviewsCommentsDir = "../jobguy/interviews-comments/";

if (!fs.existsSync(interviewsCommentsDir)) {
  fs.mkdirSync(interviewsCommentsDir);
}

fs.readdir(interviewsDir, async (err, interviews) => {
  var errors = [];
  var interviewId, interviewComments;

  for (const interviewFileName of interviews) {
    interviewId = interviewFileName.replace(".json", "");
    interviewId = parseInt(interviewId);

    try {
      var response = await fetch(
        `https://api.jobguy.ir/public/interview/${interviewId}/comment_list/?size=1000`
      );

      if (!response.ok) {
        throw response.status;
      }

      console.info(`${interviewId}: ✅`);

      interviewComments = await response.json();

      if (interviewComments.data) {
        fs.writeFileSync(
          interviewsCommentsDir + interviewId + ".json",
          JSON.stringify(interviewComments)
        );
      }
    } catch (error) {
      console.error(error);
      errors.push(interviewId);
      console.error(`${interviewId}: ❌`);
    }
  }

  if (errors) {
    fs.writeFileSync(`interviews-comments-errors.json`, JSON.stringify(errors));
  }
});
