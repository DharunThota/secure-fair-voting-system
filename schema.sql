CREATE TABLE USERS(
	username VARCHAR(30) PRIMARY KEY,
	password TEXT NOT NULL
);

CREATE TABLE STANDING_IN(
    candidate_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
	PRIMARY KEY (candidate_id, room_id)
);

CREATE TABLE VOTING_ROOM(
    room_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE CANDIDATE(
    id SERIAL PRIMARY KEY,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL
);

CREATE TABLE VOTED_IN(
    voter_id BIGINT NOT NULL,
    room_id INTEGER NOT NULL,
	PRIMARY KEY (voter_id, room_id)
);

CREATE TABLE VOTER(
    id SERIAL PRIMARY KEY,
    fname VARCHAR(30) NOT NULL,
    lname VARCHAR(30) NOT NULL
);

CREATE TABLE VOTE(
    vote_id BIGSERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    candidate_id INTEGER NOT NULL,
    n_votes INTEGER NOT NULL,
    n_voted INTEGER NOT NULL
);

/*Foreign keys*/
ALTER TABLE
    VOTE ADD CONSTRAINT "vote_room_id_foreign" FOREIGN KEY(room_id) REFERENCES VOTING_ROOM(room_id);
ALTER TABLE
    VOTED_IN ADD CONSTRAINT "voted_in_room_id_foreign" FOREIGN KEY(room_id) REFERENCES VOTING_ROOM(room_id);
ALTER TABLE
    STANDING_IN ADD CONSTRAINT "standing_in_candidate_id_foreign" FOREIGN KEY(candidate_id) REFERENCES CANDIDATE(id);
ALTER TABLE
    VOTE ADD CONSTRAINT "vote_candidate_id_foreign" FOREIGN KEY(candidate_id) REFERENCES CANDIDATE(id);
ALTER TABLE
    VOTED_IN ADD CONSTRAINT "voted_in_voter_id_foreign" FOREIGN KEY(voter_id) REFERENCES VOTER(id);
ALTER TABLE
    STANDING_IN ADD CONSTRAINT "standing_in_room_id_foreign" FOREIGN KEY(room_id) REFERENCES VOTING_ROOM(room_id);