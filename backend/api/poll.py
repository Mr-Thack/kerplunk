from dataclasses import dataclass
from os.path import isfile
import csv
from fastapi import File
from collections import Counter

@dataclass
class Question():
    question: str
    answers: [str]
    icons: [str]  # This is a google material icon

def q(question: str, answers: [str], icons: [str]) -> Question:
    return Question(
        question=question,
        answers=answers,
        icons=icons
    )

questions = [
    q(
        "What are you?",
        [
            "Teacher",
            "Student"
        ],
        [
            "face_retouching_natural",
            "child_care"
        ]
    ),
    q(
        "Which device do you prefer to use Remind with?",
        [
            "Cellphone",
            "Tablet",
            "Desktop/Laptop"
        ],
        [
            "smartphone",
            "tablet",
            "computer"
        ]
    )
]

dfile = "../data/poll.csv"
fieldnames=[que.question for que in questions]

def get_questions() -> [Question]:
    return questions

def write_resp(rz: [int]):
    with open(dfile, 'a') as fcsv:
        writer = csv.DictWriter(fcsv, fieldnames=fieldnames)
        writer.writerow({fieldnames[i]:questions[i].answers[rz[i]] for i in range(len(fieldnames))})

def get_poll_results():
    summary = []
    with open(dfile, 'r') as f:
        reader = csv.DictReader(f)
        results = [list(row.values()) for row in reader]
        print(results)
        summary = [Counter([result[i] for result in results]).most_common() for i in range(len(results[0]))]
    return dict(zip(fieldnames, summary))
            
if not isfile(dfile):
    print('creating data file')
    with open(dfile, 'w+') as fcsv:
        writer = csv.DictWriter(fcsv, fieldnames=fieldnames)
        writer.writeheader()

