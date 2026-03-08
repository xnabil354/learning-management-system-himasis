"use client";

import { useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Sparkles,
  ChevronRight,
  Brain,
  Loader2,
} from "lucide-react";
import { submitQuiz } from "@/lib/actions/quiz";

interface QuizOption {
  _key: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  _key: string;
  questionText: string;
  options: QuizOption[];
  explanation?: string;
}

interface PreviousResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  attempts: number;
}

interface QuizSectionProps {
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestion[];
  previousResult: PreviousResult | null;
}

type QuizState = "idle" | "taking" | "reviewing" | "submitted";

export function QuizSection({
  lessonId,
  lessonTitle,
  questions,
  previousResult,
}: QuizSectionProps) {
  const [state, setState] = useState<QuizState>(
    previousResult ? "idle" : "idle",
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correctAnswers: number;
    xpGained?: number;
    newBadges?: string[];
    isNewBest: boolean;
  } | null>(null);

  const totalQuestions = questions.length;

  const handleStartQuiz = useCallback(() => {
    setState("taking");
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setResult(null);
  }, []);

  const handleSelectAnswer = useCallback(
    (questionIndex: number, optionIndex: number) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: optionIndex,
      }));
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, totalQuestions]);

  const handlePrev = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    const answers = questions.map((q, i) => {
      const selectedIdx = selectedAnswers[i] ?? -1;
      const selectedOption = q.options[selectedIdx];
      return {
        questionIndex: i,
        selectedOptionIndex: selectedIdx,
        isCorrect: selectedOption?.isCorrect ?? false,
      };
    });

    try {
      const res = await submitQuiz(
        lessonId,
        lessonTitle,
        answers,
        totalQuestions,
      );
      setResult({
        score: res.score,
        correctAnswers: res.correctAnswers,
        xpGained: res.xpGained,
        newBadges: res.newBadges,
        isNewBest: res.isNewBest,
      });
      setState("submitted");
    } catch (err) {
      console.error("Quiz submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [questions, selectedAnswers, lessonId, lessonTitle, totalQuestions]);

  const allAnswered = totalQuestions === Object.keys(selectedAnswers).length;

  if (state === "idle") {
    return (
      <div className="bg-gradient-to-br from-violet-500/[0.08] via-[#0F0F10] to-fuchsia-500/[0.08] border border-violet-500/20 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 shrink-0">
            <Brain className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Quiz Assessment
            </h3>
            <p className="text-zinc-400 text-sm">
              Test pemahamanmu tentang materi di lesson ini. Terdapat{" "}
              <span className="text-white font-semibold">
                {totalQuestions} pertanyaan
              </span>{" "}
              multiple choice.
            </p>
          </div>
        </div>

        {previousResult && (
          <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <h4 className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
              Hasil Terbaik Sebelumnya
            </h4>
            <div className="flex items-center gap-4">
              <div
                className={`text-3xl font-bold ${
                  previousResult.score >= 80
                    ? "text-emerald-400"
                    : previousResult.score >= 50
                      ? "text-amber-400"
                      : "text-red-400"
                }`}
              >
                {previousResult.score}%
              </div>
              <div className="text-sm text-zinc-400">
                <p>
                  {previousResult.correctAnswers}/
                  {previousResult.totalQuestions} jawaban benar
                </p>
                <p className="text-zinc-500">
                  {previousResult.attempts}x percobaan
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold text-sm shadow-lg shadow-violet-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            {previousResult ? "Coba Lagi" : "Mulai Quiz"}
          </button>
          <span className="text-xs text-zinc-500">
            ⏱ ~{Math.max(1, Math.ceil(totalQuestions * 0.5))} menit
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Skor sempurna (100%) ={" "}
            <strong className="text-amber-400">+15 Bonus XP</strong>
          </span>
        </div>
      </div>
    );
  }

  if (state === "taking") {
    const question = questions[currentQuestion];
    const selectedIdx = selectedAnswers[currentQuestion];

    return (
      <div className="bg-[#0F0F10] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="h-1 bg-white/[0.04]">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500 ease-out"
            style={{
              width: `${(Object.keys(selectedAnswers).length / totalQuestions) * 100}%`,
            }}
          />
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Soal {currentQuestion + 1} dari {totalQuestions}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQuestion(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    i === currentQuestion
                      ? "bg-violet-600 text-white scale-110"
                      : selectedAnswers[i] !== undefined
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-white/[0.04] text-zinc-500 hover:bg-white/[0.08]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-6 leading-relaxed">
            {question.questionText}
          </h3>

          <div className="space-y-3 mb-8">
            {question.options.map((option, optIdx) => {
              const isSelected = selectedIdx === optIdx;
              const letter = String.fromCharCode(65 + optIdx);

              return (
                <button
                  key={option._key}
                  onClick={() => handleSelectAnswer(currentQuestion, optIdx)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                    isSelected
                      ? "bg-violet-500/10 border-violet-500/40 ring-1 ring-violet-500/20"
                      : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                        : "bg-white/[0.06] text-zinc-400 group-hover:bg-white/[0.1]"
                    }`}
                  >
                    {letter}
                  </div>
                  <span
                    className={`text-sm leading-relaxed ${
                      isSelected ? "text-white font-medium" : "text-zinc-300"
                    }`}
                  >
                    {option.text}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="px-4 py-2.5 rounded-xl text-sm font-medium border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Sebelumnya
            </button>

            {currentQuestion < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                disabled={selectedIdx === undefined}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Submit Jawaban
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === "submitted" && result) {
    const isPerfect = result.score === 100;
    const isGood = result.score >= 80;

    return (
      <div className="bg-[#0F0F10] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div
          className={`p-8 text-center ${
            isPerfect
              ? "bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/10"
              : isGood
                ? "bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-500/10"
                : "bg-gradient-to-br from-violet-500/10 via-transparent to-violet-500/10"
          }`}
        >
          {isPerfect && <div className="text-4xl mb-3 animate-bounce">🏆</div>}
          <div
            className={`text-6xl font-bold mb-2 ${
              isPerfect
                ? "text-amber-400"
                : isGood
                  ? "text-emerald-400"
                  : result.score >= 50
                    ? "text-amber-400"
                    : "text-red-400"
            }`}
          >
            {result.score}%
          </div>
          <p className="text-zinc-400 text-sm">
            {result.correctAnswers} dari {totalQuestions} jawaban benar
          </p>
          <p className="text-lg font-semibold text-white mt-2">
            {isPerfect
              ? "Sempurna! Kamu menguasai materi ini! 🎉"
              : isGood
                ? "Bagus sekali! Hampir sempurna!"
                : result.score >= 50
                  ? "Cukup baik, terus belajar!"
                  : "Jangan menyerah, coba lagi!"}
          </p>

          {result.xpGained && result.xpGained > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />+{result.xpGained} Bonus XP!
            </div>
          )}

          {result.isNewBest && (
            <div className="mt-2 text-xs text-emerald-400 font-medium">
              🎯 Skor Terbaik Baru!
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 space-y-4">
          <h4 className="text-sm text-zinc-500 uppercase tracking-wider font-medium mb-4">
            Review Jawaban
          </h4>
          {questions.map((q, i) => {
            const selectedIdx = selectedAnswers[i];
            const selectedOption = q.options[selectedIdx];
            const correct = selectedOption?.isCorrect ?? false;
            const correctOption = q.options.find((o) => o.isCorrect);

            return (
              <div
                key={q._key}
                className={`p-4 rounded-xl border ${
                  correct
                    ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                    : "border-red-500/20 bg-red-500/[0.03]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium mb-1">
                      {i + 1}. {q.questionText}
                    </p>
                    {!correct && (
                      <p className="text-xs text-red-400 mb-0.5">
                        Jawabanmu: {selectedOption?.text ?? "Tidak dijawab"}
                      </p>
                    )}
                    <p className="text-xs text-emerald-400">
                      Jawaban benar: {correctOption?.text ?? "—"}
                    </p>
                    {q.explanation && (
                      <p className="text-xs text-zinc-500 mt-1 italic">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleStartQuiz}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
