This project demonstrates common security flaws outlined in OWASP Top 10 2021, providing practical examples of flaws occurring and how hackers exploit them.

This project code is not production ready in terms of security and best practices. The goal of this example project is to showcase security flaws, not to follow best coding practices. Clean and readable code create foundations for implementing secure code.[1]

## Installation instructions

Following commands needs to run in a terminal

### Step 1: Clone the repository

```bash
git clone https://github.com/peltomaa/owasp-vulnerabilities-project
cd owasp-vulnerabilities-project
```

### Step 2: Install Node.js

Make sure Node.js (v21 or higher) is installed. Node.js installation guide: https://nodejs.org/en

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Start app

```bash
npm start
```

The website application will run at http://localhost:3000.

## Automated testing

The project implement automated testing to run exploits. Test are built using Playwright library which allows Browser interaction via code. To run tests website application needs to running in http://localhost:3000.

To start the website application, run following command in terminal:

```bash
npm start
```

Then to run all tests, run following command in terminal:

```bash
npm tests
```

See all test here: https://github.com/peltomaa/owasp-vulnerabilities-project/tree/main/tests

## Flaws

### FLAW 1 (OWASP A01:2021 - Broken Access Control):

The first flaw we are going to explore is A01:2021 – Broken Access Control.
The broken access control flaw is about not enforcing policy, so users are able to act outside their intended permissions.
They can perform access, modify, destruct or perform business function outside their limits.[2]

In this project we explore this problem by not protecting Admin page (GET /admin) and remove user (POST /admin/users) with any permission. This violates the principle of least privilege.[2]

There is E2E test written to run exploit here: https://github.com/peltomaa/owasp-vulnerabilities-project/blob/main/tests/owasp-a01-2021-broken-access-control.spec.ts

Exploit can be run with command:

```bash
npm run test tests/owasp-a01-2021-broken-access-control.spec.ts
```

To fix this problem, we will introduce `isAdmin` function to check if authenticated user has access to the page and user remove action.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/3

### FLAW 2 (OWASP A02:2021 - Cryptographic Failures):

The second flaw involves exploring cryptographic failures. This includes crypting sensitive data in storing and processing, and ensuring up to date cryptographic algorithms or protocols.[3]

In this project in the database in Users table passwords are stored in plain text. If leaked, the data from database would include plain text passwords, allowing access to users account in the system, and even into external service, if they have used the same password there.[3]

There is no test for this exploit.

To fix this problem, we'll introduce two utilities: `hashPassword` and `comparePassword` and we'll change the user creation and login action to use these. For password hash we are using Bcrypt with 12 Salt round which is considered save.[4]

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/4

### FLAW 3 (OWASP A03:2021 - Injection):

The third flaw focuses on injection attacks. In injection attack user-supplied data is not validated, filtered or sanitized by the application. In web applications this means dynamic queries into database without escaping.[5]

In this project we have forgotten implementing sanitization on HTML templating and we are naively using string literals for SQL queries.

#### XSS injection

In first exploit we allow hacker to inject any HTML element into DOM including JavaScript. This can cause malicious code be run on attack victim's machine.

There is E2E test written to run exploit here: https://github.com/peltomaa/owasp-vulnerabilities-project/blob/main/tests/owasp-a03-2021-injection.spec.ts

Exploit can be run with command:

```bash
npm run test tests/owasp-a03-2021-injection.spec.ts
```

To fix the first problem with HTML sanitization we will ensure injected data in sanitized in the ejs templating language.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/2

#### SQL injection

In the second exploit we allow hacker to do SQL injection in our project.

To fix the second problem with SQL injection we will ensure that all variables that we use in SQL queries use the library methods for securely injecting variable into SQL code. In this way we sanitize the input going to the SQL query.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/5

### FLAW 4 (OWASP A04:2021 - Insecure Design):

The fourth flaw examines insecure design. Insecure design includes all design and architectural decisions that make the web application insecure.[6]

In this project we have implemented very naive way of creating session tokens where the username that is used authenticated user into the web application is in plain text in cookie.
Essentially hackers only need to know the username to gain access to any account.

There is E2E test written to run exploit here: https://github.com/peltomaa/owasp-vulnerabilities-project/blob/main/tests/owasp-a04-2021-insecure-design.spec.ts

Exploit can be run with command:

```bash
npm run test tests/owasp-a04-2021-insecure-design.spec.ts
```

To fix the insecure session implementation we'll implement an existing session management library for `express.js` called `express-session`. The library will ensure that the session is stored securely in the browser.

Misconfiguration of `express-session` would fall under OWASP A05:2021 – Security Misconfiguration which we are going to focus on next section.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/3

### FLAW 5 (OWASP A05:2021 – Security Misconfiguration):

The fifth flaw involves learning about security misconfiguration. Security misconfiguration include misconfiguring cloud provider configuration, using default accounts, misconfiguring or having outdated application framework and libraries.[7]

In this project we have configured a debug endpoint GET /debug to get information about the local setup.

There is E2E test written to run exploit here: https://github.com/peltomaa/owasp-vulnerabilities-project/blob/main/tests/owasp-a05-2021-security-misconfiguration.spec.ts

Exploit can be run with command:

```bash
npm run test tests/owasp-a05-2021-security-misconfiguration.spec.ts
```

To fix the problem is we have removed the GET /debug information and replaced it with GET /health endpoint to get application status. Debug information should be shared differently or included in development environment, which is not implement in the fix.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/7

### FLAW 6 (OWASP A10:2021 – Server-Side Request Forgery (SSRF)):

The sixth flaw explores how we accidentally allow calling any endpoint via our web application to cause a server-side request forgery (SSRF) flaw. The attacker can use this bug to craft a request to an unexpected location, even when protected by firewall or VPN.[8]

In this project in home page we have an image loaded via the GET /api/image endpoint, which plan to optimize through compression in future iterations of the web application.

There is E2E test written to run exploit here: https://github.com/peltomaa/owasp-vulnerabilities-project/blob/main/tests/owasp-a10-2021-ssrf.spec.ts

Exploit can be run with command:

```bash
npm run test tests/owasp-a10-2021-ssrf.spec.ts
```

To fix the problem the image URL is now hardcoded into backend code.

You can see fix here: https://github.com/peltomaa/owasp-vulnerabilities-project/pull/6

## LLM usage

ChatGPT was used to spellcheck the text.

## Sources

[1] https://www.kiuwan.com/blog/what-is-clean-code-and-does-it-promote-security/

[2] https://owasp.org/Top10/A01_2021-Broken_Access_Control/

[3] https://owasp.org/Top10/A02_2021-Cryptographic_Failures/

[4] https://securinglaravel.com/security-tip-increase-your-bcrypt/

[5] https://owasp.org/Top10/A03_2021-Injection/

[6] https://owasp.org/Top10/A04_2021-Insecure_Design/

[7] https://owasp.org/Top10/A05_2021-Security_Misconfiguration/

[8] https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/
