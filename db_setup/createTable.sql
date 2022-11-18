CREATE TABLE hospitals(
	hospital_id smallint GENERATED ALWAYS AS IDENTITY,
	hospital_name  varchar(255) NOT NULL,
	PRIMARY KEY(hospital_id)
);

CREATE TABLE dhbs(
	dhb_id smallint GENERATED ALWAYS AS IDENTITY,
	dhb_name  varchar(255) NOT NULL,
	island char(5),
	PRIMARY KEY(dhb_id)
);

CREATE TABLE institutions(
	institution_id smallint GENERATED ALWAYS AS IDENTITY,
	institution_name varchar(255) NOT NULL,
	PRIMARY KEY(institution_id)
);

CREATE TABLE user_types (type_id smallint PRIMARY KEY, type_name varchar(20) NOT NULL UNIQUE);

CREATE TABLE users (
	user_id int GENERATED ALWAYS AS IDENTITY,
	type_id smallint NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	title varchar(5),
	first_name varchar(150) NOT NULL,
	last_name varchar(150),
	profession varchar(255),
	institution_id smallint,
	nhi char(9),
	hospital_id smallint,
	hpi varchar(12),
	dhb_id smallint,
	created timestamptz,
	updated timestamptz DEFAULT now(),
	PRIMARY KEY(user_id),
	CONSTRAINT fk_user_type
      FOREIGN KEY(type_id) 
	  REFERENCES user_types(type_id),
	CONSTRAINT fk_dhb
      FOREIGN KEY(dhb_id) 
	  REFERENCES dhbs(dhb_id),
	CONSTRAINT fk_institution
      FOREIGN KEY(institution_id) 
	  REFERENCES institutions(institution_id),
	CONSTRAINT fk_hospital
      FOREIGN KEY(hospital_id) 
	  REFERENCES hospitals(hospital_id)
);
   
CREATE TABLE local_users (
	user_id int NOT NULL UNIQUE,
	password varchar(20) NOT NULL,
	is_active boolean NOT NULL,
	created timestamptz,
	updated timestamptz DEFAULT now(),
	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
	  ON DELETE CASCADE
);

CREATE TABLE google_users (
	user_id int NOT NULL UNIQUE,
	google_id varchar(255) NOT NULL UNIQUE,
	created timestamptz,
	CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(user_id)
	  ON DELETE CASCADE
);