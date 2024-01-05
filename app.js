const express = require('express');
const app = express();
const cheerio = require('cheerio');
// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');

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
app.get('/puppt', async (req, res) => {
    try {
        const act_url = "https://store.epicgames.com/graphql?operationName=searchStoreQuery&variables=%7B%22allowCountries%22:%22IN%22,%22category%22:%22games%2Fedition%2Fbase%7Cbundles%2Fgames%7Cgames%2Fedition%7Ceditors%7Caddons%7Cgames%2Fdemo%7Csoftware%2Fedition%2Fbase%22,%22count%22:40,%22country%22:%22IN%22,%22keywords%22:%22s%22,%22locale%22:%22en-US%22,%22sortBy%22:%22relevancy,viewableDate%22,%22sortDir%22:%22DESC,DESC%22,%22tag%22:%22%22,%22withPrice%22:true%7D&extensions=%7B%22persistedQuery%22:%7B%22version%22:1,%22sha256Hash%22:%227d58e12d9dd8cb14c84a3ff18d360bf9f0caa96bf218f2c5fda68ba88d68a437%22%7D%7D";

        // // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        puppeteer.use(StealthPlugin());

        // // Add adblocker plugin to block all ads and trackers (saves bandwidth)
        const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
        puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

        // Launch the browser and open a new blank page
        const browser = await puppeteer.launch({
            headless: 'new',
            ignoreHTTPSErrors: true,
            args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']

        });
        const page = await browser.newPage();

        // Navigate the page to a URL
        const response = await page.goto(act_url);
        console.log("initial status: ", response.status());
        // Check if the request was successful (status code 200)

        const cookies = await page.cookies();
        console.log("cookies: ", cookies[0]?.value);
        await page.setCookie(...cookies);
        const data2 = await page.goto(act_url);
        console.log("cookies2: ", await page.cookies());

        console.log("status: ", data2.status());
        if (data2.status() === 200) {
            // Parse the JSON response
            const jsonResponse = await data2.json();

            // Now you have the JSON data
            console.log('JSON Response:', jsonResponse);
            res.send(jsonResponse);
        } else {
            console.error('Request failed with status:', data2.status());
            res.send("error");
        }

        res.end();
        await browser.close();
    } catch (err) {
        if (err.response) {
            const cookies = err.response.headers;
            console.log(cookies);
        } else {
            console.log(err);
        }
    };

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

    axios.get(url, {
        headers: {
            'authority': '.store.epicgames.com',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,eo;q=0.7,hi;q=0.6',
            'cache-control': 'max-age=0',
            'if-none-match': 'W/"1ae98-Exd/dSuvkccsliAwXSCLxs2W+zo"',
            'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Cookie': '__cf_bm=llOVxPhmIrV7I7gKfO6fU7gtInax_O6NtFxZS_VX1Fo-1699955627-0-AdefZH4QWRmFsfAAdUjPTrrC5zbEKnODcLHL/qcP0EvichVy4+bGI4hYX1qYtaNB4ZdF9d0YtFW8ROnL/Dw/bKc=; path=/; expires=Tue, 14-Nov-23 10:23:47 GMT; domain=.store.epicgames.com; HttpOnly; Secure; SameSite=None'
        }
    }).then((resp) => {
        console.log("resp");
    }).catch((err) => {
        if (err.response) {
            const cookies = err.response.headers['set-cookie'];
            console.log("cookies-", cookies);
            res.cookie("__cf_bm", "3VcZom.PD8EST0PSw8KWp42NQXtoGSly1LRyF19e2tM-1699975824-0-ATnTCDXcEtRGS1YQymt0ZowVBbNrHid+56ItdPKP+OkkUN4at8DN1NtmnsfAh4+MqLKxHE+f+pXHHIahtdnvKCI=", {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "none",
            }
            );
            console.log("cookies down-", err.response.headers['set-cookie']);

            axios.get(url, {
                headers: { ...err.response.headers },
            }).then((resp) => {
                console.log("resp", resp.headers);
                res.send("resp");
            }).catch((err2) => {
                console.error('Error:', err2.response.headers);
                res.send(err2);

            });
            console.log("err");
            // res.send(err);
        }
    });

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});



