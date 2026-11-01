export function topLanguages(repos, n=5){
    const counts = repos.reduce((acc,repo) => {
        if(!repo.language) return acc;
        acc[repo.language] = (acc[repo.language] || 0 ) + 1;
        return acc;
    },{});

    return Object.entries(counts)
        .sort((a,b) => b[1] - a[1])
        .slice(0,n)
        .map(([language, count]) => ({language, count}));

}

export function mostStarred(repos, n=5){
    return [...repos]
        .sort((a,b) => b.stargazers_count - a.stargazers_count)
        .slice(0,n)
        .map(r => ({name: r.name, stars: r.stargazers_count}));
}

export function recentActivity(repos, n=5){
    return [...repos]
        .sort((a,b) => new Date(b.pushed_at) - new Date(a.pushed_at))
        .slice(0,n)
        .map(r => ({name: r.name, updated: new Date(r.pushed_at).toLocaleDateString('en-NZ')}));
}