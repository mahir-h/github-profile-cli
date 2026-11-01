import { readFile, writeFile, mkdir} from 'fs/promises';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.cache'); //cache folder inside the project
const TEN_MINUTES = 10 * 60 * 1000; // becomes 6,00,000ms

function cacheFile(u){
    return path.join(CACHE_DIR, `${u.toLowerCase()}.json`);
}

export async function readCache(u){
    try{
        const text = await readFile(cacheFile(u),'utf8'); //reads the file as text
        const data = JSON.parse(text); //converts text to object
        const age = Date.now() - data.savedAt; //will let us know how old it is
        if (age > TEN_MINUTES) return null; // if it is more than 10mins return nothing so it can fetch new later
        return data; // else, if it is fresh and in cache, use the data
    }catch(err){
        return null;
    }
}

export async function writeCache(u, profile, repos){
    await mkdir(CACHE_DIR,{recursive: true});
    const data = {savedAt: Date.now(), profile, repos};
    await writeFile(cacheFile(u), JSON.stringify(data, null,2));
}