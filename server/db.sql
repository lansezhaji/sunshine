#创建数据库
create database sunshine;
#选择数据库
use sunshine;
#创建user表
create table user(
	id int NOT NULL auto_increment PRIMARY KEY,
	account char(20) NOT NULL ,
	userName varchar(20),
	password varchar(20) NOT NULL 

);
#插入第一条数据
insert into user(id,account,userName,password) values(null,'tanjunyi@danlu.com','tanjunyi','tanjunyi');
	
