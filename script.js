// Your provided CSV Link
const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR6UMYGkAAKAP-V6Eaas4rY77h4WWKpfpKUfNIghgybeyjRl18S1AVxNZ6m4fqN5Y6cTixpTdjd72FP/pub?gid=580281819&single=true&output=csv';

let businessData = [];

async function fetchData() {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        
        // Split by lines and remove the header row
        const rows = data.split('\n').slice(1); 
        
        businessData = rows.map(row => {
            // Using a Regex to split by comma but ignore commas inside quotes (if any)
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            return {
                // Column 0 is Timestamp (Skipped)
                name: cols[1]?.trim(),      // Business Name
                product: cols[2]?.trim(),   // What you are selling
                phone: cols[3]?.trim(),     // Phone Number
                state: cols[4]?.trim(),     // State
                lga: cols[5]?.trim(),       // LGA
                ward: cols[6]?.trim(),      // Ward
                location: cols[7]?.trim()   // Business Location
            };
        }).filter(biz => biz.name); // Filter out empty rows

        displayBusinesses(businessData);
    } catch (error) {
        console.error("Error loading CSV:", error);
        document.getElementById('businessContainer').innerHTML = 
            "<p style='text-align:center;'>Unable to load business directory. Please try again later.</p>";
    }
}

function displayBusinesses(data) {
    const container = document.getElementById('businessContainer');
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <p>No businesses found matching that product.</p>
            </div>`;
        return;
    }

    data.forEach(biz => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <span class="tag">${biz.state} | ${biz.lga}</span>
                <h3>${biz.name}</h3>
                <p><strong>Offerings:</strong> ${biz.product}</p>
                <p><small>📍 ${biz.location} (${biz.ward} Ward)</small></p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                <a href="tel:${biz.phone}" class="call-btn">
                    📞 Call ${biz.phone}
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

function searchBusiness() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = businessData.filter(biz => 
        (biz.product && biz.product.toLowerCase().includes(term)) || 
        (biz.name && biz.name.toLowerCase().includes(term))
    );
    displayBusinesses(filtered);
}

// Initial Fetch
fetchData();