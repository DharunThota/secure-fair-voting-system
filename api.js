import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import pg from "pg";

const db = new pg.Client({
    user: process.env.DB_USER, 
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.json({
        "status": "Running",
    })
})

//Create a voting room
app.post("/api/v1/voting-room", async(req, res) =>{
    try {
        const { name } = req.body;
        const status = 0;
        const response = db.query("INSERT INTO VOTING_ROOM(name, status) VALUES($1, $2) RETURNING *", [name, status]);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
})

//Open a voting room
app.post("/api/v1/voting-room/:id/open", async(req, res) => {
    try {
        const response = db.query("UPDATE VOTING_ROOM SET status = 1 WHERE room_id = $1", [req.params.id]);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
    
})

//Close a voting room
app.post("/api/v1/voting-room/:id/close", async(req, res) => {
    try {
        const response = db.query("UPDATE VOTING_ROOM SET status = 0 WHERE room_id = $1", [req.params.id]);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
})

//Add new Candidates
app.post("/api/v1/candidates", async(req, res) => {
    const { fname, lname, room_id } = req.body;
    try {
        const add_candidate = db.query("INSERT INTO CANDIDATE(fname, lname) VALUES($1, $2) RETURNING *", [fname, lname]);
        const response = db.query("INSERT INTO STANDING_IN(candidate_id, room_id) VALUES($1, $2) RETURNING *", [add_candidate.rows[0].candidate_id, room_id]);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
})

//Add new Voters
app.post("/api/v1/voters", async(req, res) => {
    const { fname, lname } = req.body;
    try {
        const response = db.query("INSERT INTO VOTER(fname, lname) VALUES($1, $2) RETURNING *", [fname, lname]);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
    
})

//Vote for a Candidate
app.post("/api/v1/voting-room/:id/vote", async(req, res) => {
    const { votes, voter_id } = req.body;
    try {
        const alreadyVoted = db.query("SELECT * FROM VOTED_IN WHERE voter_id = $1 AND room_id = $2", [voter_id, req.params.id]);
        if (alreadyVoted.length > 0){
            return res.json({
                "status": "Already Voted",
            })
        }

        const n = 0;
        Object.values(votes).forEach(value => {
            if (value > 0){
                n += 1;
            }
        });
        Object.keys(votes).forEach(candidate => {
            const value = votes[candidate];
            if (value > 0){
                const vote = db.query("INSERT INTO VOTE(room_id, candidate_id, n_votes, n_voted) VALUES($1, $2, $3, $4) RETURNING *", 
                    [req.params.id, candidate, value, n]);
                console.log(vote.rows);
            }
        });

        const response = db.query("INSERT INTO VOTED_IN(voter_id, room_id) VALUES($1, $2) RETURNING *", [voter_id, req.params.id]);
        console.log(response.rows);
        res.json({
            "status": "Voted",
        });
    } catch (error) {
        console.log(error);
    }
    
})

//Get the results
app.get("/api/v1/voting-room/:id/results", async(req, res) => {
    const decay = 0.1;
    try {
        const candidates = db.query("SELECT candidate_id FROM STANDING_IN WHERE room_id = $1", [req.params.id]);
        const results = {};
        const ones = {};

        candidates.forEach(candidate =>{
            const response = db.query("SELECT n_votes, n_voted FROM VOTE WHERE room_id = $1 AND candidate_id = $2", [req.params.id, candidate]);
            const rows = response.rows;
            var vote_count = 0;
            var one_count = 0;

            rows.forEach(row => {
                if(row.n_votes === 0){
                    one_count += 1;
                }
                var weight = 1 - (candidates.length - row.n_voted + 1) * d;
                vote_count += row.n_votes * weight;
            });
            results[candidate] = vote_count;
            ones[candidate] = one_count;
        })

        var winner = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
        const ties = Object.keys(results).filter(candidate => results[candidate] === results[winner]);
        if( ties.length > 1){
            //the candidate with less ones wins
            winner = ties.reduce((a, b) => ones[a] < ones[b] ? a : b);
        }

        res.json({
            "results": results,
            "winner": winner,
        });
    } catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})


