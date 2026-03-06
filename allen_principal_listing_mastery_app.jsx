export default function AllenPrincipalListingMasteryApp() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
        :root {
          --bg: #0a0907;
          --surface: #121009;
          --card: #1a1610;
          --border: #2e2820;
          --gold: #d4a843;
          --gold-dim: #8a6e2a;
          --cream: #f0e8d0;
          --red: #c0392b;
          --green: #2ecc71;
          --text: #c8bfaa;
          --text-dim: #6b6050;
          --white: #f5f0e8;
        }
        .ap-shell { background: var(--bg); color: var(--text); font-family: 'IBM Plex Sans', sans-serif; }
        .ap-bask { font-family: 'Libre Baskerville', serif; }
        .ap-mono { font-family: 'IBM Plex Mono', monospace; }
        .ap-display { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
      <AllenPrincipalCourse />
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { Award, CheckCircle2, ChevronLeft, ChevronRight, Download, Lock, PlayCircle, Star, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const blueprintItems = [
  'Prepare — Know the market, property, and likely seller motivations.',
  'Build Trust — Lead with confidence, order, sincerity, and knowledge.',
  'Find Motive — Ask what matters now and what happens if the home does not sell.',
  'Align Strategy — Connect pricing, exposure, timing, and process to the seller’s goal.',
  'Guide Decision — Clarify hesitation and create a clean next step.',
  'Review — After the appointment, evaluate where you led well and where you drifted.'
];

const worksheetPrompts = [
  'What do I already know about this seller before I arrive?',
  'What fear is most likely present in the room?',
  'What outcome matters most to this seller right now?',
  'Which motivation question do I most need answered?',
  'How will I explain pricing, exposure, and timing clearly?',
  'What hesitation is most likely to appear?',
  'What next step would feel most natural if trust is present?',
  'After the appointment: where was I strong, and where did I drift?'
];

const lessons = [
  {
    module: "Module 1 · Foundation",
    title: "Allen Principal — The Standard",
    subtitle: "Preparation. Presence. Structure. Service.",
    excerpt: "Listings are not won by pressure. They are won by clarity, trust, and disciplined presence.",
    content: [
      "The Allen Principal begins with a simple belief: people do not need to be pushed into wise decisions. They need to be led with clarity.",
      "A seller decides in response to confidence, calm, order, and conviction. Your role is not to overpower the appointment. Your role is to steady it.",
      "The standard is this: be the most prepared person in the room, make the process easier to understand, and reduce fear through service."
    ],
    framework: [
      ["Purposeful Pace", "Slow the moment down enough for trust to form."],
      ["Relentless Direction", "Lead the conversation toward an outcome with intention."],
      ["Total Presence", "Give the seller your attention, not a performance."]
    ],
    quiz: {
      q: "What is the core promise of the Allen Principal in a listing appointment?",
      options: [
        "Convince the seller with pressure",
        "Lead with clarity, preparation, and service",
        "Outtalk competing agents",
        "Win by cutting the fee"
      ],
      answer: 1,
      feedbackCorrect: "Exactly. The Allen Principal replaces pressure with disciplined leadership.",
      feedbackWrong: "The Allen Principal is built on clarity, preparation, and service — not pressure or discounting."
    }
  },
  {
    module: "Module 1 · Foundation",
    title: "The Listing Blueprint",
    subtitle: "What actually drives listing success",
    excerpt: "What most agents call talent is usually structure practiced consistently.",
    content: [
      "Most agents overvalue market talk and undervalue communication skill. The better model is simple: strong conversations, consistent prospecting, organized execution.",
      "Your income follows your inventory. Your inventory follows your conversations. Your conversations improve when they are structured.",
      "The listing business rewards those who can turn uncertainty into confidence."
    ],
    stats: [
      { pct: 80, label: "Communication & Selling Skill" },
      { pct: 10, label: "Market / Product Knowledge" },
      { pct: 10, label: "Goals & Time Discipline" }
    ],
    stats2: [
      { pct: 80, label: "Prospecting & Meaningful Contact" },
      { pct: 10, label: "Appointments & Presentation" },
      { pct: 10, label: "Marketing & Servicing" }
    ],
    quiz: {
      q: "According to this blueprint, what is the main engine of listing income?",
      options: ["Brand colors", "Prospecting and meaningful contact", "Open houses", "Social posting alone"],
      answer: 1,
      feedbackCorrect: "Correct. Conversations create appointments, and appointments create inventory.",
      feedbackWrong: "The engine is prospecting and meaningful contact. Everything else supports it."
    }
  },
  {
    module: "Module 2 · Appointment Mastery",
    title: "Trust Before Tactics",
    subtitle: "Why the client must believe you before they buy you",
    excerpt: "No script can rescue an appointment where trust never formed.",
    content: [
      "Before price, before marketing, before your close — the seller must feel safe in your hands.",
      "Trust is built through four signals: confidence, order, sincerity, and situational knowledge.",
      "If your materials are organized, your tone is grounded, and your attention is on them, trust begins before your pitch starts."
    ],
    framework: [
      ["Confidence", "You know where the conversation is going."],
      ["Organization", "Your process is visible and calm."],
      ["Sincerity", "The seller feels that you mean what you say."],
      ["Knowledge", "You understand their market, property, and likely path."]
    ],
    quiz: {
      q: "What should come before marketing stats in a listing appointment?",
      options: ["Commission discussion", "Trust", "Closing dialogue", "Paperwork"],
      answer: 1,
      feedbackCorrect: "Right. Trust comes first. Without it, statistics rarely land.",
      feedbackWrong: "Trust must come first. Everything else rests on that foundation."
    }
  },
  {
    module: "Module 2 · Appointment Mastery",
    title: "Motivation Changes Everything",
    subtitle: "Discover the seller's real need",
    excerpt: "The conversation sharpens when you know what is actually at stake.",
    content: [
      "A move-up seller, an estate seller, a relocation seller, and an exhausted would-be FSBO do not need the same conversation.",
      "Motivation determines urgency, flexibility, and emotional temperature. Without it, your presentation is generic.",
      "Ask direct questions with calm curiosity and listen for consequence, not just facts."
    ],
    script: [
      "Why are you selling now?",
      "Where do you need to be next?",
      "What kind of timeline matters most here?",
      "What happens if the home does not sell when you need it to?"
    ],
    quiz: {
      q: "Which question most often reveals true urgency?",
      options: [
        "How long have you lived here?",
        "What happens if the home does not sell when you need it to?",
        "Did you interview anyone else?",
        "Do you want an open house?"
      ],
      answer: 1,
      feedbackCorrect: "Exactly. Consequence reveals urgency better than surface facts.",
      feedbackWrong: "The consequence question reveals what is really at stake, which is why it is so powerful."
    }
  },
  {
    module: "Module 3 · Presentation Flow",
    title: "The Allen Principal Presentation",
    subtitle: "A cleaner way to lead the appointment",
    excerpt: "The best presentation feels less like a pitch and more like guided clarity.",
    content: [
      "Use a consistent flow: rapport, property review, motivation, strategy, proof, next steps.",
      "Your job is to reduce noise. A strong listing presentation removes confusion and makes the path obvious.",
      "Do not dump information. Build a sequence that earns the right to move forward."
    ],
    framework: [
      ["1. Rapport", "Calm the room and establish tone."],
      ["2. Review", "Walk the home and gather facts."],
      ["3. Motivation", "Clarify the seller's real objective."],
      ["4. Strategy", "Connect price, timing, and exposure."],
      ["5. Proof", "Use examples, process, and competence."],
      ["6. Next Step", "Guide the seller into a decision path."]
    ],
    quiz: {
      q: "Which description best fits the Allen Principal presentation style?",
      options: [
        "High-pressure and fast-paced",
        "Data-heavy and detached",
        "Structured, calm, and seller-centered",
        "Loose and improvisational"
      ],
      answer: 2,
      feedbackCorrect: "Yes. Structured, calm, and seller-centered is the right tone.",
      feedbackWrong: "The Allen Principal presentation is structured, calm, and seller-centered — not loose or aggressive."
    }
  },
  {
    module: "Module 3 · Presentation Flow",
    title: "Language That Leads",
    subtitle: "Questions and framing that move the seller forward",
    excerpt: "The right language reduces friction. The wrong language creates it.",
    content: [
      "Use agreement-building questions throughout the conversation. Keep the seller participating.",
      "Replace blunt yes/no questions with guided choices whenever possible.",
      "Your wording should feel natural, confident, and unforced."
    ],
    script: [
      "If we can create the strongest first impression in the market, that gives you the best chance to move on your timeline, doesn't it?",
      "Would you prefer to launch this week or next week?",
      "Would a more private showing process or a broader first-week push fit you better?"
    ],
    quiz: {
      q: "Why are guided-choice questions so effective?",
      options: [
        "They pressure the seller",
        "They shift the conversation from whether to move forward to how to move forward",
        "They make the appointment longer",
        "They avoid all objections"
      ],
      answer: 1,
      feedbackCorrect: "Correct. They move the seller from resistance to participation.",
      feedbackWrong: "Guided-choice questions work because they move the conversation toward how, not whether."
    }
  },
  {
    module: "Module 4 · Closing & Commitment",
    title: "Closing Without Pressure",
    subtitle: "The decision should feel earned, not forced",
    excerpt: "Closing begins early, but pressure is never the point.",
    content: [
      "A strong close is simply the natural end of a well-led conversation.",
      "If the seller stalls, do not retreat blindly and do not push emotionally. Diagnose the hesitation.",
      "Use summary questions, story-based reassurance, and clear next-step choices to help the seller move with confidence."
    ],
    framework: [
      ["Summary Close", "Which part would you like to revisit — pricing, timing, exposure, or process?"],
      ["Story Close", "Share a similar seller situation and how it resolved."],
      ["Choice Close", "Would you rather begin with this timeline or that one?"],
      ["Process Close", "Let's put the plan in motion so nothing slips."]
    ],
    quiz: {
      q: "A seller says, 'We want to think about it.' What is the best next move?",
      options: [
        "Leave immediately",
        "Push harder for a signature",
        "Ask which part they want to revisit",
        "Offer a fee cut"
      ],
      answer: 2,
      feedbackCorrect: "Exactly. Clarify the hesitation so you can serve the real concern.",
      feedbackWrong: "The best move is to clarify the hesitation by asking what they want to revisit."
    }
  },
  {
    module: "Module 5 · Field Use",
    title: "The One-Page Field Blueprint",
    subtitle: "A practical tool for real appointments",
    excerpt: "What matters is what the agent can carry into the field.",
    content: [
      "The final framework is simple enough to remember and strong enough to use under pressure.",
      "Before each appointment, review the standard. During each appointment, follow the flow. After each appointment, evaluate your execution honestly.",
      "This is not about performance. It is about presence with direction."
    ],
    framework: [
      ["Prepare", "Know the market, property, and likely motivations."],
      ["Build Trust", "Lead with order, sincerity, and confidence."],
      ["Find Motive", "Uncover what truly matters now."],
      ["Align Strategy", "Show how your process fits their goal."],
      ["Guide Decision", "Help them move forward with clarity."],
      ["Review", "Afterward, ask what you did well and where you drifted."]
    ],
    quiz: {
      q: "What is the most practical use of this final blueprint?",
      options: [
        "A memorized monologue",
        "A checklist for preparing, leading, and reviewing appointments",
        "A replacement for market knowledge",
        "A script for open houses only"
      ],
      answer: 1,
      feedbackCorrect: "Exactly. It is a field checklist — not a performance script.",
      feedbackWrong: "This blueprint is best used as a checklist for preparing, leading, and reviewing appointments."
    }
  }
];

function AllenPrincipalCourse() {
  const downloadBlueprintPdf = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    const left = 54;
    let y = 56;

    pdf.setFillColor(10, 9, 7);
    pdf.rect(0, 0, 612, 792, 'F');

    pdf.setTextColor(212, 168, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('ALLEN PRINCIPAL', left, y);

    y += 24;
    pdf.setTextColor(245, 240, 232);
    pdf.setFontSize(28);
    pdf.text('Listing Blueprint', left, y);

    y += 26;
    pdf.setTextColor(200, 191, 170);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const intro = 'Purposeful Pace. Relentless Direction. Total Presence. Use this blueprint before, during, and after listing appointments to create clarity, trust, and decisive next steps.';
    const introLines = pdf.splitTextToSize(intro, 500);
    pdf.text(introLines, left, y);
    y += introLines.length * 15 + 18;

    pdf.setDrawColor(138, 110, 42);
    pdf.line(left, y, 558, y);
    y += 24;

    pdf.setTextColor(212, 168, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('The Standard', left, y);
    y += 18;

    pdf.setTextColor(200, 191, 170);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const standard = 'Listings are not won by pressure. They are won by preparation, structure, presence, and service. The goal is not to overpower the appointment. The goal is to steady it.';
    const standardLines = pdf.splitTextToSize(standard, 500);
    pdf.text(standardLines, left, y);
    y += standardLines.length * 15 + 24;

    pdf.setTextColor(212, 168, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Field Framework', left, y);
    y += 22;

    pdf.setTextColor(240, 232, 208);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    blueprintItems.forEach((item) => {
      const lines = pdf.splitTextToSize(item, 482);
      pdf.text('•', left, y);
      pdf.text(lines, left + 14, y);
      y += lines.length * 15 + 10;
    });

    y += 8;
    pdf.setTextColor(212, 168, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Three Allen Principal Reminders', left, y);
    y += 22;

    const reminders = [
      'Slow the room down enough for trust to form.',
      'Lead the conversation toward the seller’s goal, not your performance.',
      'When hesitation appears, clarify it. Do not avoid it and do not force it.'
    ];

    pdf.setTextColor(200, 191, 170);
    pdf.setFont('helvetica', 'normal');
    reminders.forEach((item) => {
      const lines = pdf.splitTextToSize(item, 482);
      pdf.text('•', left, y);
      pdf.text(lines, left + 14, y);
      y += lines.length * 15 + 10;
    });

    pdf.setFontSize(9);
    pdf.setTextColor(107, 96, 80);
    pdf.text('Allen Principal Listing Mastery', left, 756);
    pdf.text('Prepared as a field reference for listing appointments', 330, 756);

    pdf.save('allen-principal-listing-blueprint.pdf');
  };

  const downloadWorksheetPdf = () => {
    const pdf = new jsPDF({ unit: 'pt', format: 'letter' });
    const left = 54;
    let y = 56;

    pdf.setFillColor(10, 9, 7);
    pdf.rect(0, 0, 612, 792, 'F');

    pdf.setTextColor(212, 168, 67);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text('ALLEN PRINCIPAL', left, y);

    y += 24;
    pdf.setTextColor(245, 240, 232);
    pdf.setFontSize(28);
    pdf.text('Field Worksheet', left, y);

    y += 24;
    pdf.setTextColor(200, 191, 170);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    const sub = 'Use before and after each listing appointment. Write by hand or type into the PDF after download.';
    const subLines = pdf.splitTextToSize(sub, 500);
    pdf.text(subLines, left, y);
    y += subLines.length * 15 + 16;

    worksheetPrompts.forEach((prompt, idx) => {
      if (y > 690) {
        pdf.addPage('letter', 'portrait');
        pdf.setFillColor(10, 9, 7);
        pdf.rect(0, 0, 612, 792, 'F');
        y = 56;
      }

      pdf.setTextColor(212, 168, 67);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      const promptLines = pdf.splitTextToSize(`${idx + 1}. ${prompt}`, 500);
      pdf.text(promptLines, left, y);
      y += promptLines.length * 15 + 8;

      pdf.setDrawColor(46, 40, 32);
      for (let i = 0; i < 3; i++) {
        pdf.line(left, y, 558, y);
        y += 24;
      }
      y += 10;
    });

    pdf.setFontSize(9);
    pdf.setTextColor(107, 96, 80);
    pdf.text('Allen Principal Listing Mastery', left, 756);
    pdf.text('Field Worksheet', 500, 756);

    pdf.save('allen-principal-field-worksheet.pdf');
  };

  
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showCompletion, setShowCompletion] = useState(false);

  const lesson = lessons[current];
  const isAnswered = answers[current] !== undefined;
  const progress = useMemo(() => Math.round((completed.length / lessons.length) * 100), [completed]);

  const chooseAnswer = (index) => {
    if (answers[current] !== undefined) return;
    const correct = index === lesson.quiz.answer;
    setAnswers((prev) => ({ ...prev, [current]: index }));
    if (!completed.includes(current)) setCompleted((prev) => [...prev, current]);
    if (correct) setScore((s) => s + 100);
  };

  const goNext = () => {
    if (!isAnswered) return;
    if (current === lessons.length - 1) {
      setShowCompletion(true);
      return;
    }
    setCurrent((c) => c + 1);
  };

  const goPrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const restart = () => {
    setCurrent(0);
    setScore(0);
    setCompleted([]);
    setAnswers({});
    setShowCompletion(false);
  };

  const renderFeedback = () => {
    const selected = answers[current];
    if (selected === undefined) return null;
    const correct = selected === lesson.quiz.answer;
    return (
      <div className={`mt-4 rounded-2xl border p-4 text-sm leading-6 ${correct ? 'border-emerald-700 bg-emerald-950/40 text-emerald-200' : 'border-red-900 bg-red-950/40 text-red-200'}`}>
        {correct ? lesson.quiz.feedbackCorrect : lesson.quiz.feedbackWrong}
      </div>
    );
  };

  if (showCompletion) {
    return (
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr] ap-shell">
        <Sidebar current={current} completed={completed} progress={100} score={score} locked={false} />
        <main className="flex min-h-screen items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-3xl rounded-[28px] border-stone-800 bg-stone-950/80 shadow-2xl">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-700/50 bg-amber-500/10 text-amber-400">
                <Award className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <p className="ap-mono text-xs uppercase tracking-[0.25em] text-amber-700">Allen Principal</p>
                <h1 className="ap-display text-5xl tracking-[0.04em] text-stone-100 md:text-7xl">Listing Mastery Complete</h1>
                <p className="ap-bask mx-auto max-w-2xl text-base leading-8 text-stone-300">
                  Preparation. Structure. Presence. Service. That is the standard. The goal is not to sound impressive. The goal is to become steady enough that trust follows you into every appointment.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Points Earned" value={String(score)} icon={<Star className="h-5 w-5" />} />
                <MetricCard label="Lessons Completed" value={`${completed.length}/${lessons.length}`} icon={<CheckCircle2 className="h-5 w-5" />} />
                <MetricCard label="Field Standard" value="Ready" icon={<Target className="h-5 w-5" />} />
              </div>

              <Card className="rounded-3xl border-amber-800/40 bg-stone-900 text-left">
                <CardHeader>
                  <CardTitle className="ap-display text-3xl tracking-[0.05em] text-amber-400">Downloadable Field Blueprint</CardTitle>
                  <CardDescription className="text-stone-400">Use this as the one-page standard before and after listing appointments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-stone-300">
                  <div className="grid gap-3 md:grid-cols-2">
                    {blueprintItems.map((item) => (
                      <div key={item} className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3">{item}</div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button onClick={downloadBlueprintPdf} className="rounded-2xl bg-amber-500 text-stone-950 hover:bg-amber-400"><Download className="mr-2 h-4 w-4" />Download PDF Blueprint</Button>
                    <Button variant="outline" className="rounded-2xl border-stone-700 bg-transparent text-stone-200 hover:bg-stone-900" onClick={restart}>Restart Course</Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[300px_1fr] ap-shell">
      <Sidebar current={current} completed={completed} progress={progress} score={score} locked />

      <main className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-stone-800 bg-stone-950/90 px-5 py-4 backdrop-blur lg:px-10">
          <div>
            <p className="ap-mono text-[11px] uppercase tracking-[0.2em] text-stone-500">{lesson.module}</p>
            <h2 className="ap-display text-2xl tracking-[0.05em] text-stone-100 md:text-3xl">{lesson.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-full border-amber-700/40 bg-amber-500/10 px-3 py-1 ap-mono text-[11px] uppercase tracking-[0.15em] text-amber-400">{score} pts</Badge>
          </div>
        </header>

        <section className="mx-auto w-full max-w-5xl flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <Card className="rounded-[28px] border-stone-800 bg-stone-950/70 shadow-2xl">
              <CardContent className="p-7 md:p-10">
                <div className="space-y-4">
                  <p className="ap-mono text-xs uppercase tracking-[0.25em] text-amber-700">Allen Principal Course</p>
                  <h1 className="ap-display text-5xl leading-none tracking-[0.04em] text-stone-100 md:text-7xl">{lesson.title}</h1>
                  <p className="ap-bask text-base italic leading-8 text-stone-300 md:text-lg">{lesson.subtitle}</p>
                </div>

                <Separator className="my-7 bg-stone-800" />

                <blockquote className="rounded-[24px] border border-amber-800/40 bg-amber-500/5 p-5 ap-bask text-lg italic leading-8 text-stone-100">
                  {lesson.excerpt}
                </blockquote>

                <div className="mt-8 space-y-5">
                  {lesson.content?.map((paragraph) => (
                    <p key={paragraph} className="ap-bask text-[15px] leading-8 text-stone-300">{paragraph}</p>
                  ))}
                </div>

                {lesson.stats && (
                  <div className="mt-8 space-y-4 rounded-[24px] border border-stone-800 bg-stone-900/70 p-5">
                    <p className="ap-mono text-xs uppercase tracking-[0.2em] text-amber-700">Professional Allocation</p>
                    {lesson.stats.map((s) => (
                      <StatRow key={s.label} pct={s.pct} label={s.label} />
                    ))}
                  </div>
                )}

                {lesson.stats2 && (
                  <div className="mt-6 space-y-4 rounded-[24px] border border-stone-800 bg-stone-900/70 p-5">
                    <p className="ap-mono text-xs uppercase tracking-[0.2em] text-amber-700">Income Allocation</p>
                    {lesson.stats2.map((s) => (
                      <StatRow key={s.label} pct={s.pct} label={s.label} />
                    ))}
                  </div>
                )}

                {lesson.framework && (
                  <div className="mt-8 grid gap-3">
                    {lesson.framework.map(([title, desc]) => (
                      <div key={title} className="rounded-[22px] border border-stone-800 bg-stone-900/70 p-4">
                        <div className="ap-mono text-xs uppercase tracking-[0.18em] text-amber-500">{title}</div>
                        <div className="mt-2 text-sm leading-7 text-stone-300">{desc}</div>
                      </div>
                    ))}
                  </div>
                )}

                {lesson.script && (
                  <div className="mt-8 rounded-[24px] border border-stone-800 bg-black/30 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="ap-mono text-xs uppercase tracking-[0.2em] text-amber-700">Field Language</p>
                      <Badge variant="outline" className="border-stone-700 bg-stone-900 text-emerald-300">Use naturally</Badge>
                    </div>
                    <div className="space-y-3">
                      {lesson.script.map((line) => (
                        <div key={line} className="rounded-2xl border border-stone-800 bg-stone-950 px-4 py-3 ap-mono text-sm leading-7 text-emerald-300">{line}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-[28px] border-stone-800 bg-stone-950/70">
                <CardHeader>
                  <CardTitle className="ap-display text-3xl tracking-[0.05em] text-amber-400">Knowledge Check</CardTitle>
                  <CardDescription className="text-stone-400">Complete this lesson to unlock the next one.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="ap-bask text-base leading-8 text-stone-100">{lesson.quiz.q}</p>
                  <div className="mt-5 space-y-3">
                    {lesson.quiz.options.map((option, idx) => {
                      const selected = answers[current] === idx;
                      const answered = answers[current] !== undefined;
                      const correct = lesson.quiz.answer === idx;
                      let classes = 'border-stone-800 bg-stone-900/70 text-stone-200 hover:bg-stone-900';
                      if (answered && selected && correct) classes = 'border-emerald-700 bg-emerald-950/40 text-emerald-200';
                      if (answered && selected && !correct) classes = 'border-red-900 bg-red-950/40 text-red-200';
                      if (answered && !selected && correct) classes = 'border-emerald-700 bg-emerald-950/20 text-emerald-200';
                      return (
                        <button
                          key={option}
                          onClick={() => chooseAnswer(idx)}
                          disabled={answered}
                          className={`w-full rounded-2xl border px-4 py-4 text-left text-sm leading-6 transition ${classes}`}
                        >
                          <span className="ap-mono mr-3 inline-block text-xs uppercase tracking-[0.18em] text-amber-500">{String.fromCharCode(65 + idx)}</span>
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {renderFeedback()}
                  {!isAnswered && (
                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/70 px-4 py-3 text-sm text-stone-400">
                      <Lock className="h-4 w-4" /> Next lesson unlocks after quiz completion.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-stone-800 bg-stone-950/70">
                <CardHeader>
                  <CardTitle className="ap-display text-3xl tracking-[0.05em] text-amber-400">Field Worksheet</CardTitle>
                  <CardDescription className="text-stone-400">Practical prompts for real appointments.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-stone-300">
                  {worksheetPrompts.map((q) => (
                    <div key={q} className="rounded-2xl border border-stone-800 bg-stone-900/70 px-4 py-3">{q}</div>
                  ))}
                  <Button onClick={downloadWorksheetPdf} variant="outline" className="mt-2 w-full rounded-2xl border-stone-700 bg-transparent text-stone-200 hover:bg-stone-900">
                    <Download className="mr-2 h-4 w-4" /> Download Worksheet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <footer className="sticky bottom-0 flex items-center justify-between border-t border-stone-800 bg-stone-950/95 px-5 py-4 backdrop-blur lg:px-10">
          <Button variant="outline" onClick={goPrev} disabled={current === 0} className="rounded-2xl border-stone-700 bg-transparent text-stone-200 hover:bg-stone-900 disabled:opacity-40">
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="ap-mono text-xs uppercase tracking-[0.2em] text-stone-500">{current + 1} / {lessons.length}</div>
          <Button onClick={goNext} disabled={!isAnswered} className="rounded-2xl bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:bg-stone-800 disabled:text-stone-500">
            {current === lessons.length - 1 ? 'Finish Course' : 'Next Lesson'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </footer>
      </main>
    </div>
  );
}

function Sidebar({ current, completed, progress, score, locked }) {
  let lastModule = '';
  return (
    <aside className="border-r border-stone-800 bg-stone-950/90 p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-auto">
      <div className="space-y-5">
        <div>
          <p className="ap-mono text-[11px] uppercase tracking-[0.25em] text-amber-700">Condensed Blueprint Course</p>
          <h1 className="ap-display mt-2 text-5xl leading-none tracking-[0.05em] text-stone-100">Allen Principal<span className="text-amber-400"> Listing</span> Mastery</h1>
          <p className="mt-3 ap-bask text-sm leading-7 text-stone-400">A seller-centered course for winning listings through preparation, structure, and total presence.</p>
        </div>

        <Card className="rounded-[24px] border-stone-800 bg-stone-900/80">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between ap-mono text-xs uppercase tracking-[0.18em] text-stone-500">
              <span>Progress</span>
              <span className="text-amber-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-stone-800" />
            <div className="flex items-center justify-between ap-mono text-xs uppercase tracking-[0.18em] text-stone-500">
              <span>Score</span>
              <span className="text-amber-400">{score} pts</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {lessons.map((lesson, idx) => {
            const showModule = lesson.module !== lastModule;
            lastModule = lesson.module;
            const done = completed.includes(idx);
            const active = idx === current;
            return (
              <div key={lesson.title} className="space-y-2">
                {showModule && <div className="ap-mono pt-3 text-[11px] uppercase tracking-[0.2em] text-stone-600">{lesson.module}</div>}
                <div className={`rounded-[22px] border p-4 transition ${active ? 'border-amber-700/40 bg-stone-900' : 'border-stone-800 bg-stone-950'} ${done ? 'shadow-[0_0_0_1px_rgba(212,168,67,0.08)]' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border ${done ? 'border-amber-500 bg-amber-500 text-stone-950' : active ? 'border-amber-500 text-amber-400' : 'border-stone-700 text-stone-500'}`}>
                      {done ? <CheckCircle2 className="h-4 w-4" /> : <span className="ap-mono text-xs">{idx + 1}</span>}
                    </div>
                    <div className="min-w-0">
                      <div className={`text-sm leading-6 ${active ? 'text-stone-100' : 'text-stone-300'}`}>{lesson.title}</div>
                      <div className="mt-1 text-xs leading-5 text-stone-500">{lesson.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {locked && (
          <div className="flex items-center gap-2 rounded-2xl border border-stone-800 bg-stone-900/70 px-4 py-3 text-sm text-stone-400">
            <PlayCircle className="h-4 w-4 text-amber-400" /> Quiz completion unlocks progression.
          </div>
        )}
      </div>
    </aside>
  );
}

function StatRow({ pct, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className="ap-display min-w-[56px] text-3xl leading-none text-amber-400">{pct}%</div>
      <div className="w-full space-y-2">
        <div className="h-8 overflow-hidden rounded-xl border border-stone-800 bg-stone-950">
          <div className="flex h-full items-center bg-gradient-to-r from-amber-900/40 to-amber-600/40 px-3 text-xs text-stone-100" style={{ width: `${pct}%` }}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon }) {
  return (
    <div className="rounded-[24px] border border-stone-800 bg-stone-900 p-5 text-left">
      <div className="mb-3 flex items-center gap-2 text-amber-400">{icon}</div>
      <div className="ap-display text-4xl leading-none tracking-[0.04em] text-stone-100">{value}</div>
      <div className="mt-2 ap-mono text-xs uppercase tracking-[0.18em] text-stone-500">{label}</div>
    </div>
  );
}
