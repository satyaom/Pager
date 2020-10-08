<h3><b>Add sql cmd</b></h3><br>
create database pager;<br>
use pager;<br>
create table login(User varchar(100), Pass varchar(100));<br>
create table employee(token_id varchar(100) not null primary key, name varchar(100), phone_no varchar(100), date varchar(100), user varchar(100));<br>
create table tkey(token_id varchar(100) not null primary key, public_key varchar(2000), private_key varchar(2000));<br>
create table document(token_id varchar(100), dig_sig varchar(2000), public_key varchar(2000));<br>
create table token(id int not null primary key, token_id varchar(100));<br>
