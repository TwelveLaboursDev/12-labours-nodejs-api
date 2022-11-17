-- Database: 12labours setup data

--User types data setup
insert into user_types values(1,'Researcher');
insert into user_types values(2,'Clinician');
insert into user_types values(3,'Patient');

--Dhbs data setup
insert into dhbs(dhb_name,island) values ('Auckland','North');
insert into dhbs(dhb_name,island) values ('Bay of Plenty','North');
insert into dhbs(dhb_name,island) values ('Capital & Coast','North');
insert into dhbs(dhb_name,island) values ('Counties Manukau','North');
insert into dhbs(dhb_name,island) values ('Hawkes Bay','North');
insert into dhbs(dhb_name,island) values ('Hutt Valley','North');
insert into dhbs(dhb_name,island) values ('Lakes','North');
insert into dhbs(dhb_name,island) values ('Mid Central','North');
insert into dhbs(dhb_name,island) values ('Counties Manukau','North');
insert into dhbs(dhb_name,island) values ('Northland','North');
insert into dhbs(dhb_name,island) values ('Tairāwhiti','North');
insert into dhbs(dhb_name,island) values ('Taranaki','North');
insert into dhbs(dhb_name,island) values ('Waikato','North');
insert into dhbs(dhb_name,island) values ('Wairarapa','North');
insert into dhbs(dhb_name,island) values ('Waitematā','North');
insert into dhbs(dhb_name,island) values ('Whanganui','North');
insert into dhbs(dhb_name,island) values ('Canterbury','South');
insert into dhbs(dhb_name,island) values ('Nelson-Marlborough','South');
insert into dhbs(dhb_name,island) values ('South Canterbury','South');
insert into dhbs(dhb_name,island) values ('Southern','South');
insert into dhbs(dhb_name,island) values ('West Coast','South');

--Hospitals data setup
insert into hospitals (hospital_name) values ('Murchison Hospital and Health Centre');
insert into hospitals (hospital_name) values ('Nelson Bays Maternity Unit (Te Whare Whanau)');
insert into hospitals (hospital_name) values ('Nelson Hospital');
insert into hospitals (hospital_name) values ('Tipahi Street Mental Health');
insert into hospitals (hospital_name) values ('Wairau Hospital');
insert into hospitals (hospital_name) values ('Bay of Islands Hospital');
insert into hospitals (hospital_name) values ('Dargaville Hospital');
insert into hospitals (hospital_name) values ('Kaitaia Hospital');
insert into hospitals (hospital_name) values ('Timatanga Hou - Detox Unit');
insert into hospitals (hospital_name) values ('Timaru Hospital');
insert into hospitals (hospital_name) values ('Dunedin Hospital');
insert into hospitals (hospital_name) values ('Lakes District Hospital');
insert into hospitals (hospital_name) values ('Southland Hospital');
insert into hospitals (hospital_name) values ('Wakari Hospital');
insert into hospitals (hospital_name) values ('Gisborne Hospital');
insert into hospitals (hospital_name) values ('Hawera Hospital');
insert into hospitals (hospital_name) values ('Taranaki Base Hospital');
insert into hospitals (hospital_name) values ('Henry Rongomau Bennett Centre');
insert into hospitals (hospital_name) values ('Matariki Hospital');
insert into hospitals (hospital_name) values ('Puna Whiti');
insert into hospitals (hospital_name) values ('Rhoda Read Hospital');
insert into hospitals (hospital_name) values ('Taumarunui Hospital and Family Health Team');
insert into hospitals (hospital_name) values ('Te Kuiti Hospital');
insert into hospitals (hospital_name) values ('Thames Hospital');
insert into hospitals (hospital_name) values ('Tokoroa Hospital');
insert into hospitals (hospital_name) values ('Waikato Hospital');
insert into hospitals (hospital_name) values ('Ward OPR1');
insert into hospitals (hospital_name) values ('Wairarapa Hospital');
insert into hospitals (hospital_name) values ('Elective Surgery Centre');
insert into hospitals (hospital_name) values ('He Puna Waiora');
insert into hospitals (hospital_name) values ('Inpatient Detoxification Unit');
insert into hospitals (hospital_name) values ('Mason Clinic');
insert into hospitals (hospital_name) values ('North Shore Hospital');
insert into hospitals (hospital_name) values ('Pitman House');
insert into hospitals (hospital_name) values ('Waiatarau Inpatient Mental Health Unit');
insert into hospitals (hospital_name) values ('Waitakere Hospital');
insert into hospitals (hospital_name) values ('Wilson Centre');
insert into hospitals (hospital_name) values ('Buller Health');
insert into hospitals (hospital_name) values ('Grey Base Hospital');
insert into hospitals (hospital_name) values ('Whanganui Hospital');

--Institutions data setup
insert into institutions (institution_name) values('University of Auckland');
insert into institutions (institution_name) values('Auckland University of Technology');