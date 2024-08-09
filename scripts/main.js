document.addEventListener('DOMContentLoaded', function() {
    let profiles = [];
    let currentIndex = 0;
    let selectedCandidates = [];

    // Load profiles from the CSV file
    fetch('data/candidates.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            profiles = parseCSV(data);
            if (profiles.length > 0) {
                displayProfile(currentIndex);
            } else {
                console.error('No profiles found in the CSV.');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    // Load jobs from the CSV file
    fetch('data/jobs.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            populateJobsDropdown(parseCSV(data));
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    document.getElementById('accept').addEventListener('click', function() {
        selectCandidate();
    });

    document.getElementById('reject').addEventListener('click', function() {
        swipeLeft();
    });

    function displayProfile(index) {
        if (index < profiles.length) {
            const profile = profiles[index];
            document.getElementById('name').textContent = profile.name || '';
            document.getElementById('experience').textContent = profile.experience || '';
            document.getElementById('company').textContent = profile.company || '';
            document.getElementById('job').textContent = profile.job || '';
            document.getElementById('education').textContent = profile.education || '';
            document.getElementById('skills').textContent = profile.skills || '';
            document.getElementById('other-skills').textContent = profile.other_skills || '';
            document.getElementById('referrals').textContent = profile.referrals || '';
        }
    }

    function swipeLeft() {
        currentIndex++;
        if (currentIndex >= profiles.length) {
            currentIndex = 0;
        }
        displayProfile(currentIndex);
    }

    function selectCandidate() {
        if (currentIndex < profiles.length) {
            const profile = profiles[currentIndex];
            selectedCandidates.push(profile.name);
            updateSelectedCandidates();
            swipeLeft();
        }
    }

    function updateSelectedCandidates() {
        const selectedList = document.getElementById('selected-candidates');
        selectedList.innerHTML = ''; // Clear the current list
        selectedCandidates.forEach(candidate => {
            const li = document.createElement('li');
            li.textContent = candidate;
            selectedList.appendChild(li);
        });
    }

    function populateJobsDropdown(jobs) {
        const dropdown = document.getElementById('jobs-dropdown');
        jobs.forEach(job => {
            const a = document.createElement('a');
            a.textContent = job.name;
            a.href = '#';
            a.addEventListener('click', function() {
                displayJobDetails(job);
            });
            dropdown.appendChild(a);
        });
    }

    function displayJobDetails(job) {
        const profileCard = document.getElementById('profile-card');
        profileCard.innerHTML = `
            <h2 class="name">${job.name}</h2>
            <div class="profile-details">
                <h3>Required Years of Experience</h3>
                <ul>
                    <li>${job.required_experience}</li>
                </ul>
                <h3>Required Essential Skills</h3>
                <ul>
                    <li>${job.required_skills}</li>
                </ul>
                <h3>Payscale</h3>
                <input type="range" min="10000" max="500000" value="${job.payscale}" class="slider" id="payscaleRange">
                <p>Value: $<span id="payscaleValue">${job.payscale}</span></p>
                <h3>Time to Complete Hire</h3>
                <ul>
                    <li>${job.deadline}</li>
                </ul>
            </div>
        `;

        const slider = document.getElementById('payscaleRange');
        const output = document.getElementById('payscaleValue');
        slider.oninput = function() {
            output.textContent = this.value;
        };
    }

    function parseCSV(data) {
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1)
            .map(line => {
                if (!line.trim()) return null;
                const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
                if (values && values.length === headers.length) {
                    let profile = {};
                    headers.forEach((header, i) => {
                        profile[header.trim()] = values[i] ? values[i].replace(/(^"|"$)/g, '').trim() : "N/A";
                    });
                    return profile;
                }
                return null;
            })
            .filter(profile => profile !== null);
    }
});
