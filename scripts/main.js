document.addEventListener('DOMContentLoaded', function() {
    let profiles = [];
    let currentIndex = 0;

    // Load profiles from the CSV file
    fetch('/data/candidates.csv')
        .then(response => response.text())
        .then(data => {
            profiles = parseCSV(data);
            displayProfile(currentIndex);
        });

    document.getElementById('accept').addEventListener('click', function() {
        swipeRight();
    });

    document.getElementById('reject').addEventListener('click', function() {
        swipeLeft();
    });

    function displayProfile(index) {
        if (index < profiles.length) {
            const profile = profiles[index];
            document.getElementById('experience').textContent = `Years of Experience: ${profile.experience}`;
            document.getElementById('company').textContent = `Previous Company: ${profile.company}`;
            document.getElementById('job').textContent = `Job Title: ${profile.job}`;
            document.getElementById('education').textContent = `Education: ${profile.education}`;
            document.getElementById('skills').textContent = `Skills: ${profile.skills}`;
            document.getElementById('other-skills').textContent = `Other Relevant Skills: ${profile.other_skills}`;
            document.getElementById('referrals').textContent = `#Jobs Referred: ${profile.referrals}`;
        }
    }

    function swipeRight() {
        currentIndex++;
        displayProfile(currentIndex);
    }

    function swipeLeft() {
        currentIndex++;
        displayProfile(currentIndex);
    }

    function parseCSV(data) {
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1).map(line => {
            const values = line.split(',');
            let profile = {};
            headers.forEach((header, i) => {
                profile[header.trim()] = values[i].trim();
            });
            return profile;
        });
    }
});
