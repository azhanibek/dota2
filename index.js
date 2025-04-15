import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.opendota.com/api";

app.use(express.static("public"));
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');


function imgURL(heroName){
    //let tempText = heroName.replace(/ /g,'').toLowerCase();
    let tempText = heroName.replace("npc_dota_hero_", ``);
    let IMG_URL = `https://cdn.dota2.com/apps/dota2/images/heroes/${tempText}_full.png`;
    return IMG_URL;
}

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/heroes")
        const hero = response.data[Math.floor(Math.random() * response.data.length)];
        res.render("search-page.ejs", {
            Hero: hero,
            Hero_img: imgURL(hero.name)
        });
    } catch (error) {
        res.render("index.ejs", {
            Hero: error.message
        });
    }
    
})

app.post("/match", async (req, res) => {
    try {
        console.log("req body " + req.body["search"]);
        const response = await axios.get(API_URL + "/matches/" + req.body.search)
        const match = response.data;
        // const hero = response.data[Math.floor(Math.random() * response.data.length)];
        res.render("index.ejs", {
            Match: match
            //Hero_img: imgURL(hero.name)
        });
    } catch (error) {
        res.render("index.ejs", {
            Match: error.message
        });
    }
    
})

app.get("/hero", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/constants/heroes")
        let temp = Object.keys(response.data);
        const hero = response.data[temp[Math.floor(Math.random() * temp.length)]];
        res.render("index.ejs", {
            Hero: JSON.stringify(hero),
            Hero_img: imgURL(hero.name)
        });
    } catch (error) {
        res.render("index.ejs", {
            Hero: error.message,
            Hero_img: error.message
        });
    }
    
})

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
})

