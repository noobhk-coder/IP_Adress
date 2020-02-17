const express = require('express');
const router = express.Router();
const data = require('../data');
const ipData = data.ip;

router.post('/ipResult', async (req, res) => {
    let ipAd = req.body.ipAddress;

    try {
        const ipResult = await ipData.create(ipAd);
        if (ipResult === false) {
            res.render('layouts/ipResult', { title: "IP Not Found", notfound: true, IpAd: ipAd })
        } else {
            res.render('layouts/ipResult', { title: "IP Found", notfound: false, IpInfo: ipResult, IpAd: ipAd })
        }
    } catch (e) {
        res.status(400).json({ error: 'Error not found' });
    }
});

router.get('/', async (req, res) => {
    try {
        res.render('layouts/home', { title: "IP Finder" })
    }
    catch{
        res.status(404).json({ error: "Some problem." })
    }
});

router.get('/searchResult', async (req, res) => {

    let searchN;
    let date1 = "";
    let date2 = "";
    if (req.query.searchNumber) {
        searchN = req.query.searchNumber;
    }

    if (req.query.date1) {
        date1 = req.query.date1;
    }

    if (req.query.date2) {
        date2 = req.query.date2;
    }

    try {
        if (searchN <= 0) {
            res.status(404);
            res.render('layouts/error', { title: "Input Not valid", numberInvalid: true })
        }
        else {
            const ipResult = await ipData.getAllN(searchN, date1, date2);
            if (searchN !== undefined) {
                res.render('layouts/searchResult', { title: "IP Search Query", searchN: searchN, searchResult: ipResult, numberSearch: true })
            } else {
                res.render('layouts/searchResult', { title: "IP Search Query", date1: date1, date2: date2, searchResult: ipResult, numberSearch: false })
            }

        }
    }
    catch{
        res.status(404).json({ error: "Some problem." })
    }
});

module.exports = router;
