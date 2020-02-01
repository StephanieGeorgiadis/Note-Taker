// Dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("assets"));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    fs.readFile("db.json", "utf8", function(err, data) {
        if (err) throw err;
        return res.json(JSON.parse(data));
    });
});

app.get("/api/notes/:id", function(req, res) {
    var note = req.params.id;
    fs.readFile("db.json", "utf8", function(err, data) {
        if (err) throw err;
        const history = JSON.parse(data);
        for (var i = 0; i < history.length; i++) {
            if (note === history[i].routeName) {
                return res.json(history[i]);
            }
        }
        return res.json(false);
    });
});

app.post("/api/notes", function(req, res) {
    var newNote = req.body;
    fs.readFile("db.json", "utf8", function(err, data) {
        if (err) throw err;
        else {
            let obj = JSON.parse(data);
            let length = obj.length - 1;

            if (obj.length > 0) {
                newNote.routeName = obj[length].routeName + 1;
            } else {
                newNote.routeName = 1;
            }
            obj.push(newNote);
            json = JSON.stringify(obj, null, 2);
        }
        write(json);
    });
    res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
    fs.readFile("db.json", "utf8", function(err, data) {
        if (err) throw err;
        else {
            obj = JSON.parse(data);
            for (var i = 0; i < obj.length; i++) {
                if (req.params.id == obj[i].routeName) {
                    obj.splice(i, 1);
                }
            }
            edit = JSON.stringify(obj, null, 2);
        }
        write(edit);
        res.json(JSON.parse(edit));
    });
});

app.listen(PORT, function() {
    console.log("Server listening on: http://localhost:" + PORT);
});

const write = function(info) {
    fs.writeFile("db.json", info, function(err) {
        if(err) throw err;
        console.log("File saved");
    });
}