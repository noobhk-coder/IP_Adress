const mongoCollections = require("../config/mongoCollections");
const IpCollec = mongoCollections.ips;
const { ObjectId } = require("mongodb").ObjectID;
const axios = require('axios');

module.exports = {

    async create(IpAd) {

        let url = 'http://ip-api.com/json/' + IpAd;
        const res = await axios.get(url);
        result = res.data;
        if (result.status === "fail") {
            return false;
        }

        const IpCollection = await IpCollec();
        var today = new Date();
        var dd = today.getDate().toString();
        dd = dd.length > 1 ? dd : '0' + dd;
        var mm = (today.getMonth() + 1).toString();
        mm = mm.length > 1 ? mm : '0' + mm;
        var yyyy = today.getFullYear();
        var tday = dd + '/' + mm + '/' + yyyy;
        let newIP = {
            IPname: IpAd,
            lat: result.lat,
            lon: result.lon,
            country: result.country,
            date: tday
        };

        const insertInfo = await IpCollection.insertOne(newIP);
        if (insertInfo.insertedCount === 0) {
            throw "Could not add animal.";
        }

        const newId = insertInfo.insertedId;
        return result;

    },

    async get(id) {

        if (!id) {
            throw "Please provide an ID to search for the animal."
        }

        const IpCollection = await IpCollec();

        if (!ObjectId.isValid(id)) {
            throw "Wrong ID given"
        }

        const ipData = await IpCollection.findOne({ _id: ObjectId(id) });
        return ipData;

    },

    async getAllN(searchN, date1, date2) {

        const IpCollection = await IpCollec();
        const IPAll = await IpCollection.find({}).toArray();
        max = IPAll.length - 1;
        let allData = [];
        let j = 0;
        if (searchN !== undefined) {
            if (max > searchN) {
                for (let i = max; i > (max - searchN); i--) {

                    const data = await this.get(IPAll[i]._id);
                    allData[j] = data;
                    j++;
                }
            } else {
                for (let i = max; i >= 0; i--) {
                    const data = await this.get(IPAll[i]._id);
                    allData[j] = data;
                    j++;
                }
            }

        } else {
            for (let i = 0; i <= max; i++) {
                const data = await this.get(IPAll[i]._id);
                if (data.date >= date1 && data.date <= date2) {
                    allData[j] = data;
                    j++;
                }
            }
        }

        return allData;
    },

}


