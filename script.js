const counter = document.getElementById("counter");
const timeDisplay = document.getElementById("time");
const org = "cbitosc";
const token = "your-github-classic-key";

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
  timeDisplay.innerText = `Current Time: ${timeStr}`;
}


setInterval(updateClock, 1000);
updateClock(); 

async function getTodayCommitCount() {
  counter.innerText = "Loading...";

  try {
    const headers = token ? { Authorization: `token ${token}` } : {};

    
    const now = new Date();
    const istMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0, 0, 0
    );

    const utcMidnight = new Date(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
    const isoSince = utcMidnight.toISOString();

    const reposRes = await fetch(`https://api.github.com/orgs/${org}/repos`, { headers });
    const repos = await reposRes.json();

    let totalCommits = 0;

    for (const repo of repos) {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${org}/${repo.name}/commits?since=${isoSince}`,
        { headers }
      );
      const commits = await commitsRes.json();

      if (Array.isArray(commits)) {
        totalCommits += commits.length;
      }
    }

    counter.innerText = totalCommits;
  } catch (err) {
    console.error(err);
    counter.innerText = "Error fetching data";
  }
}

getTodayCommitCount();
