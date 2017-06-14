#创建数据库
create database sunshine;
#选择数据库
use sunshine;
#创建user表
create table user(
	u_id int NOT NULL auto_increment PRIMARY KEY,
	u_account char(40) NOT NULL ,
	u_user_name varchar(20),
	u_password varchar(20) NOT NULL 
) DEFAULT CHARSET=utf8;
#插入第一条数据
insert into user(u_id,u_account,u_user_name,u_password) values(null,'tanjunyi@danlu.com','谭军一','tanjunyi');
insert into user(u_id,u_account,u_user_name,u_password) values(null,'zhangcaixia','张彩霞','zhangcaixia');
insert into user(u_id,u_account,u_user_name,u_password) values(null,'gaorong@danlu.com','高荣','gaorong');
insert into user(u_id,u_account,u_user_name,u_password) values(null,'zhangchangyun@danlu.com','张常云','zhangchangyun');
#创建技术栈数据表
#类型 1,每日提升
##创建时间
##创建人ID
##标题
##标题
##内容
create table stack(
	s_id int NOT NULL auto_increment PRIMARY KEY,
	s_type int NOT NULL ,  
	s_create_time char(20) NOT NULL , 
	s_create_person int NOT NULL , 
	s_title varchar(20) NOT NULL, 
	s_content varchar(200) NOT NULL,
	foreign key(s_create_person) references user(u_id)
) DEFAULT CHARSET=utf8;
#设置中文支持
set char set 'utf8';
insert into stack(s_id,s_type,s_create_time,s_create_person,s_title,s_content) values(null,1,'1497170106000',1,'发版本注意','发版本的时候记得将热更新这些关掉');

	
