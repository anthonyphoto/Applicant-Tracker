## Applicant-Tracker

### Demo Link https://applicant-track.herokuapp.com/

### Summary

This app is a MVP version of HR tool, which allows HR or recruiting company to track their applicants status. All persistent data are stored in MongoDB, and users can view or edit data based upon their permission (Role-based access: Admin, Recruiter, and Normal user)

### User Stories (Functional)
* As a job candidate, I want to create an account, so I can apply for any positions.
* As any logged-in user, I want to submit my resume via a web form.  The minimum fields include: 
 - Title
 - Summary
 - Contact Info (Email, Phone, LinkedIn)
 - Technical Skillsets (configurable)
 - Location
 - Professional Experiences ( variable number of companies)
 - Last school attended and major
* As an admin user, I want to view and modify all posted resumes. 
* As an admin user, I want to update the status of the applications (i.e., submitted, interview scheduled, in review, rejected, offer)
* As a non-admin user, I am allowed to update or delete my posts only. 

### Technology Used
* HTML/CSS/JavaScript/jQuery
* Node.js/Express
* MongoDB/Gongoose
* Mocha/Chai/Travis CI

### Sample Screenshot (Logged-in Page)
![Sample1](./img/shot1.png)

### Sample Screenshot (View Resume)
![Sample2](./img/shot2.png)

### Sample Screenshot (Tracking Management - Admin only)
![Sample2](./img/shot3.png)

### Sample Screenshot (Mobile View - iPhone XR)
![Sample2](./img/shot3.png)
