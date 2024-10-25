const fs = require('fs');

// Function to load and parse JSON input
function loadTestCase(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file", err);
    }
}

// Function to decode Y values based on the base
function decodeYValue(base, value) {
    return parseInt(value, base);
}

// Lagrange Interpolation to find the constant term
function lagrangeInterpolation(points, k) {
    let constantTerm = 0;
    
    for (let i = 0; i < k; i++) {
        let x_i = points[i].x;
        let y_i = points[i].y;

        let term = y_i;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let x_j = points[j].x;
                term *= (0 - x_j) / (x_i - x_j);  // Simplifying for constant term (x = 0)
            }
        }
        constantTerm += term;
    }

    return Math.round(constantTerm);  // rounding to handle floating point precision
}

function main() {
    const testCase1 = loadTestCase('data/testcase1.json');
    const testCase2 = loadTestCase('data/testcase2.json');

    const decodedPoints1 = [];
    const decodedPoints2 = [];

    // Process test case 1
    const keys1 = testCase1.keys;
    for (let i = 1; i <= keys1.n; i++) {
        const entry = testCase1[i.toString()]; // Access using string keys
        if (!entry) continue; // Skip if entry is undefined
        const x = i;
        const base = entry.base;
        const yEncoded = entry.value;
        const yDecoded = decodeYValue(base, yEncoded);
        decodedPoints1.push({ x, y: yDecoded });
    }

    // Process test case 2
    const keys2 = testCase2.keys;
    for (let i = 1; i <= keys2.n; i++) {
        const entry = testCase2[i.toString()]; // Access using string keys
        if (!entry) continue; // Skip if entry is undefined
        const x = i;
        const base = entry.base;
        const yEncoded = entry.value;
        const yDecoded = decodeYValue(base, yEncoded);
        decodedPoints2.push({ x, y: yDecoded });
    }

    // Find the constant term using k points
    const constant1 = lagrangeInterpolation(decodedPoints1, keys1.k);
    const constant2 = lagrangeInterpolation(decodedPoints2, keys2.k);

    // Output the result
    console.log(`Secret for Test Case 1: ${constant1}`);
    console.log(`Secret for Test Case 2: ${constant2}`);
}

main();
