# AI Notes for Slightly More Awesome

These notes were created by humans to help the AI assistant in the initial
development of the Slightly More Awesome web app. Users of the app should
see the [README.md](README.md) file for information on how to use the app.

## Overview

Slightly More Awesome (SMA) is a daily, shareable, subject review app that will
make you slightly more awesome at a subject of your choice. SMA is a easy to use
web app that will help you review a subject in a fun and engaging way. SMA is
inspired by [Stormoji](https://stormoji.com).

Each day you are given a set of four questions in your subject and you just need
to answer them. The questions are randomly selected from a list of review questions
that have been curated for the subject. Once all four questions are answered, you
will see your results and have the option to share them with friends and family.
Up to six months of result history are saved in your browser's local storage.

The design of the home page and other pages is described below.

## Design notes

There is one home page and one subject page for each subject. Each page has the
same header and footer.

### Header
At the top left of the header is a unicode light bulb emoji (💡) followed by
the site name. At the top right of the header is a menu unicode emoji (≡)
that links to a drop down menu with links to the subject pages and settings
page. The user can click on the site name to go to the home page. The user can
click on the menu icon to go to the drop down menu. The user can click on a
subject name to go to the subject page for that subject. The user can click on
the settings link to go to the settings page.

### Footer
The footer contains the copyright notice.


### Slightly More Awesome: Home page

The home page displays a box with a site introduction, explanation, and some
getting started instructions. Below the box is a collection of subject cards.
Each subject card displays the subject name and a brief description. The user
can click on a subject card to go to the subject page for that subject.

The home page looks something like this:

```plaintext
.-----------------------------------------------------.
| 💡 Slightly More Awesome                          ≡ |
|                                                     |
|                                                     |
|   .-------------------------------------------.     |
|   | Site introduction, explanation, and some  |     |
|   | getting started instructions.             |     |
|   '-------------------------------------------'     |
|                                                     |
|    .----------.  .----------.  .--------------.     |
|    | ACT Prep |  | Spanish  |  | Roman Empire |     |
|    '----------'  '----------'  '--------------'     |
|                                                     |
|                                                     |
|                                                     |
|         Copyright 2025 Slightly More Awesome        |
`-----------------------------------------------------'
```

### Slightly More Awesome: Subject page

Each subject page is available at its own url. The url for each subject page
includes the subject name. For example, the url for the Spanish subject page
is `https://slightlymoreawesome.com/spanish`.

On each subject page, the title in the header is updated to include the subject name.
For example, the title for the Spanish subject page is `💡 Slightly More Awesome: Spanish`.

Each subject page displays a subtitle (e.g. "Spanish refresher for May 5, 2025"). Under
that is a set of four question-sate emojis. Each question-state emoji corresponds to
a randomly selected question, selected from four different randomly selected categories
from this course. The user can click on the emojis to change the question shown below.

When the user hovers over a question-state emoji, a tooltip is displayed that shows
the name of the question category. The tooltip is displayed for five seconds
and then disappears.

Below the qustion-state emojis is the current question with several possible answers.
Each possible answer will be highligted as the user hovers over it. The user can
click on one of the answers to select or deselect it. When an answer is selected,
a white checkmark appears next to it on the left. Only one answer can be
selected at a time.

When the user clicks a diffent question-state emoji, the current question is replaced
with the question for that category.

When answers to all four questions have been selected, the user is able to
click the submit button.

Below the question area on the left is a "hide instructions" link. When the user
clicks the link, the instructions are hidden and the text changed to "show
instructions". When the user clicks the link again, the instructions are
displayed and the text changes back to "hide instructions".

Each subject page looks something like this:

```plaintext

.-----------------------------------------------------.
| 💡 Slightly More Awesome: Spanish                 ≡ |
|                                                     |
|          Spanish refresher for May 5, 2025          |
|                                                     |
|                  🙋  🙋  🙋  💡                     |
|                                                     |
|                                                     |
|   .-------------------------------------------.     |
|   | How do you say, "I'm hungry" in spanish?  |     |
|   |                                           |     |
|   |   A. Mi gato es su casa.                  |     |
|   |   B. Yo tengo hambre.                     |     |
|   |   C. Yo toca la guitara.                  |     |
|   |   D. Yo tengo sed.                        |     |
|   |                                           |     |
|   '-------------------------------------------'     |
|   hide instructions                                 |
|                                                     |
|   Click on one of the options to select or change   |
|   your answer or on one of the four emoji to switch |
|   to another question. Click on the submit button   |
|   to submit your answers.                           |
|                                                     |
|                      [Submit]                       |
|                                                     |
|                                                     |
|         Copyright 2025 Slightly More Awesome        |
`-----------------------------------------------------'

```

#### Submit button

When the user clicks the submit button several things happen:

1. The submit button is removed.
2. The user's answers are compared to the correct answers for the questions.
3. A green checkmark (✅) is displayed to the left of each correct answer (whether or not it was selected by the user).
4. A red X (❌) is displayed to the left of each incorrect user selection.
5. If the user got the answer right, the question-state emoji will change to a green checkmark (✅).
6. If the user got the answer wrong, the question-state emoji will change to a red X (❌).
7. Below the each original question, an explanation of why the correct answer is the correct one
   is displayed. The explanation is displayed in a box with a light gray background. The
   explanation is displayed in a smaller font than the question text.
8. The user can once again click the different question-state emojis to see the questions with the
   above updates and additions.
9. The final results will be displayed below the question area and above the submit button.

The final results will look something like this:

```plaintext

💡 Slightly More Awesome: Spanish refresher for May 5, 2025

   Grammar: ✅
     Verbs: ✅
Adjectives: ❌
   Phrases: ✅

```

10. The final results will also be copied to the clipboard.
11. A flash message will appear below the displayed results that says "Results copied to clipboard".

After clicking 'Submit', the display will look something like this:

```plaintext

.-----------------------------------------------------.
| 💡 Slightly More Awesome: Spanish                 ≡ |
|                                                     |
|          Spanish refresher for May 5, 2025          |
|                                                     |
|                  ✅  ❌  ❌  ✅                     |
|                                                     |
|   .-------------------------------------------.     |
|   | What does the verb "nadar" mean?          |     |
|   |                                           |     |
|   |     A. To eat.                            |     |
|   | ❌  B. To walk.                           |     |
|   | ✅  C. To swim.                           |     |
|   |     D. To juggle flaming cheetos.         |     |
|   |                                           |     |
|   | The correct answer is "to swim"           |     |
|   | because that's how Spanish works.         |     |
|   |                                           |     |
|   '-------------------------------------------'     |
|   show instructions                                 |
|                                                     |
|                                                     |
|   .-------------------------------------------.     |
|   | 💡 Slightly More...  for May 5, 2025      |     |
|   |                                           |     |
|   |     Grammar: ✅                           |     |
|   |       Verbs: ❌                           |     |
|   |  Adjectives: ❌                           |     |
|   |     Phrases: ✅                           |     |
|   |                                           |     |
|   '-------------------------------------------'     |
|                                                     |
|   Results copied to clipboard! Come back tomorrow!  |
|                                                     |
|                                                     |
|                                                     |
|         Copyright 2025 Slightly More Awesome        |
`-----------------------------------------------------'

```

If a user comes back to the same page on the same day, they will see the same
questions and results. If a user comes back to the same page on a different
day, they will see a new set of questions with everything reset.


## Data Model

The data model for the app is simple. The app has a list of subjects. The data
for each subject is contained in a separate javascript data file. Each subject
has a name, a description, and a list of questions categories. Each question
category has a question text, fours possible answers, the correct answer
choice, and an explanation for why that is the correct answer.

Example data for the Spanish subject:

```javascript
// File: subject-data-spanish.js
{
    name: "Spanish",
    description: "Learn Spanish with these fun and engaging questions.",
    questionCategories: [
        {
        name: "Grammar",
        questions: [
            {
            text: "What does the verb 'nadar' mean?",
            answers: [
                "To eat.",
                "To walk.",
                "To swim.",
                "To juggle flaming cheetos."
            ],
            correctAnswer: 2,
            explanation: "The correct answer is 'to swim' because that's how Spanish works."
            },
            {
            text: "What does the verb 'comer' mean?",
            answers: [
                "To eat.",
                "To walk.",
                "To swim.",
                "To juggle flaming cheetos."
            ],
            correctAnswer: 0,
            explanation: "The correct answer is 'to eat' because that's how Spanish works."
            }
        ]
        },
        {
        name: "Verbs",
        questions: [
            {
            text: "What does the verb 'nadar' mean?",
            answers: [
                "To eat.",
                "To walk.",
                "To swim.",
                "To juggle flaming cheetos."
            ],
            correctAnswer: 2,
            explanation: "The correct answer is 'to swim' because that's how Spanish works."
            },
            {
            text: "What does the verb 'comer' mean?",
            answers: [
                "To eat.",
                "To walk.",
                "To swim.",
                "To juggle flaming cheetos."
            ],
            correctAnswer: 0,
            explanation: "The correct answer is 'to eat' because that's how Spanish works."
            }
        ]
        },
        {
        name: "Adjectives",
        questions: [
            {
            text: "What does the adjective 'grande' mean?",
            answers: [
                "Big.",
                "Small.",
                "Medium.",
                "Huge."
            ],
            correctAnswer: 0,
            explanation: "The correct answer is 'big' because that's how Spanish works."
            },
            {
            text: "What does the adjective 'pequeno' mean?",
            answers: [
                "Big.",
                "Small.",
                "Medium.",
                "Huge."
            ],
            correctAnswer: 1,
            explanation: "The correct answer is 'small' because that's how Spanish works."
            }
        ]
        },
        {
        name: "Phrases",
        questions: [
            {
            text: "What does the phrase 'hola, como estas?' mean?",
            answers: [
                "Goodbye, see you later.",
                "Hello, how are you?",
                "I'm hungry.",
                "I'm thirsty."
            ],
            correctAnswer: 1,
            explanation: "The correct answer is 'Hello, how are you?' because that's how Spanish works."
            },
            {
            text: "What does the phrase 'adios, hasta luego' mean?",
            answers: [
                "Goodbye, see you later.",
                "Hello, how are you?",
                "I'm hungry.",
                "I'm thirsty."
            ],
            correctAnswer: 0,
            explanation: "The correct answer is 'Goodbye, see you later.' because that's how Spanish works."
            }
        ]
        }
    ]
}

```

## Implementation notes

This site uses:

- Tailwind CSS for styling
- Flexbox for layout
- Vite for development
- Vitest for testing
- Local storage for storing user history data
- Vue 3 for the user interface
- Font Awesome Free for icons

