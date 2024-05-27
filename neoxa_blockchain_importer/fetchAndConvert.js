const axios = require('axios');
const fs = require('fs');

// Function to fetch data from the URL
async function fetchData(address) {
    const url = `https://explorer.neoxa.net/ext/getaddresstxs/${address}/0/50`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Function to process data and save to CSV
async function processDataAndSaveAsCSV(address) {
    try {
        // Fetch data
        const data = await fetchData(address);

        // Process data and create CSV content
        const csvContent = [
            ['Koinly Date', 'Amount', 'Currency', 'Label', 'TxHash'],
            ...data.map(tx => [
                new Date(tx.timestamp * 1000).toISOString().replace('T', ' ').replace('Z', ' UTC'),
                tx.sent,
                "NEOX",
                "mining",
                tx.txid
            ]).map(row => row.join(','))
        ].join('\n');

        // Write CSV content to a file with the address in the filename
        const csvFilePath = `output_${address}.csv`;
        fs.writeFileSync(csvFilePath, csvContent);
        console.log(`Data has been successfully fetched and converted to ${csvFilePath}`);
    } catch (error) {
        console.error('Error processing data:', error);
    }
}

// Get the address from command-line arguments
const address = process.argv[2];

if (!address) {
    console.error('Please provide the address as a command-line argument.');
} else {
    // Process data and save to CSV
    processDataAndSaveAsCSV(address);
}
