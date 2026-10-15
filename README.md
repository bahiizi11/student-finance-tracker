# Student Finance Tracker
A simple web app i built to keep track of student spending. you can add transactions,search them with the regular expression,sort them and see how much you've spent against a budget cap.it's made with plain HTML,CSS and Javascript,and everything you eneter stays in the browser

Live Demo:
Demo Video:
Author:Arsene Manzi

## Features
-Add,edit and delete transactions with validation on every field
-Live regex search with matches highlighted (and an "ignore case" option)
-Sort by date,description or amount
-Dashboard with total spent,number of records,top category and the last 7 days.
-Spending cap that warns you when you go over
-Settings for the cap, base currency and two other currencies.
-Export and import data your data as Json.
-Sample data that you load with one click
-your data is saved in the browser , so it's still after a refresh
-HTML typed into a record is shown as plain text and is never run.One seed record,
<script>alert('x')</script> test,check this


## Getting started

You only need VS code with **Live Server** extension

1.Clone or Downloaad the Repo
2.Open the Folder in the VS code.
3.Right-click 'index.html' and choose **open with a live server**


## Validation rules

| Field | Rule | Valid | Invalid |
|---|---|---|---|
| Description | 1 to 80 characters, no space at the start or end | `Lunch at cafe` | ` Lunch` |
| Amount | Whole number or up to 2 decimals, no leading zeros or negatives | `12.50` | `01`, `-5`, `12.345` |
| Date | `YYYY-MM-DD` and a real date | `2024-02-29` | `2025-02-29` |
| Category | Letters, spaces and hyphens only | `Part-time work` | `Food2` |
| Duplicate word | Shows a tip if a word is repeated | `Coffee coffee run` | |
| currency code | 3 letter | `USD` | `US1` |
| Exchange rate | A positive number | `0.92` | `abc` | 

## Accessibility

-As soon as you press tab skip link will be showing.
-Everything can be used by the keyboard(tab,shift+tab and enter)
-All the input messages are labeeled and error messages are associated with their corresponding fields.
-Removes focus outlines from suggestions
-The screen reader knows about remianing and an alert when exceeded:this is a gentle message and an urgent alert.
-Works on Mobile devices

The plans are on doc/spec.md and docs/a1-plan.md and wireframes are in docs/wireframes/

## Project structure

index.html               the app
tests.html               test page
tests.js                 the tests
seed.json                sample data
styles/main.css          styles
scripts/app.js           app logic
scripts/validators.js    spec, acesibility plan and wireFrames

## about the commit history
i built a milestone 4,5 and 6 together , so they share one commit.The stats , the cap , saving data and import/export were already in that commit by the time i got to M5 and M6, and i only tested them afterwards i didn't make empty commits just to fill history.

i also hit a problem with codepause , the extension i used to track my coding time. it's a database got corrupted (probably when my laptop went to sleep) and i lost the tracking data for 14 october. i had a backup of everything up to 13 october , the commit history on the Github shows the rest of my work.

## Author
Email:a.manzi@alustudent.com
Github: [bahiizi11](htpps://github.com/bahiiizi11)












