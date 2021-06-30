create database task;

create table roles(
    id serial primary key,
    rolename varchar not null
);

insert into roles(rolename)values('Admin'),('Manager'),('Staff');

create table registration(
    id serial primary key,
    name varchar not null,
	gender varchar not null,
	mobile varchar not null,
	emailid varchar not null,
	designation int references roles(id),
	password varchar not null	
);

