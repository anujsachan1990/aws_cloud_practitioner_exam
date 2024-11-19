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

interface UserData {
  name: string;
}

const Footer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-gray-200 backdrop-blur-sm shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between">
            {/* Copyright section - left side on desktop */}
            <div className="text-sm text-gray-600">
              <span>© {new Date().getFullYear()} Anuj Sachan</span>
              <span className="mx-1">|</span>
              <span>
                Built using{" "}
                <a
                  href="https://v0.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  V0
                </a>{" "}
                and{" "}
                <a
                  href="https://cursor.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Cursor
                </a>
              </span>
            </div>

            {/* Social links - right side on desktop */}
            <div className="flex gap-4">
              <a
                href="https://buymeacoffee.com/anujsachan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#FFDD00] text-[#000000] px-3 py-1.5 rounded-md hover:bg-[#FFDD00]/90 transition-all duration-200"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
                </svg>
                <span className="font-medium">Buy me a coffee</span>
              </a>

              <a
                href="https://www.linkedin.com/in/anuj-sachan-04a3a224/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#0077b5] transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="font-medium">LinkedIn</span>
              </a>

              <a
                href="https://github.com/anujsachan1990"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="font-medium">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Hidden on Desktop */}
        <div className="sm:hidden">
          <div className="flex flex-col gap-2">
            {/* Social links - top row on mobile */}
            <div className="flex justify-center gap-2">
              <a
                href="https://buymeacoffee.com/anujsachan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-[#FFDD00] text-[#000000] px-2 py-1 rounded-md hover:bg-[#FFDD00]/90 transition-all duration-200 text-xs"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
                </svg>
                <span className="font-medium">Buy me a coffee</span>
              </a>

              <a
                href="https://www.linkedin.com/in/anuj-sachan-04a3a224/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#0077b5] transition-colors text-xs"
              >
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://github.com/anujsachan1990"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors text-xs"
              >
                <svg
                  className="h-3 w-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>

            {/* Copyright section - bottom row on mobile */}
            <div className="text-center text-xs text-gray-600">
              <span>© {new Date().getFullYear()} Anuj Sachan</span>
              <span className="mx-1">|</span>
              <span>
                Built using{" "}
                <a
                  href="https://v0.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  V0
                </a>{" "}
                and{" "}
                <a
                  href="https://cursor.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Cursor
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [userName, setUserName] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("awsExamUserData");
    if (userData) {
      const { name } = JSON.parse(userData);
      setUserName(name);
      setIsRegistered(true);
    }
  }, []);

  useEffect(() => {
    if (isRegistered && examNumber) {
      fetchExamData(examNumber);
    }
  }, [isRegistered, examNumber]);

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
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/anujsachan1990/AWS-Certified-Cloud-Practitioner-Notes/contents/practice-exam/practice-exam-${examNum}.md`,
        {
          headers: {
            Authorization: `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exam data");
      }
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

    // Helper function to clean text
    const cleanText = (text: string): string => {
      // Remove HTML tags
      const withoutHtml = text.replace(/<[^>]*>/g, "");
      // Decode HTML entities
      const decoded = withoutHtml
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ");
      return decoded.trim();
    };

    for (const line of lines) {
      // Match question number and text
      const questionMatch = line.match(/^\d+\.\s(.+)/);
      if (questionMatch) {
        if (currentQuestion.question) {
          parsedQuestions.push(currentQuestion as Question);
        }
        currentQuestion = {
          question: cleanText(questionMatch[1]),
          options: [],
          correctAnswers: [],
        };
        isCollectingOptions = true;
        continue;
      }

      // Match options
      const optionMatch = line.match(/^\s*-\s*([A-E]\..*)/);
      if (isCollectingOptions && optionMatch) {
        const option = cleanText(optionMatch[1]);
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
    saveAttempt();
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserData = {
      name: userName,
    };
    localStorage.setItem("awsExamUserData", JSON.stringify(userData));
    setIsRegistered(true);
  };

  const saveAttempt = () => {
    const userData = {
      name: userName,
    };
    localStorage.setItem("awsExamUserData", JSON.stringify(userData));
  };

  const resetExam = () => {
    // Clear local storage
    localStorage.removeItem("awsExamUserData");

    // Reset all states
    setUserName("");
    setIsRegistered(false);
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setShowResults(false);
    setTimeLeft(50 * 60);
    setLoading(true);
    setError(null);

    // Force a re-render by updating the URL
    router.push(`?exam=1`);
  };

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardContent className="flex items-center justify-center h-64">
          <span className="text-red-500">{error}</span>
          <Button
            onClick={() => {
              setError(null);
              fetchExamData(examNumber);
            }}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-20 pt-6">
      <div className="px-4 max-w-4xl mx-auto">
        {!isRegistered ? (
          <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-2xl border-[#ff9900]/20">
            <CardHeader className="text-center space-y-4">
              <img
                src="https://download.logo.wine/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.png"
                alt="AWS Logo"
                className="h-20 mx-auto mb-4"
              />
              <div className="space-y-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-[#232f3e]">
                    AWS Cloud Practitioner Exam Mocks
                  </CardTitle>
                  <p className="text-lg font-semibold text-[#ff9900]">
                    CLF-C02
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {/* Feature badges */}
                  <div className="flex flex-wrap justify-center gap-2">
                    <div className="flex items-center gap-1 text-[#0e9f6e] bg-[#0e9f6e]/10 px-3 py-1 rounded-full">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      <span className="font-medium">23 Practice Exams</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#0e9f6e] bg-[#0e9f6e]/10 px-3 py-1 rounded-full">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">Always Free</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#0e9f6e] bg-[#0e9f6e]/10 px-3 py-1 rounded-full">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">No Signup Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Your Name
                  </Label>
                  <input
                    id="name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exam" className="text-base">
                    Select Exam
                  </Label>
                  <Select value={examNumber} onValueChange={handleExamChange}>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Choose an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 23 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          Practice Exam {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <details className="mt-6 rounded-lg border border-blue-200 overflow-hidden">
                  <summary className="px-4 py-3 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors flex items-center gap-2 text-blue-800 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Important Information About These Mocks
                  </summary>
                  <div className="p-4 bg-blue-50/50 text-sm text-blue-800 space-y-2">
                    <p>
                      The scoring for this exam simulation differs from the
                      actual AWS Certified Cloud Practitioner exam. Here, the
                      score is calculated based solely on the number of correct
                      answers divided by the total number of questions. It does
                      not take into account the domain-based weighting described
                      in the
                    </p>
                    <p className="mt-2">
                      <a
                        href="https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        AWS Certified Cloud Practitioner Exam Guide{" "}
                      </a>
                      .
                    </p>
                    <p className="mt-2">
                      Credit: The questions used in this simulation are sourced
                      from the repository{" "}
                      <a
                        href="https://github.com/kananinirav/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        https://github.com/kananinirav/
                      </a>
                      .
                    </p>
                    <p>
                      If you identify any incorrect answers, please{" "}
                      <a
                        href="https://github.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        report them here
                      </a>
                      .
                    </p>
                  </div>
                </details>
                <Button type="submit" className="w-full py-5 text-lg">
                  Start Practice
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : loading ? (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                onClick={resetExam}
                className="px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-red-600 hover:bg-red-700"
              >
                Reset Exam
              </Button>
            </div>
            <Card className="w-full">
              <CardContent className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading exam questions...</span>
              </CardContent>
            </Card>
          </>
        ) : questions.length === 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="destructive"
                onClick={resetExam}
                className="px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-red-600 hover:bg-red-700"
              >
                Reset Exam
              </Button>
            </div>
            <Card className="w-full">
              <CardContent className="flex items-center justify-center h-64">
                <span>No questions available. Please try again.</span>
              </CardContent>
            </Card>
          </>
        ) : showResults ? (
          <>
            <div className="flex justify-between mb-4">
              <Button
                onClick={() => {
                  setIsRegistered(false);
                  setShowResults(false);
                  setUserAnswers([]);
                  setScore(0);
                  setCurrentQuestion(0);
                }}
                variant="outline"
                className="px-6 py-2 font-medium"
              >
                Back to Exam Selection
              </Button>
              <Button
                variant="destructive"
                onClick={resetExam}
                className="px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-red-600 hover:bg-red-700"
              >
                Reset Exam
              </Button>
            </div>
            <Card className="w-full mb-20">
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
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <span className="text-lg">
                  Welcome,{" "}
                  <span className="font-bold text-[#232f3e]">{userName}</span>!
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={resetExam}
                className="px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 bg-red-600 hover:bg-red-700"
              >
                Reset Exam
              </Button>
            </div>
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
              <h2 className="text-lg text-gray-600 mb-4">
                Practice Exam {examNumber}
              </h2>
            </div>

            {/* Exam Card */}
            <Card className="w-full mb-20">
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
                          checked={userAnswers[currentQuestion]?.includes(
                            option
                          )}
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
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 border-t pt-6">
                <div className="w-full sm:w-auto">
                  <Button
                    onClick={endExam}
                    variant="destructive"
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    End Exam
                  </Button>
                </div>
                <div className="flex w-full sm:w-auto gap-4">
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 sm:flex-none border-2 hover:bg-gray-50"
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 sm:flex-none bg-[#232f3e] hover:bg-[#394759]"
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
        <Footer />
      </div>
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
