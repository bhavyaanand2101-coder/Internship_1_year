import React, { useState, useCallback } from 'react';
import axios from 'axios';
import {
  Search, Star, GitFork, Users, UserCheck, MapPin,
  Link, Building, AtSign, Calendar, BookOpen, Code2, ExternalLink,
  AlertCircle, Loader2, ArrowUpRight
} from 'lucide-react';
import './index.css';
import './App.css';


/**
 * Interface representing the detailed GitHub User Profile retrieved from GitHub API.
 */
interface GitHubUser {
  login: string;          // GitHub username/handle
  name: string;           // Display name of the user
  avatar_url: string;     // URL to user's profile image
  html_url: string;       // Link to user's GitHub web profile
  bio: string;            // Biography description
  company: string;        // Company / organization name
  location: string;       // User's location (city/country)
  blog: string;           // Personal website URL
  twitter_username: string; // Twitter handler
  public_repos: number;   // Total count of public repositories
  followers: number;      // Total follower count
  following: number;      // Total following count
  created_at: string;     // Account creation date (ISO string)
  public_gists: number;   // Total count of public gists
}

/**
 * Interface representing a single GitHub Repository entry.
 */
interface GitHubRepo {
  id: number;
  name: string;           // Repository name
  description: string;    // Repository description
  html_url: string;       // Direct link to the repository on GitHub
  language: string;       // Primary coding language used
  stargazers_count: number; // Star count
  forks_count: number;    // Fork count
  watchers_count: number; // Watcher count
  updated_at: string;     // Last updated date (ISO string)
  topics: string[];       // Array of tags/topics applied to the repo
  fork: boolean;          // Whether the repo is a fork of another repo
}

/**
 * Mapping of languages to their official hex colors for repository visual dots.
 */
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  Java: '#b07219', Go: '#00ADD8', Rust: '#dea584', C: '#555555',
  'C++': '#f34b7d', 'C#': '#178600', Ruby: '#701516', PHP: '#4F5D95',
  Swift: '#F05138', Kotlin: '#A97BFF', Dart: '#00B4AB', Shell: '#89e051',
  HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Elixir: '#6e4a7e',
};

