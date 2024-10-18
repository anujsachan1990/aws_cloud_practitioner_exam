"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearchParams } from "next/navigation";

interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];
}

function ExamContent() {
  const searchParams = useSearchParams();
  const examNumber = searchParams.get("exam") || "1";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(50 * 60); // 50 minutes in seconds

  useEffect(() => {
    fetchExamData(examNumber);
  }, [examNumber]);

  useEffect(() => {
    if (!loading && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            endExam();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, showResults]);

  const fetchExamData = async (examNum: string) => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/contents/practice-exam/practice-exam-${examNum}.md`
      );
      const data = await response.json();
      const content = atob(data.content);
      const parsedQuestions = parseMarkdown(content);
      setQuestions(parsedQuestions);
      setUserAnswers(new Array(parsedQuestions.length).fill([]));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setLoading(false);
    }
  };

  const parseMarkdown = (markdown: string): Question[] => {
    const lines = markdown.split("\n");
    const parsedQuestions: Question[] = [];
    let currentQuestion: Partial<Question> = {};

    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        if (currentQuestion.question) {
          parsedQuestions.push(currentQuestion as Question);
        }
        currentQuestion = {
          question: line.replace(/^\d+\.\s*/, ""),
          options: [],
          correctAnswers: [],
        };
      } else if (line.startsWith("    - ")) {
        currentQuestion.options?.push(line.replace("    - ", ""));
      } else if (line.includes("Correct answer:")) {
        const answers = line.replace("Correct answer:", "").trim().split(",");
        currentQuestion.correctAnswers = answers.map((answer) => answer.trim());
      }
    }

    if (currentQuestion.question) {
      parsedQuestions.push(currentQuestion as Question);
    }

    return parsedQuestions;
  };

  const handleAnswer = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    const currentAnswers = newUserAnswers[currentQuestion] || [];

    if (questions[currentQuestion].correctAnswers.length === 1) {
      // Single answer question
      newUserAnswers[currentQuestion] = [answer];
    } else {
      // Multi answer question
      if (currentAnswers.includes(answer)) {
        newUserAnswers[currentQuestion] = currentAnswers.filter(
          (a) => a !== answer
        );
      } else {
        newUserAnswers[currentQuestion] = [...currentAnswers, answer];
      }
    }

    setUserAnswers(newUserAnswers);
    updateScore(newUserAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      endExam();
    }
  };

  const updateScore = (answers: string[][]) => {
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (isAnswerCorrect(i, answers)) {
        newScore++;
      }
    }
    setScore(newScore);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const endExam = () => {
    updateScore(userAnswers);
    setShowResults(true);
  };

  const isAnswerCorrect = (questionIndex: number, answers: string[][]) => {
    const userAnswerSet = new Set(answers[questionIndex]);
    const correctAnswerSet = new Set(questions[questionIndex].correctAnswers);
    if (questions[questionIndex].correctAnswers.length === 1) {
      // Single answer question
      return (
        userAnswerSet.size === 1 &&
        questions[questionIndex].options.findIndex(
          (option) =>
            option.startsWith(questions[questionIndex].correctAnswers[0]) &&
            userAnswerSet.has(option)
        ) !== -1
      );
    } else {
      // Multi answer question
      return (
        userAnswerSet.size === correctAnswerSet.size &&
        Array.from(userAnswerSet).every(
          (answer) =>
            questions[questionIndex].options.findIndex(
              (option) =>
                option.startsWith(answer) &&
                correctAnswerSet.has(answer.split(".")[0])
            ) !== -1
        )
      );
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading exam questions...</span>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold mb-4">
            Your score: {score} out of {questions.length}
          </p>
          <p className="mb-4">
            Percentage: {((score / questions.length) * 100).toFixed(2)}%
          </p>
          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            {questions.map((question, index) => (
              <div key={index} className="mb-6 pb-4 border-b">
                <p className="font-semibold mb-2">
                  Question {index + 1}: {question.question}
                </p>
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-2 mb-1"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${
                        question.correctAnswers.includes(option)
                          ? "bg-green-500"
                          : userAnswers[index]?.includes(option)
                          ? "bg-red-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                    <span
                      className={
                        question.correctAnswers.includes(option)
                          ? "font-semibold"
                          : ""
                      }
                    >
                      {option}
                    </span>
                  </div>
                ))}
                <p className="mt-2 text-sm">
                  {isAnswerCorrect(index, userAnswers)
                    ? "Correct"
                    : "Incorrect"}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isMultiAnswer = question.correctAnswers.length > 1;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Question {currentQuestion + 1} of {questions.length}
        </CardTitle>
        <div className="text-right">
          <p className="font-semibold">Time Left: {formatTime(timeLeft)}</p>
          <p className="text-sm">
            Current Score: {score}/{currentQuestion + 1}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.question}</p>
        {isMultiAnswer ? (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`option-${index}`}
                  checked={userAnswers[currentQuestion]?.includes(option)}
                  onCheckedChange={() => handleAnswer(option)}
                />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            onValueChange={handleAnswer}
            value={userAnswers[currentQuestion]?.[0]}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={endExam} variant="outline">
          End Exam
        </Button>
        <Button onClick={handleNext}>
          {currentQuestion < questions.length - 1
            ? "Next Question"
            : "Finish Exam"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function AwsPracticeExam() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamContent />
    </Suspense>
  );
}
