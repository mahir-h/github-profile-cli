export class ApiError extends Error{
    constructor(msg,status){super(msg);this.status = status;}
}

export async function getJSON(url){
    const headers= {'User-Agent': 'github-profile-cli'};

    if(process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

    let res;
    try{
        res = await fetch(url,{headers});
    } catch{
        throw new ApiError(`Could not reach Github, check your internet connection.`,0);
    }
    
    if(res.status === 404) throw new ApiError('User not found',404);
    if(res.status === 403 || res.status === 429){
        const reset = Number(res.headers.get('x-ratelimit-reset')) * 1000;
        const when = reset ? new Date(reset).toLocaleTimeString() : 'later';
        throw new ApiError(`Rate limited. Try again at ${when}`, res.status);
    }
    if(!res.ok) throw new ApiError(`Github error ${res.status}`, res.status);
    return res.json();
}

export function getProfile(u){
    return getJSON(`https://api.github.com/users/${u}`);
}

export function getRepos(u){
    return getJSON(`https://api.github.com/users/${u}/repos?per_page=100&sort=pushed`);
}