# github-profile-cli

A Node.js command-line tool that shows a quick summary of any GitHub user: their profile, top languages, most-starred repositories and most recently updated repositories.

## Features

- Fetches the user's profile and repositories **in parallel** with `Promise.all`
- **Caches results for 10 minutes** in a local `.cache/` folder, so repeat lookups are instant and don't use up API requests
- Shows reports as clean tables in the terminal (`console.table`)
- Clear error messages for unknown users, GitHub rate limits and no internet connection (see [Error messages](#error-messages))
- Optional `GITHUB_TOKEN` support for a higher rate limit
- No npm dependencies

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses the built-in `fetch`)

## Installation

```bash
git clone https://github.com/mahir-h/github-profile-cli.git
cd github-profile-cli
```

## Usage

```bash
node index.js <github-username>
```

Example:

```bash
node index.js torvalds
```

Usernames are not case-sensitive: `Torvalds` and `torvalds` give the same result and share one cache file.

### Using a GitHub token (optional)

Without a token, GitHub allows **60 requests per hour**. Each lookup that isn't cached uses 2 requests (profile and repos). To raise the limit to 5,000 per hour, create a [personal access token](https://github.com/settings/tokens) and set it as an environment variable:

```powershell
# Windows PowerShell
$env:GITHUB_TOKEN="your_token_here"
node index.js torvalds
```

```bash
# macOS / Linux
GITHUB_TOKEN=your_token_here node index.js torvalds
```

## Example output

Trimmed example. The numbers and repo names depend on the user and change over time.

```
(From cache)
Linus Torvalds
No bio
Followers: 330020 | Public repos: 12

Top languages
┌─────────┬────────────┬───────┐
│ (index) │ language   │ count │
├─────────┼────────────┼───────┤
│ 0       │ 'C'        │ 10    │
│ 1       │ 'C++'      │ 1     │
│ 2       │ 'OpenSCAD' │ 1     │
└─────────┴────────────┴───────┘
Most starred
┌─────────┬───────────────┬────────┐
│ (index) │ name          │ stars  │
├─────────┼───────────────┼────────┤
│ 0       │ 'linux'       │ 254012 │
│ 1       │ 'AudioNoise'  │ 4527   │
│ 2       │ 'GuitarPedal' │ 2478   │
│ 3       │ 'uemacs'      │ 2187   │
│ 4       │ 'test-tlb'    │ 1080   │
└─────────┴───────────────┴────────┘
Recently updated
┌─────────┬───────────────────────┬──────────────┐
│ (index) │ name                  │ updated      │
├─────────┼───────────────────────┼──────────────┤
│ 0       │ 'linux'               │ '1/11/2026'  │
│ 1       │ 'subsurface-for-dirk' │ '19/10/2026' │
│ 2       │ 'GuitarPedal'         │ '16/10/2026' │
│ 3       │ 'uemacs'              │ '7/08/2026'  │
│ 4       │ 'ScrollWheel'         │ '3/06/2026'  │
└─────────┴───────────────────────┴──────────────┘
```

`(From cache)` only appears when the same user was looked up in the last 10 minutes.

## Error messages

| Situation | What you see |
|---|---|
| No username given | `Usage: node index.js <username>` |
| The user doesn't exist | `Error: User not found` |
| GitHub rate limit reached | `Error: Rate limited. Try again at <time>` (shows the reset time when GitHub sends it) |
| No internet connection | `Error: Could not reach Github, check your internet connection.` |
| Any other GitHub error | `Error: Github error <status code>` |

In every error case the program exits with code `1`.

## Project structure

| File | What it does |
|---|---|
| `index.js` | Entry point. Reads the username, checks the cache, fetches from GitHub if needed, and prints the report. |
| `api.js` | Talks to the GitHub API. `getJSON()` sends the request and turns failures (404, 403/429, network errors) into a custom `ApiError` with a clear message. `getProfile()` and `getRepos()` build the URLs. |
| `report.js` | Pure functions that turn the repo list into reports: `topLanguages()`, `mostStarred()` and `recentActivity()`. They make no network calls and return `[]` for users with no repos. |
| `cache.js` | Saves results to `.cache/<username>.json` with a `savedAt` timestamp. `readCache()` returns the data only if it's less than 10 minutes old; `writeCache()` saves new data. |
| `test-report.js` | Runs the report functions on sample data so the results can be checked by hand. |

## How it works

```
node index.js <username>
        │
        ▼
  readCache(username)
        │
  cache less than 10 min old? ── yes ──► use cached profile + repos ──┐
        │ no                                                          │
        ▼                                                             │
  Promise.all([getProfile, getRepos])   ← both requests at once       │
        │                                                             │
  writeCache(username, profile, repos)                                │
        │                                                             │
        ▼                                                             ▼
             print profile + topLanguages / mostStarred / recentActivity
```

## Testing the report functions

```bash
node test-report.js
```

This prints the result of each report function for a small set of sample repos, plus the empty-list case, which should print `[] [] []`.

## What I learned

- How **async/await** and **promises** work, and how `Promise.all` runs two API calls at the same time instead of one after the other
- Calling a real REST API with `fetch`, reading **HTTP status codes** and response headers, and handling errors with a custom error class
- Reading and writing files with `fs/promises` and `path` to build a simple **time-based cache**
- Splitting a program into small modules that each have one job
- Using array methods (`reduce`, `sort`, `slice`, `map`) to turn raw data into useful reports
- Debugging real bugs: an unreachable line after `return`, block scope with `const`, and a cache that never expired because of a typo (`Date.savedAt` instead of `data.savedAt`)

## Author

Mahir Habibullah · [github.com/mahir-h](https://github.com/mahir-h)