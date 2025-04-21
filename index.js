import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import ngrok from "@ngrok/ngrok"

const app = express();
const port = 3000;
const API_URL = "https://api.opendota.com/api";

app.use(express.static("public"));
app.use(bodyParser.urlencoded());
app.set('view engine', 'ejs');

var heroes = [];
var heroesInit = false;
var heroesMap = new Map();
var heroesImgMap = new Map();

function imgURL(heroName){
    //let tempText = heroName.replace(/ /g,'').toLowerCase();
    let tempText = heroName.replace("npc_dota_hero_", ``);
    let IMG_URL = `https://cdn.dota2.com/apps/dota2/images/heroes/${tempText}_full.png`;
    return IMG_URL;
}

function heroMapper(heroesArray){
    heroesArray.forEach(hero => {
        heroesMap.set(hero.id, hero.localized_name);
        heroesImgMap.set(hero.id, imgURL(hero.name));
    });
}

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(API_URL + "/heroes");
        if (!heroesInit) {
            heroes = response.data;
            heroesInit = true;
            heroMapper(heroes);
        }
        res.render("search-page.ejs");
    } catch (error) {
        res.render("index.ejs");
        console.log(error.message);
    }
    
})

app.post("/match", async (req, res) => {
    try {
        console.log("req body " + req.body["search"]);
        const response = await axios.get(API_URL + "/matches/" + req.body.search)
        const match = response.data;
        // const hero = response.data[Math.floor(Math.random() * response.data.length)];
        res.render("index.ejs", {
            Match: match,
            HeroesMap: heroesMap,
            Hero_img: heroesImgMap
        });
    } catch (error) {
        res.render("index.ejs", {
            Match: error.message
        });
    }
    
})

app.post("/players", async (req, res) => {
    try {
        // console.log(API_URL + `/search?q=${req.body[`playerName`]}`);
        const response = await axios.get(API_URL + `/search?q=${req.body[`playerName`]}`);
        res.render("search-page.ejs", {
            PlayersList: response.data
        });
    } catch (error) {
        console.log(error.message);
    }
})

// ngrok 
// ngrok.connect({ addr: port, authtoken_from_env: true })
// 	.then(listener => console.log(`Ingress established at: ${listener.url()}`));

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
})

