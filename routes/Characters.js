import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const characterURL = 'https://www.zavvi.com/blog/features/the-worlds-most-popular-characters-to-cosplay/';

function getCharacterInfo() {
    return axios.get(characterURL)
    .then(function ({ data }) {
        let $ = cheerio.load(data);

        let titles = [];
        const src = [];

        $('h3').each((i, el) => {
            if (titles.length > 12) {
                return false;
            }
            titles[i] = $(el).text();
        });
        titles = titles.splice(0,10);

        $('.size-full').each((i, el) => {
            if (src.length > 9) {
                return false;
            }
            src[i] = $(el).attr('src');
        });

        const result = [];
        for (let i = 0; i < src.length; i++) {
            result[i] = {
                title: titles[i],
                src: src[i]
            };
        };
        return result;
    }); 
}

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const characters = await getCharacterInfo();
        res.status(200).json(characters);
    } catch(err) {
        next(err);
    }
});

export default router;