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
import { useSearchParams, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  question: string;
  options: string[];
  correctAnswers: string[];
}

function ExamContent() {
  const router = useRouter();
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
      const shuffledQuestions = shuffleArray(parsedQuestions);
      setQuestions(shuffledQuestions);
      setUserAnswers(new Array(shuffledQuestions.length).fill([]));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setLoading(false);
    }
  };

  const shuffleArray = (array: Question[]): Question[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const parseMarkdown = (markdown: string): Question[] => {
    const lines = markdown.split("\n");
    const parsedQuestions: Question[] = [];
    let currentQuestion: Partial<Question> = {};
    let isCollectingOptions = false;

    for (const line of lines) {
      // Match question number and text
      const questionMatch = line.match(/^\d+\.\s(.+)/);
      if (questionMatch) {
        if (currentQuestion.question) {
          parsedQuestions.push(currentQuestion as Question);
        }
        currentQuestion = {
          question: questionMatch[1].trim(),
          options: [],
          correctAnswers: [],
        };
        isCollectingOptions = true;
        continue;
      }

      // Match options
      const optionMatch = line.match(/^\s*-\s*([A-E]\..*)/);
      if (isCollectingOptions && optionMatch) {
        const option = optionMatch[1].trim();
        currentQuestion.options?.push(option);
      }

      // Match correct answers - Multiple formats
      const answerLine = line.trim();
      if (answerLine.includes("Correct")) {
        let answers: string[] = [];

        // Format 1: "Correct answer: A, B" or "Correct Answer: A, B"
        const commaFormat = answerLine.match(
          /Correct [Aa]nswer:\s*([A-E](?:,\s*[A-E])*)/
        );
        // Format 2: "Correct Answer: AC" or "Correct Answer: BE"
        const concatenatedFormat = answerLine.match(
          /Correct [Aa]nswer:\s*([A-E]{1,5})/
        );

        if (commaFormat) {
          answers = commaFormat[1].split(/,\s*/);
        } else if (concatenatedFormat) {
          // Split the concatenated string into individual letters
          answers = concatenatedFormat[1].split("");
        }

        // Convert letter answers to full option text and ensure unique answers
        currentQuestion.correctAnswers = Array.from(
          new Set(
            answers.map((letter) => {
              const fullOption = currentQuestion.options?.find((opt) =>
                opt.startsWith(`${letter.trim()}.`)
              );
              return fullOption || letter.trim();
            })
          )
        );
        isCollectingOptions = false;
      }
    }

    // Add the last question
    if (currentQuestion.question) {
      parsedQuestions.push(currentQuestion as Question);
    }

    return parsedQuestions;
  };

  const handleAnswer = (answer: string) => {
    const newUserAnswers = [...userAnswers];
    const currentAnswers = newUserAnswers[currentQuestion] || [];
    const isMultiAnswer = questions[currentQuestion].correctAnswers.length > 1;

    if (isMultiAnswer) {
      // For multiple choice questions
      if (currentAnswers.includes(answer)) {
        // Remove if already selected
        newUserAnswers[currentQuestion] = currentAnswers.filter(
          (a) => a !== answer
        );
      } else {
        // Add new selection
        newUserAnswers[currentQuestion] = [...currentAnswers, answer];
      }
    } else {
      // For single choice questions
      newUserAnswers[currentQuestion] = [answer];
    }

    setUserAnswers(newUserAnswers);
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

  const isAnswerCorrect = (questionIndex: number, userAnswers: string[][]) => {
    const currentUserAnswers = userAnswers[questionIndex] || [];
    const correctAnswers = questions[questionIndex].correctAnswers;

    // Extract letters from both user answers and correct answers
    const userLetters = currentUserAnswers
      .map((answer) => answer.split(".")[0].trim())
      .sort();
    const correctLetters = correctAnswers
      .map((answer) => answer.split(".")[0].trim())
      .sort();

    // For multiple choice questions, check if all correct answers are selected
    if (correctLetters.length > 1) {
      return (
        userLetters.length === correctLetters.length &&
        userLetters.every((letter) => correctLetters.includes(letter)) &&
        correctLetters.every((letter) => userLetters.includes(letter))
      );
    }

    // For single choice questions
    return userLetters[0] === correctLetters[0];
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleExamChange = (value: string) => {
    router.push(`?exam=${value}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4">
      {loading ? (
        <Card className="w-full max-w-4xl mx-auto mt-8">
          <CardContent className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading exam questions...</span>
          </CardContent>
        </Card>
      ) : showResults ? (
        <Card className="w-full max-w-4xl mx-auto mt-8">
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
      ) : (
        <>
          {/* Exam Header */}
          <div className="text-center mb-8">
            <img
              src="https://download.logo.wine/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.png"
              alt="AWS Logo"
              className="h-20 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-[#232f3e] mb-2">
              AWS Certified Cloud Practitioner
            </h1>
            <h2 className="text-lg text-gray-600 mb-4">Exam Code: CLF-02</h2>

            {/* Exam Selector */}
            <div className="flex justify-center items-center gap-2">
              <span className="text-gray-600">Select Exam:</span>
              <Select value={examNumber} onValueChange={handleExamChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Practice Exam {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exam Card */}
          <Card className="w-full max-w-4xl mx-auto mt-4 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle className="text-[#232f3e]">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <div className="text-right">
                <p className="font-semibold text-[#232f3e]">
                  Time Left: {formatTime(timeLeft)}
                </p>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-6 text-lg">
                {questions[currentQuestion].question}
              </p>
              {questions[currentQuestion].correctAnswers.length > 1 ? (
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`option-${index}`}
                        checked={userAnswers[currentQuestion]?.includes(option)}
                        onCheckedChange={() => handleAnswer(option)}
                        className="border-2"
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-base cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  onValueChange={handleAnswer}
                  value={userAnswers[currentQuestion]?.[0]}
                  className="space-y-4"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="text-base cursor-pointer flex-1"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={endExam}
                  variant="outline"
                  className="border-2 hover:bg-gray-50"
                >
                  End Exam
                </Button>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handlePrevious}
                  variant="outline"
                  className="border-2 hover:bg-gray-50"
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-[#232f3e] hover:bg-[#394759]"
                >
                  {currentQuestion < questions.length - 1
                    ? "Next Question"
                    : "Finish Exam"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  );
}

export function AwsPracticeExam() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExamContent />
    </Suspense>
  );
}
