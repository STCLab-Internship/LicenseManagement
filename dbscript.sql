/* DB 생성 */
CREATE DATABASE license;

USE license;

CREATE TABLE pwd
(
    password VARCHAR(300)
);

CREATE TABLE users
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    emailuid VARCHAR(128),
    username VARCHAR(128),
    privilege VARCHAR(64),
    deleteYN INT DEFAULT '1'
);

CREATE TABLE license
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    uid INT, 
    gendate TIMESTAMP,
    regtime TIMESTAMP,
    producttype VARCHAR(128),
    orgcode VARCHAR(128),
    expdate VARCHAR(128),
    segment VARCHAR(128),
    maxccu VARCHAR(128),
    execount VARCHAR(128),
    domain VARCHAR(255) UNIQUE,
    companyname VARCHAR(128),
    licensekey VARCHAR(600),
    deleteYN INT DEFAULT '1',
    FOREIGN KEY(uid)
    REFERENCES users(id) 
);

CREATE TABLE licensehistory
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    lid INT,
    uid INT, 
    action VARCHAR(128),
    gendate TIMESTAMP,
    regtime TIMESTAMP,
    producttype VARCHAR(128),
    orgcode VARCHAR(128),
    expdate VARCHAR(128),
    segment VARCHAR(128),
    maxccu VARCHAR(128),
    execount VARCHAR(128),
    domain VARCHAR(255),
    companyname VARCHAR(128),
    licensekey VARCHAR(600),
    FOREIGN KEY(uid)
    REFERENCES users(id),
    FOREIGN KEY(lid)
    REFERENCES license(id)
);

INSERT INTO users(emailuid,username,privilege)
VALUES('jiny','Jiny','Admin');

INSERT INTO 