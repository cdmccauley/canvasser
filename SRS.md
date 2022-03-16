https://relevant.software/blog/software-requirements-specification-srs-document/
https://www.perforce.com/blog/alm/how-write-software-requirements-specification-srs-document

# 1. Introduction

## 1.1 Purpose

The purpose of the Canvasser project is to extend the functionality of the Canvas Learning Management System (Canvas) To Do feature.

## 1.2 Intended Audience

The intended audience of Canvasser are groups of Canvas users enrolled in Canvas courses with the role of Teacher.

## 1.3 Intended Use

Canvasser is intended to be used as collaboration tool for teachers working on their shared To Do list.

## 1.4 Scope

The primary goal of the Canvasser project is to provide teachers a method of reserving To Do list items while they are working on them so other teachers can avoid duplicating their work.

The secondary goals of the Canvasser project will be to allow teachers to:

- Automate To Do list item retrieval with customizable refresh rate
- See what To Do list items have been reserved by other users
- Receive a notification when a reservation collision has occurred
- Select which courses they would like to see To Do list items for
- Filter To Do list items based on course or item name
- Set priority flags to use in sorting of To Do list items based on course or item name
- Sort To Do list items based on priority, item name, course name, or time of submission

## 1.5 Definitions and Acronyms

Canvas LMS, The Canvas Learning Management System developed by Instructure.

Teacher, A Canvas LMS user with the role of teacher.

Student, A Canvas LMS user with the role of student.

Submission, An assignment that has been submitted by a student for review by a teacher.

Canvas Assistant, A desktop application similar to Canvasser that currently shares a MongoDB instance with Canvasser.

SpeedGrader, A webpage in the Canvas LMS that shows a student submission and provides an interface to grade the submission and leave comments for student review.

Canvasser Environment, Canvasser loaded in a web browser, desktop application, or represented as text; Canvasser on Vercel, Canvasser/Canvas Assistant on MongoDB.

# 2. Overall Description

## 2.1 User Needs

## 2.2 Assumptions and Dependencies

# 3. System Features and Requirements

## 3.1 Functional Requirements

## 3.2 External Interface Requirements

## 3.3 System Features

## 3.4 Nonfunctional Requirements

---

## Specifications (Saved for documentation purposes, will remove once SRS is complete)

### 1. Introduction

#### 1.1 Purpose

The purpose of this document is to present a detailed description of the Canvasser web application while giving any contributor experience working with an SRS. It will explain the purpose and features of the application, the interfaces of the application, what the application will do, the constraints under which it must operate and how the application will react to external stimuli. This document is intended for both the stakeholders and the developers of the application. This document is intended to be a "living" document that will change over the course of development of the application.

#### 1.2 Intended Audience

The intended audience of the Canvasser web application is Canvas LMS users with the role of teacher in at least one course.

#### 1.3 Intended Use

The Canvasser web application is intended to be used by Canvas LMS users with the role of teacher as a replacement for the Canvas LMS "To Do" element.

#### 1.4 Scope

The Canvasser web application will be a dashboard for Canvas LMS users with the role of teacher. The dashboard will show information about student submissions and provide functionality to improve submission review productivity. Specifically, the application will provide users with the functionality to request, access, sort, filter, prioritize, and reserve student submissions for review.

#### 1.5 Definitions and Acronyms

Canvas LMS, The Canvas Learning Management System developed by Instructure.

Teacher, A Canvas LMS user with the role of teacher.

Student, A Canvas LMS user with the role of student.

Submission, An assignment that has been submitted by a student for review by a teacher.

Canvas Assistant, A desktop application similar to Canvasser that shares a MongoDB instance with Canvasser.

SpeedGrader, A webpage in the Canvas LMS that shows a student submission and provides an interface to grade the submission and leave comments for student review.

Canvasser Environment, Canvasser loaded in a web browser, desktop application, or represented as text; Canvasser on Vercel, Canvasser/Canvas Assistant on MongoDB.

### 2. Overall Description

#### 2.1 User Needs

Teachers require the following items from Canvasser.
* A link to obtain an OAuth token from Canvas
* A link to the submission's SpeedGrader webpage
* A link to the student's grades webpage
* Copy a student's internal student ID to the clipboard
* "Reserve" a submission for review
* See what submissions have been reserved by other teachers
* Recieve a notification if someone has reserved a submission that they are attempting to reserve
* Sort a list of submissions based on priority, assignment name, course name, or time of submission
* Filter a list of submissions based on assignment name and/or course name
* Assign a priority value to a submission based on assignment name and/or course name
* See a quantity of how many submissions are currently displayed on the dashboard
* Toggle between light and dark modes

#### 2.2 Assumptions and Dependencies

Assume there are assumptions to be made but be clear that I do not know what they are at this time (I need to research this section of an SRS).

The web application is dependent upon a Canvas LMS instance that has been configured with a developer key assigned the proper values which includes its own dependencies. The web application is dependent upon a properly configured MongoDB database which includes its own dependencies. The web application is dependent upon the Next.js framework which includes its own dependencies.

### 3. System Features and Requirements

#### 3.1 Functional Requirements

Requirements for Canvasser to function
* A Canvas LMS instance with a properly configured developer key
* GitHub repository
* Vercel hosting
* MongoDB hosting
* All functionality must work on the latest version of Mozilla Firefox and Google Chrome

#### 3.2 External Interface Requirements

An API endpoint to create and remove records in MongoDB

#### 3.3 System Features

Get JSON data from Canvas LMS instance
Get, create, and remove records from MongoDB

#### 3.4 Nonfunctional Requirements

Stability, web application must not crash under normal operation
Security, web application and contributors must not expose user data or environment variables to any person, entity, or system outside of the Canvasser environment.