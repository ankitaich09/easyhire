document.addEventListener('DOMContentLoaded', function() {
    let profiles = [];
    let currentIndex = 0;
    let selectedCandidates = [];

    // Load profiles from the CSV file
    fetch('data/candidates.csv')
        .then(response => response.text())
        .then(data => {
            profiles = parseCSV(data);
            if (profiles.length > 0) {
                displayProfile(currentIndex);
            } else {
                console.error('No profiles found in the CSV.');
            }
        })
        .catch(error => console.error('Error fetching candidates:', error));

    // Load jobs from the CSV file
    fetch('data/jobs.csv')
        .then(response => response.text())
        .then(data => {
            populateJobsDropdown(parseCSV(data));
        })
        .catch(error => console.error('Error fetching jobs:', error));

    document.getElementById('home-btn').addEventListener('click', function() {
        displayProfile(currentIndex);
    });

    function displayProfile(index) {
        if (index < profiles.length) {
            const profile = profiles[index];
            document.getElementById('profile-card').innerHTML = `
                <h2 class="name">${profile.name || ''}</h2>
                <div class="profile-details">
                    <h3>Years of Experience</h3>
                    <ul>
                        <li>${profile.experience || ''}</li>
                    </ul>
                    <h3>Previous Company</h3>
                    <ul>
                        <li>${profile.company || ''}</li>
                    </ul>
                    <h3>Job Title</h3>
                    <ul>
                        <li>${profile.job || ''}</li>
                    </ul>
                    <h3>Education</h3>
                    <ul>
                        <li>${profile.education || ''}</li>
                    </ul>
                    <h3>Skills</h3>
                    <ul>
                        <li>${profile.skills || ''}</li>
                    </ul>
                    <h3>Other Relevant Skills</h3>
                    <ul>
                        <li>${profile.other_skills || ''}</li>
                    </ul>
                    <h3>#Jobs Referred To</h3>
                    <ul>
                        <li>${profile.referrals || ''}</li>
                    </ul>
                </div>
                <div class="swipe-buttons">
                    <button id="reject" class="swipe-button reject">❌</button>
                    <button id="accept" class="swipe-button accept">✔️</button>
                </div>
            `;
            document.getElementById('accept').addEventListener('click', selectCandidate);
            document.getElementById('reject').addEventListener('click', swipeLeft);
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
            selectedCandidates.push(profile);
            updateSelectedCandidates();
            profiles.splice(currentIndex, 1); // Remove the selected candidate from profiles list
            if (currentIndex >= profiles.length) {
                currentIndex = 0;
            }
            if (profiles.length > 0) {
                displayProfile(currentIndex);
            } else {
                document.getElementById('profile-card').innerHTML = '<p>No more candidates to display.</p>';
            }
        }
    }

    function updateSelectedCandidates() {
        const selectedList = document.getElementById('selected-candidates');
        selectedList.innerHTML = ''; // Clear the current list
        selectedCandidates.forEach((candidate, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}. ${candidate.name}`;
            li.addEventListener('click', function() {
                displaySelectedProfile(candidate);
            });
            selectedList.appendChild(li);
        });
    }

    function displaySelectedProfile(candidate) {
        document.getElementById('profile-card').innerHTML = `
            <h2 class="name">${candidate.name || ''}</h2>
            <div class="profile-details">
                <h3>Years of Experience</h3>
                <ul>
                    <li>${candidate.experience || ''}</li>
                </ul>
                <h3>Previous Company</h3>
                <ul>
                    <li>${candidate.company || ''}</li>
                </ul>
                <h3>Job Title</h3>
                <ul>
                    <li>${candidate.job || ''}</li>
                </ul>
                <h3>Education</h3>
                <ul>
                    <li>${candidate.education || ''}</li>
                </ul>
                <h3>Skills</h3>
                <ul>
                    <li>${candidate.skills || ''}</li>
                </ul>
                <h3>Other Relevant Skills</h3>
                <ul>
                    <li>${candidate.other_skills || ''}</li>
                </ul>
                <h3>#Jobs Referred To</h3>
                <ul>
                    <li>${candidate.referrals || ''}</li>
                </ul>
            </div>
        `;
    }

    function populateJobsDropdown(jobs) {
        const dropdown = document.getElementById('jobs-dropdown');
        dropdown.innerHTML = ''; // Clear any existing jobs
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
                const values = [];
                let inQuotes = false;
                let value = '';

                for (let i = 0; i < line.length; i++) {
                    const char = line[i];

                    if (char === '"') {
                        inQuotes = !inQuotes; // Toggle the state of inQuotes
                    } else if (char === ',' && !inQuotes) {
                        values.push(value.trim());
                        value = '';
                    } else {
                        value += char;
                    }
                }
                values.push(value.trim());

                if (values.length === headers.length) {
                    let profile = {};
                    headers.forEach((header, i) => {
                        profile[header.trim()] = values[i] ? values[i].trim() : "N/A";
                    });
                    return profile;
                }
                return null;
            })
            .filter(profile => profile !== null);
    }
});
