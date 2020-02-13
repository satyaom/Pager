*add sql
*cmd:
*create database pager;
*use pager;
*create table login(User varchar(100), Pass varchar(100));
*create table employee(token_id varchar(100) not null primary key, name varchar(100), phone_no varchar(100), date varchar(100), user varchar(100));
create table tkey(token_id varchar(100) not null primary key, public_key varchar(2000), private_key(2000));
create table document(token_id varchar(100), dig_sig varchar(2000), public_key varchar(2000));
create table token(id int not null primary key, token_id varchar(100));
