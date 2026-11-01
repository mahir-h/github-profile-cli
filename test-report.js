import {topLanguages, mostStarred, recentActivity} from './report.js';

const repos = [
  { name: 'todo-app',  language: 'JavaScript', stargazers_count: 5,  pushed_at: '2026-10-01T10:00:00Z' },
  { name: 'budget',    language: 'Python',     stargazers_count: 12, pushed_at: '2026-10-20T10:00:00Z' },
  { name: 'notes',     language: 'JavaScript', stargazers_count: 1,  pushed_at: '2026-09-15T10:00:00Z' },
  { name: 'dotfiles',  language: null,         stargazers_count: 0,  pushed_at: '2026-10-25T10:00:00Z' },
];

console.log(topLanguages(repos));
console.log(mostStarred(repos,2));
console.log(recentActivity(repos,2));
console.log(topLanguages([]),mostStarred([]),recentActivity([]));