/**
 * Formats an ISO date string into a user-friendly format (e.g. 'Oct 23, 2012').
 */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Calculates a relative time difference string (e.g. '3d ago', '1y ago').
 */
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function App() {
  // State variables for input query, active user profile, repository list, loading state, and error handling
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Sort selection for active repositories ('stars' default, 'updated', or alphabetical 'name')
  const [repoSort, setRepoSort] = useState<'stars' | 'updated' | 'name'>('stars');
  // Local filter search query to filter list of repositories by name or description
  const [repoFilter, setRepoFilter] = useState('');

  /**
   * Fetches user profile data and repository data concurrently from GitHub APIs.
   * If a specific username is provided, it uses it instead of the current state query.
   */
  const search = useCallback(async (username?: string) => {
    const q = (username ?? query).trim();
    if (!q) return;
    
    setLoading(true);
    setError('');
    setUser(null);
    setRepos([]);
    
    try {
      const headers = { Accept: 'application/vnd.github+json' };
      // Request user data and repository data in parallel
      const [userRes, reposRes] = await Promise.all([
        axios.get<GitHubUser>(`https://api.github.com/users/${q}`, { headers }),
        axios.get<GitHubRepo[]>(`https://api.github.com/users/${q}/repos?per_page=100&sort=updated`, { headers }),
      ]);
      
      setUser(userRes.data);
      // Filter out forked repositories, focusing only on the user's original work
      setRepos(reposRes.data.filter(r => !r.fork));
    } catch (e: any) {
      if (e.response?.status === 404) {
        setError(`No GitHub user found for "${q}"`);
      } else if (e.response?.status === 403) {
        setError('GitHub API rate limit reached. Try again in a minute.');
      } else {
        setError('Something went wrong. Check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [query]);

  /**
   * Filters and sorts the repository list dynamically based on user interaction.
   */
  const sortedRepos = [...repos]
    .filter(r => r.name.toLowerCase().includes(repoFilter.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(repoFilter.toLowerCase()))
    .sort((a, b) => {
      if (repoSort === 'stars') return b.stargazers_count - a.stargazers_count;
      if (repoSort === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return a.name.localeCompare(b.name);
    });

  /**
   * Aggregate and calculate top 5 programming languages used in the original repositories.
   */
  const topLanguages = repos.reduce<Record<string, number>>((acc, r) => {
    if (r.language) acc[r.language] = (acc[r.language] || 0) + 1;
    return acc;
  }, {});
  const topLangs = Object.entries(topLanguages).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <Code2 size={22} className="logo-icon" />
            <span>GitLens</span>
          </div>
          <div className="search-bar">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search GitHub username…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button className="search-btn" onClick={() => search()} disabled={loading}>
              {loading ? <Loader2 size={15} className="spin" /> : 'Search'}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {/* Hero / Empty State */}
        {!user && !loading && !error && (
          <div className="hero">
            <div className="hero-glow" />
            <Code2 size={48} className="hero-icon" />
            <h1 className="hero-title">Explore GitHub Profiles</h1>
            <p className="hero-sub">Search any GitHub username to see their repositories, followers, and activity.</p>
            <div className="suggestions">
              {['torvalds', 'gaearon', 'sindresorhus', 'yyx990803'].map(u => (
                <button key={u} className="suggestion-chip" onClick={() => { setQuery(u); search(u); }}>
                  @{u}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="center-state">
            <Loader2 size={36} className="spin accent" />
            <p className="loading-text">Fetching profile…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-card">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Profile */}
        {user && !loading && (
          <div className="profile-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <div className="avatar-wrap">
                <img src={user.avatar_url} alt={user.login} className="avatar" />
                <div className="avatar-ring" />
              </div>
              <div className="profile-names">
                <h2 className="display-name">{user.name || user.login}</h2>
                <a href={user.html_url} target="_blank" rel="noreferrer" className="username">
                  @{user.login} <ArrowUpRight size={12} />
                </a>
              </div>
              {user.bio && <p className="bio">{user.bio}</p>}

              {/* Stats grid */}
              <div className="stats-grid">
                <div className="stat">
                  <BookOpen size={14} className="stat-icon" />
                  <div>
                    <div className="stat-val">{user.public_repos}</div>
                    <div className="stat-label">Repos</div>
                  </div>
                </div>
                <div className="stat">
                  <Users size={14} className="stat-icon" />
                  <div>
                    <div className="stat-val">{user.followers.toLocaleString()}</div>
                    <div className="stat-label">Followers</div>
                  </div>
                </div>
                <div className="stat">
                  <UserCheck size={14} className="stat-icon" />
                  <div>
                    <div className="stat-val">{user.following}</div>
                    <div className="stat-label">Following</div>
                  </div>
                </div>
                <div className="stat">
                  <Code2 size={14} className="stat-icon" />
                  <div>
                    <div className="stat-val">{user.public_gists}</div>
                    <div className="stat-label">Gists</div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="detail-list">
                {user.company && <div className="detail"><Building size={13} /><span>{user.company}</span></div>}
                {user.location && <div className="detail"><MapPin size={13} /><span>{user.location}</span></div>}
                {user.blog && (
                  <div className="detail">
                    <Link size={13} />
                    <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer">
                      {user.blog.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {user.twitter_username && (
                  <div className="detail">
                    <AtSign size={13} />
                    <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer">
                      @{user.twitter_username}
                    </a>
                  </div>
                )}
                <div className="detail"><Calendar size={13} /><span>Joined {formatDate(user.created_at)}</span></div>
              </div>

              {/* Top languages */}
              {topLangs.length > 0 && (
                <div className="langs-section">
                  <div className="langs-title">Top Languages</div>
                  <div className="langs-list">
                    {topLangs.map(([lang, count]) => (
                      <div key={lang} className="lang-item">
                        <span className="lang-dot" style={{ background: LANG_COLORS[lang] || '#8b949e' }} />
                        <span className="lang-name">{lang}</span>
                        <span className="lang-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Repos */}
            <section className="repos-section">
              <div className="repos-header">
                <h3 className="repos-title">
                  Repositories <span className="repo-count">{sortedRepos.length}</span>
                </h3>
                <div className="repos-controls">
                  <input
                    className="filter-input"
                    placeholder="Filter repos…"
                    value={repoFilter}
                    onChange={e => setRepoFilter(e.target.value)}
                  />
                  <div className="sort-btns">
                    {(['stars', 'updated', 'name'] as const).map(s => (
                      <button
                        key={s}
                        className={`sort-btn ${repoSort === s ? 'active' : ''}`}
                        onClick={() => setRepoSort(s)}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="repos-grid">
                {sortedRepos.map(repo => (
                  <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer" className="repo-card">
                    <div className="repo-top">
                      <BookOpen size={14} className="repo-icon" />
                      <span className="repo-name">{repo.name}</span>
                      <ExternalLink size={12} className="repo-ext" />
                    </div>
                    {repo.description && <p className="repo-desc">{repo.description}</p>}
                    {repo.topics?.length > 0 && (
                      <div className="repo-topics">
                        {repo.topics.slice(0, 3).map(t => (
                          <span key={t} className="topic">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="repo-meta">
                      {repo.language && (
                        <span className="repo-lang">
                          <span className="lang-dot" style={{ background: LANG_COLORS[repo.language] || '#8b949e' }} />
                          {repo.language}
                        </span>
                      )}
                      <span className="repo-stat"><Star size={12} />{repo.stargazers_count}</span>
                      <span className="repo-stat"><GitFork size={12} />{repo.forks_count}</span>
                      <span className="repo-stat repo-updated">{timeAgo(repo.updated_at)}</span>
                    </div>
                  </a>
                ))}
              </div>

              {sortedRepos.length === 0 && repoFilter && (
                <div className="no-results">No repos match "{repoFilter}"</div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
