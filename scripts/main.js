document.addEventListener('DOMContentLoaded', function() {
    let profiles = [];
    let currentIndex = 0;

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

    document.getElementById('accept').addEventListener('click', function() {
        swipeRight();
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

    function swipeRight() {
        currentIndex++;
        if (currentIndex >= profiles.length) {
            currentIndex = 0;
        }
        displayProfile(currentIndex);
    }

    function swipeLeft() {
        currentIndex++;
        if (currentIndex >= profiles.length) {
            currentIndex = 0;
        }
        displayProfile(currentIndex);
    }

    function parseCSV(data) {
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        return lines.slice(1)
            .map(line => {
                if (!line.trim()) return null; // Ignore empty lines
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
            .filter(profile => profile !== null); // Filter out any null profiles
    }
});
