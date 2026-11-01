import { readCache, writeCache } from "./cache.js";
import { topLanguages, mostStarred, recentActivity } from "./report.js";
import { getProfile,getRepos } from "./api.js";

const u = process.argv[2];

if(!u){
    console.log("Usage: node index.js <username>");
    process.exit(1);
}

try{
    let profile,repos;
    const cached = await readCache(u);

    if(cached){
        profile = cached.profile;
        repos = cached.repos;
        console.log("(From cache)");
    } else{
        [profile,repos] = await Promise.all([getProfile(u),getRepos(u)]);
        await writeCache(u,profile,repos);
    }

    console.log(`${profile.name ?? profile.login}`);
    console.log(`${profile.bio ?? "No bio"}`);
    console.log(`Followers: ${profile.followers} | Public repos: ${profile.public_repos}`);

    console.log("\nTop languages");
    console.table(topLanguages(repos));
    console.log("Most starred");
    console.table(mostStarred(repos));
    console.log("Recently updated");
    console.table(recentActivity(repos));

}catch(err){
    console.log(`Error: ${err.message}`);
    process.exit(1);
}
