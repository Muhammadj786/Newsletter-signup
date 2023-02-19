const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "c0174919e52c7f8631c237a6d1698119-us14",
  server: "us14",
});

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = process.env.PORT || 3000;



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post('/', function(req, res) {
  const listId = "7755947cd9";
  const subscribingUser = {
    firstName: req.body.fName,
    lastName: req.body.lName,
    email: req.body.email,
  };

  async function run() {
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        }
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${
            response.id
          }.`
      );

      res.sendFile(__dirname + "/success.html");

    } catch (e) {
      if (e.status === 404) {
        console.error(`This email is not subscribed to this list`, e);
        res.sendFile(__dirname + "/failure.html");
      }

    }
  }
  run();
});




app.post("/failure", function(req, res){
  res.redirect("/")
} );




app.listen(port, function() {
  console.log("listening to port 3000")
})
