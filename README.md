# Software Requirements Specification
### Introduction
The purpose of this Software Requirements Specification is to outline the requirements for a user management tool. This tool is designed to enable users to create accounts and manage users, primarily by administrators.

### Features
##### Native User Authentication
The software should allow users to create an account using a native authentication method.
Users should be able to sign in using their created accounts with standard username and password.
##### Google User Authentication
The software should allow users to create an account and sign in using Google as an authentication method.
Users should have the option to sign in using their Google credentials.
##### Users Management
User management capabilities should be reserved for users with the Admin role.
Admins should have the ability to perform the following actions:
Create new user accounts.
Edit user account information.
Delete one or multiple user accounts.
##### Permissions Security
The software should prioritize security with regards to user permissions based on their roles (Admin and User).
Role-based access control should be implemented to ensure Admins have elevated permissions compared to regular Users.
### Technical Requirements
##### Web-Based Application
The software should be a web-based application accessible through a modern web browser.
##### Programming Language
The software should be built using JavaScript as the primary programming language.
##### Server-Side Framework
NestJS should be used as the server-side framework for developing the backend of the application. NestJS provides a robust and scalable platform for building server-side applications.
##### Client-Side Library
The client-side of the application should be developed using the React library. React is known for its user interface components and efficient rendering.
##### Database Management System
PostgreSQL should be used as the primary database management system for storing user information and other relevant data.
##### Testing
Comprehensive testing should be conducted to ensure the reliability and quality of the software.
Jest and React Testing Library should be used for testing both the server-side and client-side components.
##### Containerization
Both the server-side and client-side components of the software should be containerized using Docker. This will facilitate easy deployment and scaling of the application.

### Conclusion
This Software Requirements Specification defines the key features and technical requirements for the user management tool. It is essential to adhere to these requirements during the development process to ensure the successful implementation of the software. Properly implementing these features and technologies will result in a secure, efficient, and user-friendly application for managing user accounts.
