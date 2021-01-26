CREATE DATABASE IF NOT EXISTS server;
use server;
create table if not exists comments(
	id bigint not null auto_increment,
	blog_id bigint not null,
	content varchar(4096) not null,
	time datetime not null,
	username varchar(64) not null,
	avatar_url varchar(1024) not null,
	likes bigint not null,
	primary key(id)
) ENGINE=InnoDB default CHARSET=utf8mb4;
create table if not exists users(
	uid bigint not null auto_increment,
	username varchar(32) not null,
	account varchar(32) not null,
	password varchar(32) not null,
	primary key (uid)
) ENGINE=InnoDB default CHARSET=utf8mb4;

create table if not exists notes(
	id bigint not null auto_increment,
	content varchar(4096) not null,
	note_time datetime not null,
	note_addr varchar(256) not null,
	primary key(id)
) ENGINE=InnoDB default CHARSET=utf8mb4;