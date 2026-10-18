# Student Finance Tracker
A simple web app I built to keep track of student spending. You can add transactions,search them with regular expression, sort them, and see how much you've spent against a budget cap. it's made with plain HTML, CSS and Javascript, and everything you enter stays inyour own browser.

-**Live Demo:** [bahiizi11.github.io/student-finance-tracker](https://bahiizi11.github.io/student-finance-tracker/)
-**Demo Video:** https://youtu.be/dcy_-lOuy8g
-**Author:** Arsene Manzi

## Features
-  Add, edit and delete transactions, with validation on every field
-  Live regex search with matches highlighted (and an "ignore case" option)
- Sort by date, description or amount
-  Dashboard with total spent, number of records, top category and the last 7 days.
-  Spending cap that warns you when you go over
-  Settings for the cap, base currency and two other currencies.
-  Export and import data your data as JSON.
-  Sample data that you can load with one click
-  Your data is saved in the browser , so it's still there after a refresh
-  HTML typed into a record is shown as plain text and  never runs. One sample record, `<script>alert('x')</script>` test ,check this


## Getting started


You only need VS Code with the **Live Server** extension.

1. Clone or download the repository.
2. open the folder in VS code.
3. Right-click 'index.html' and choose **open with  Live server**

please don't just double-click `index.html`. The app uses javascript modules which don't work when a page is opened straight from your files.

## Running the tests
With Live Server running, open `tests.html`. It runs all the tests in `tests.js` and shows PASS or FAIL for each one.


## Validation rules

| Field | Rule | Valid | Invalid |
|---|---|---|---|
| Description | 1 to 80 characters, no space at the start or end | `Lunch at cafe` | ` Lunch` |
| Amount | Whole number or up to 2 decimals, no leading zeros or negatives | `12.50` | `01`, `-5`, `12.345` |
| Date | `YYYY-MM-DD` and a real date | `2024-02-29` | `2025-02-29` |
| Category | Letters, spaces and hyphens only | `Part-time work` | `Food2` |
| Duplicate word | Shows a tip if a word is repeated | `Coffee coffee run` | |
| Currency code | 3 capital letters | `USD` | `US1` |
| Exchange rate | A number above 0 | `0.92` | `abc` | 

## Accessibility

-A skip link appears as soon as you press Tab
- Everything can be used with the keyboard(Tab, Shift+Tab and Enter)
- All  inputs  are labelled, and error messages are associated with their  fields.
- Clear focus outlines on all controls
- Screen readers are told about the cap: a gentle message for "remaining" and an urgent alert when you go over
- Works on mobile devices

My plans are in `docs/spec.md` and `docs/a11y-plan.md` , and the wireframes are in `docs/wireframes/`.

## Project structure
```
index.html               the app
tests.html               test page
tests.js                 the tests
seed.json                sample data
styles/main.css          styles
scripts/app.js           app logic
scripts/validators.js    validation and helper functions
docs/       spec, accessiblity plan and wireframes
```

## About the commit history

I built  milestone 4, 5 and 6 together, so they share one commit. The stats, the cap , saving data and import/export were already in that commit by the time I got to M5 and M6, and I only tested them afterwards. I didn't make empty commits just to fill the history.

I also hit a problem with Codepause , the extension I used to track my coding time. its  database got corrupted (probably when my laptop went to sleep) and I lost the tracking data for 14 october. I had a backup of everything up to 13 october , and the commit history on the Github shows the rest of my work.

## Author
- **Arsene Manzi**
- Email: a.manzi@alustudent.com
- Github: [bahiizi11](htpps://github.com/bahiizi11)













