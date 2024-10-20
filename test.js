import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/v1'; // Update with your API URL
let authToken = ''; // Store the token

// Function to authenticate and retrieve token
const authenticate = async (username, password) => {
    try {
        const response = await axios.post(`${apiUrl}/login`, { username, password });
        authToken = response.data.token;
        console.log('Authenticated successfully. Token:', authToken);
    } catch (error) {
        console.error('Error authenticating:', error.response ? error.response.data : error.message);
    }
};

// Function to create a voting room
const createVotingRoom = async (name, description) => {
    try {
        const response = await axios.post(
            `${apiUrl}/voting-room`, 
            { name, description },
            { headers: { Authorization: `Bearer ${authToken}` } } // Pass token in headers
        );
        return response.data;
    } catch (error) {
        console.error('Error creating voting room:', error.response ? error.response.data : error.message);
    }
};

// Function to add a candidate
const addCandidate = async (fname, lname, room_id) => {
    try {
        const response = await axios.post(
            `${apiUrl}/candidates`, 
            { fname, lname, room_id },
            { headers: { Authorization: `Bearer ${authToken}` } } // Pass token in headers
        );
        return response.data;
    } catch (error) {
        console.error('Error adding candidate:', error.response ? error.response.data : error.message);
    }
};

// Function to add a voter
const addVoter = async (fname, lname) => {
    try {
        const response = await axios.post(
            `${apiUrl}/voters`, 
            { fname, lname },
            { headers: { Authorization: `Bearer ${authToken}` } } // Pass token in headers
        );
        return response.data;
    } catch (error) {
        console.error('Error adding voter:', error.response ? error.response.data : error.message);
    }
};

// Function to cast a vote (no authentication needed)
const castVote = async (roomId, voterId, fname, lname, votes) => {
    try {
        const response = await axios.post(`${apiUrl}/voting-room/${roomId}/vote`, { voter_id: voterId, fname, lname, votes });
        return response.data;
    } catch (error) {
        console.error('Error casting vote:', error.response ? error.response.data : error.message);
    }
};

// Function to get voting results (no authentication needed)
const getVotingResults = async (roomId) => {
    try {
        const response = await axios.get(`${apiUrl}/voting-room/${roomId}/results`);
        return response.data;
    } catch (error) {
        console.error('Error getting voting results:', error.response ? error.response.data : error.message);
    }
};

// Main execution flow
const main = async () => {
    try {
        // Step 1: Authenticate (replace with actual admin credentials)
        await authenticate('adminUsername', 'adminPassword');

        // Step 2: Create a voting room
        const votingRoom = await createVotingRoom('Room A', 'Main voting area for the election');
        console.log('Created Voting Room:', votingRoom);

        const roomId = votingRoom.room_id;

        // Step 3: Add candidates
        const candidateA = await addCandidate('Alice', 'Smith', roomId); // Strongly favored
        const candidateB = await addCandidate('Bob', 'Johnson', roomId); // Opposed by bad actor
        const candidateC = await addCandidate('Charlie', 'Brown', roomId); // Other candidate
        console.log('Candidates Added:', candidateA, candidateB, candidateC);

        // Step 4: Add voters
        const voters = [];
        for (let i = 1; i <= 10; i++) {
            const voter = await addVoter(`Voter ${i}`, `LastName ${i}`);
            voters.push(voter.voter_id); // Store voter IDs
        }
        console.log('Voters Added');

        // Step 5: Cast votes based on the example
        const votesData = [
            { voterId: voters[0], votes: { [candidateB.candidate_id]: 10 }, fname: 'Voter 1', lname: 'LastName 1' },
            { voterId: voters[1], votes: { [candidateB.candidate_id]: 10 }, fname: 'Voter 2', lname: 'LastName 2' },
            { voterId: voters[2], votes: { [candidateB.candidate_id]: 10 }, fname: 'Voter 3', lname: 'LastName 3' },
            { voterId: voters[3], votes: { [candidateB.candidate_id]: 10 }, fname: 'Voter 4', lname: 'LastName 4' },
            { voterId: voters[4], votes: { [candidateA.candidate_id]: 7, [candidateC.candidate_id]: 3 }, fname: 'Voter 5', lname: 'LastName 5' },
            { voterId: voters[5], votes: { [candidateA.candidate_id]: 5, [candidateB.candidate_id]: 2, [candidateC.candidate_id]: 3 }, fname: 'Voter 6', lname: 'LastName 6' },
            { voterId: voters[6], votes: { [candidateA.candidate_id]: 9, [candidateB.candidate_id]: 1 }, fname: 'Voter 7', lname: 'LastName 7' },
            { voterId: voters[7], votes: { [candidateA.candidate_id]: 6, [candidateC.candidate_id]: 4 }, fname: 'Voter 8', lname: 'LastName 8' },
            { voterId: voters[8], votes: { [candidateA.candidate_id]: 5, [candidateC.candidate_id]: 5 }, fname: 'Voter 9', lname: 'LastName 9' },
            { voterId: voters[9], votes: { [candidateA.candidate_id]: 6, [candidateC.candidate_id]: 4 }, fname: 'Voter 10', lname: 'LastName 10' },
        ];

        // Step 6: Cast votes for each voter
        for (const { voterId, votes, fname, lname } of votesData) {
            const result = await castVote(roomId, voterId, fname, lname, votes);
            console.log('Vote Cast Result:', result);
        }

        // Step 7: Get voting results
        const results = await getVotingResults(roomId);
        console.log('Voting Results:', results);

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

main();
