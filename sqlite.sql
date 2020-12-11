DROP TABLE USERS;
DROP TABLE PLAYERS;

CREATE TABLE USERS (
  user_id integer primary key autoincrement,
  user_email varchar(50),
  user_first varchar(50),
  user_second varchar(50),
  password varchar
);


CREATE TABLE PLAYERS {
  player_id integer primary key autoincrement,
  p_name varchar(50),
  p_position varchar(20),
  p_team varchar(20)
};

CREATE TABLE TEAM (
  team_id integer primary key autoincrement,
  player_n varchar(50),
  player_p varchar(20)
);

INSERT INTO PLAYERS (p_name, p_postion, p_team) VALUES ('Kane', 'Forward', 'Spurs');
INSERT INTO PLAYERS (p_name, p_postion, p_team) VALUES ('Ziyech', 'Midfield', 'Chelsea')
INSERT INTO PLAYERS (p_name, p_postion, p_team) VALUES ('Salah', 'Forward', 'Liverpool')
INSERT INTO PLAYERS (p_name, p_postion, p_team) VALUES ('Grealish', 'Midfield', 'Aston Villa')
