/*!
 * fetchAndConvert.js
 *
 * Author: Andrew Cross
 * GitHub: https://github.com/crossat
 *
 * This file is freely available under the MIT License.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const axios = require('axios');
const fs = require('fs');

// Function to fetch data from the URL
async function fetchData(address) {
    const url = `https://explorer.neoxa.net/ext/getaddresstxs/${address}/0/50000`;
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
                tx.sent !== 0 ? tx.sent : -tx.received, // Adjust the amount: sent is positive, received is negative
                "NEOX",
                "", // Make the Label column blank
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