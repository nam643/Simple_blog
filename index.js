import express from "express";
import bodyParser from "body-parser";
const port = 3000;
const app = express();

function newCard(topic, title, date, description, content) {
  this.topic = topic;
  this.title = title;
  this.date = date;
  this.description = description;
  this.content = content;
}
function newContent(title, content) {
  this.title = title;
  this.content = content;
}

var cards = [];
var currIdx = 0;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/blog", (req, res) => {
  res.render("viewblog.ejs", {
    listContent: cards,
  });
});

app.get("/home", (req, res) => {
  res.render("index.ejs");
});

app.get("/create", (req, res) => {
  res.render("create.ejs", {
    isEdit: false,
    idx: "",
    card: null
  });
});
app.post("/blog", (req, res) => {
  const isEdit = req.body.isEdit === "1";
  const idx = Number(req.body.idx);

  const updatedCard = new newCard(
    req.body.topic,
    req.body.title,
    req.body.date,
    req.body.description,
    req.body.content
  );

  if (isEdit && !Number.isNaN(idx) && idx >= 0 && idx < cards.length) {
    cards[idx] = updatedCard;
  } else {
    cards.push(updatedCard);
  }

  return res.redirect("/blog");
});

app.post("/content", (req, res) => {
  const idx = Number(req.body.idx);
  const action = req.body.action;

  if (Number.isNaN(idx) || idx < 0 || idx >= cards.length) {
    return res.redirect("/blog");
  }

  if (action === "delete") {
    cards.splice(idx, 1);
    return res.redirect("/blog");
  }

  if (action === "edit") {
    return res.render("create.ejs", {
      isEdit: true,
      idx,
      card: cards[idx]
    });
  }

  // default: view
  return res.render("content.ejs", {
    contentTitle: cards[idx].title,
    contentContent: cards[idx].content
  });
});


app.listen(port, () => {
  console.log("Server is running on port ", port);
});
