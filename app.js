const express = require('express');
const app = express();
const cheerio = require('cheerio');
const axios = require('axios');
const dotenv = require('dotenv');
const { json } = require('stream/consumers');
dotenv.config();
const port = process.env['PORT'] || 9330;
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to epic api server');
    res.end();
});

//search for games
app.get('/search/:sugg', async (req, res) => {
    const sugg = req.params.sugg;
    console.log(sugg);
    let act_url = "https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22IN%22,%22category%22:%22games%2Fedition%2Fbase%7Cbundles%2Fgames%7Cgames%2Fedition%7Ceditors%7Caddons%7Cgames%2Fdemo%7Csoftware%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22IN%22,%22keywords%22:%22s%22,%22locale%22:%22en-US%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D"
    axios.get(act_url).then((response) => {
        console.log("res", response);
        const data = response.data;
        // let img_url = "";
        // for (x of data) {
        //     img_url = x.img;
        //     img_url = img_url.replace("capsule_sm_120", "header");
        //     x.img = img_url;
        // }
        res.send(data);
        res.end();

    }).catch(e => {
        console.log("err");
        res.end();
    });
});

app.get('/srch', (req, res) => {
    const url = 'https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22%3A%22IN%22%2C%22category%22%3A%22games%2Fedition%2Fbase%7Cbundles%2Fgames%7Cgames%2Fedition%7Ceditors%7Caddons%7Cgames%2Fdemo%7Csoftware%2Fedition%2Fbase%22%2C%22count%22%3A40%2C%22country%22%3A%22IN%22%2C%22keywords%22%3A%22p%22%2C%22locale%22%3A%22en-US%22%2C%22sortBy%22%3A%22relevancy%2CviewableDate%22%2C%22sortDir%22%3A%22DESC%2CDESC%22%2C%22tag%22%3A%22%22%2C%22withPrice%22%3Atrue%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D';

    axios.get(url)
        .then((resp) => {
            console.log(resp);
            console.log("cookies-", resp.cookie);
            res.send(res.cookie);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

