const fs = require('fs');
const https = require('https');

function fetchPhotos(url) {
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', () => resolve(''));
    });
}

async function findPhotos() {
    console.log("Searching Dineout...");
    const dData = await fetchPhotos('https://www.dineout.co.in/amritsar/elgin-cafe-ajnala-road-100234/photos');
    let matches = dData.match(/https:\/\/[a-zA-Z0-9.\/_-]+(?:jpg|jpeg|png)/gi) || [];
    
    // Also try checking the Elgin site itself for images
    console.log("Searching ElginCafe...");
    const eData = await fetchPhotos('https://elgincafe.in/');
    let matches2 = eData.match(/https:\/\/elgincafe\.in\/wp-content\/uploads\/[a-zA-Z0-9.\/_-]+(?:jpg|jpeg|png)/gi) || [];
    
    let all = [...new Set([...matches, ...matches2])];
    console.log("Found photos:");
    all.slice(0, 30).forEach(src => console.log(src));
}

findPhotos();
