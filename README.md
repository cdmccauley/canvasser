# Canvasser

Production can be viewed at [https://canvasser.vercel.app/](https://canvasser.vercel.app/)

Branch 0.3 can be previewed at [https://canvasser-git-03-ncode.vercel.app/](https://canvasser-git-03-ncode.vercel.app/)

## Specifications

### 1. Introduction

#### 1.1 Purpose

The purpose of this document is to present a detailed description of the Canvasser web application while giving any contributer experience working with an SRS. It will explain the purpose and features of the application, the interfaces of the application, what the application will do, the constraints under which it must operate and how the application will react to external stimuli. This document is intended for both the stakeholders and the developers of the application. This document is intended to be a "living" document that will change over the course of development of the application.

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


## Dev Configuration

### Environment Variables

Copy the `env.local.example` file in this directory to `.env.local` (which will be ignored by Git)

Provide values for each variable in `.env.local`

#### Canvasser 0.3 Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - MongoDB database name
- `CLIENT_ID` - Canvas ID
- `CLIENT_SECRET` - Canvas API key
- `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` - String value of 'DEVELOPMENT'

#### Canvasser 0.2 Environment Variables

- `MONGO_CONNECTION` - MongoDB connection string
- `MONGO_DB` - MongoDB database name
- `MONGO_COLLECTION` - MongoDB collection name
- `I_KEY` - Interface key

### Run Next.js in development mode

```
npm install
npm run dev

# or

yarn install
yarn dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000).

## License

Licensed under GNU General Public License v3.0

See the file COPYING in the root directory for more details.

[https://choosealicense.com/licenses/gpl-3.0/#](https://choosealicense.com/licenses/gpl-3.0/#)

## Contributers

Chris McCauley