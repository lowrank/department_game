// DepartmentChairGame.jsx
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
// Lazy-load charts to improve initial load
import { Suspense } from 'react';
const BudgetChart = React.lazy(() =>
  import('./ChartsSection.jsx').then((m) => ({ default: m.BudgetChart }))
);
const MetricsChart = React.lazy(() =>
  import('./ChartsSection.jsx').then((m) => ({ default: m.MetricsChart }))
);
const PromotionRadar = React.lazy(() =>
  import('./ChartsSection.jsx').then((m) => ({ default: m.PromotionRadar }))
);

const scenarios = [
  { question: 'Faculty request funding for new research equipment.', choices: [
    { text: 'Approve full funding (-$5,000)', effects: { budget: -5000, morale: 10, research: 10 } },
    { text: 'Approve partial funding (-$2,000)', effects: { budget: -2000, morale: 5, research: 5 } },
    { text: 'Reject request', effects: { morale: -10, research: -5 } }
  ]},
  { question: 'A Ph.D. student asks for department support for AMS conference.', choices: [
    { text: 'Sponsor event (-$1,000)', effects: { budget: -1000, reputation: 5 } },
    { text: 'Offer logistical help only', effects: { reputation: 2, morale: -3 } },
    { text: 'Decline politely', effects: { reputation: -5, morale: -5 } }
  ]},
  { question: 'A teaching faculty member is underperforming in teaching evaluations.', choices: [
    { text: 'Offer mentoring and resources (-$1000)', effects: { budget: -1000, morale: 5 } },
    { text: 'Issue warning', effects: { morale: -5, reputation: 3 } },
    { text: 'Ignore it', effects: { reputation: -5 } }
  ]},
  { question: 'A major NSF grant opportunity arises.', choices: [
    { text: 'Encourage faculty to apply', effects: { reputation: 5, research: 5, fundingChance: 0.2 } },
    { text: 'Apply as department (-$3,000)', effects: { budget: -3000, reputation: 10, research: 10, fundingChance: 0.3 } },
    { text: 'Ignore it', effects: { reputation: -5, morale: -5, fundingChance: 0 } }
  ]},
  { question: 'A scandal of the department hits the university press.', choices: [
    { text: 'Issue public statement (-$2000)', effects: { reputation: 5, budget: -2000 } },
    { text: 'Stay silent', effects: { reputation: -10, morale: -5 } },
    { text: 'Privately reassure staff (-$500)', effects: { morale: 5, budget: -500 } }
  ]},
  { question: 'A top faculty member gets an offer from one of the ivy league universities.', choices: [
    { text: 'Counteroffer (-$5,000)', effects: { budget: -5000, morale: 5, research: 2 } },
    { text: 'Let them go', effects: { reputation: -15, research: -15, morale: -10 } },
    { text: 'Negotiate shared appointment (-$2,000)', effects: { budget: -2000, reputation: 2, research: -5 } }
  ]},
  { question: 'The dean announced an ambitious plan.', choices: [
    { text: 'Support enthusiastically (-$2000)', effects: { reputation: 5, budget: -2000 } },
    { text: 'Cautiously cooperate', effects: { morale: 2 } },
    { text: 'Resist', effects: { reputation: -5 } }
  ]},
  { question: 'Student satisfaction survey results are poor.', choices: [
    { text: 'Host open forum (-$5000)', effects: { budget: -5000, morale: 5 } },
    { text: 'Blame faculty', effects: { morale: -10 } },
    { text: 'Ignore results', effects: { reputation: -15, morale: -5 } }
  ]},
  { question: 'Research confidence boosts grant interest.', choices: [
    { text: 'Submit proposals', effects: { research: 5, budget: 2500, fundingChance: 0.2 } },
    { text: 'Collaborate with another department', effects: { reputation: 5, research: 5, fundingChance: 0.3 } },
    { text: 'Do nothing', effects: { research: -5, morale: -5, fundingChance: 0 } }
  ]},
  { question: 'Department hosts a popular seminar series.', choices: [
    { text: 'Invest in speakers (-$5,000)', effects: { budget: -5000, morale: 5, reputation: 5, research: 5 } },
    { text: 'Host modestly (-$1,000)', effects: { budget: -1000, reputation: 2 } },
    { text: 'Cancel it', effects: {reputation: -5, morale: -5} }
  ]},
  { question: 'A master student project wins a national competition.', choices: [
    { text: 'Celebrate publicly (-$1,000)', effects: { budget: -1000, morale: 5, reputation: 5 } },
    { text: 'Send internal email', effects: { morale: 2, reputation: -2 } },
    { text: 'Ignore', effects: { reputation: -5 } }
  ]},
  { question: 'Alumni offer support for the department.', choices: [
    { text: 'Accept funds ($3000)', effects: { budget: 3000, reputation: 3 } },
    { text: 'Politely decline', effects: { reputation: 1 } },
    { text: 'Ignore', effects: { reputation: -2 } }
  ]},
  { question: 'A philanthropist wants to endow a new research project in AI, it takes time and resources to develop.', choices: [
    { text: 'Accept endowment ($10000)', effects: { budget: 10000, research: -5, morale: -5 } },
    { text: 'Negotiate terms', effects: { budget: 5000, research: -2, reputation: 2, morale: -2 } },
    { text: 'Decline', effects: { reputation: -5, morale: -5 } }
  ]},
  { question: 'A faculty member reports an unexpected major research breakthrough.', choices: [
    { text: 'Publish immediately in open access journal (-$5000)', effects: { budget: -5000, research: 15, reputation: 10 } },
    { text: 'Apply patent (-$3000)', effects: { budget: -3000, research: 10, reputation: 10 } },
    { text: 'Keep internal', effects: { morale: -5, research: 10, reputation: 2 } }
  ]},
  { question: 'Media spotlight on faculty controversy.', choices: [
    { text: 'Issue press statement (-$5000)', effects: { reputation: 5, budget: -5000 } },
    { text: 'Ignore', effects: { reputation: -10, morale: -5 } },
    { text: 'Internal meeting (-$1000)', effects: { reputation: 3, morale: 3, budget: -1000 } }
  ]}
];

function generateFacultyProfile() {
  return {
    funding: Math.floor(10 + Math.random() * 91),
    research: Math.floor(10 + Math.random() * 91),
    teaching: Math.floor(10 + Math.random() * 91),
    mentoring: Math.floor(10 + Math.random() * 91),
    service: Math.floor(10 + Math.random() * 91),
    reputation: Math.floor(10 + Math.random() * 91)
  };
}

// Derive a specific Game Over message based on which threshold is hit
function getGameOverMessage(s) {
  if (s.budget <= 0) {
    return 'The department ran out of funds. The dean wants you to resign.';
  }
  if (s.morale <= 20) {
    return 'Faculty morale collapsed. A vote of no confidence ends your term.';
  }
  if (s.reputation <= 10) {
    return 'Department reputation is ruined. The department decides to hire a new chair.';
  }
  return null;
}

export default function DepartmentChairGame() {
  const [round, setRound] = useState(1);
  const [year, setYear] = useState(1);
  const [stats, setStats] = useState({ budget: 20000, morale: 50, reputation: 50, research: 40 });
  const [scenarioIndex, setScenarioIndex] = useState(Math.floor(Math.random() * scenarios.length));
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [specialEvent, setSpecialEvent] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [started, setStarted] = useState(false);

  const handleChoice = (effects) => {
    let newStats = {
      budget: stats.budget + (effects.budget || 0),
      morale: stats.morale + (effects.morale || 0),
      reputation: stats.reputation + (effects.reputation || 0),
      research: stats.research + (effects.research || 0),
    };

    if (effects.fundingChance && Math.random() < effects.fundingChance) newStats.budget += 2000;

    const newHistory = [...history, { round: (year - 1) * 12 + round, ...newStats }];
    setHistory(newHistory);

    if (round === 12) {
      setCurrentProfile(generateFacultyProfile());
      setSpecialEvent('promotion');
      setStats(newStats);
      return;
    }

    // Check for specific game over conditions
    const overMsg = getGameOverMessage(newStats);
    if (overMsg) {
      setStats(newStats);
      setGameOver(overMsg);
      return;
    }

    if (round >= 12 && year >= 5) {
      setGameOver('You successfully completed 5 years as Chair!');
      return;
    }

    setRound(round + 1 > 12 ? 1 : round + 1);
    setYear(round + 1 > 12 ? year + 1 : year);
    setStats(newStats);
    setScenarioIndex(Math.floor(Math.random() * scenarios.length));
  };

  const handlePromotionDecision = (promote) => {
    let newStats = { ...stats };
    let message = '';
    const success = promote;

    if (success) {
      const avgScore = (currentProfile.funding + currentProfile.research + currentProfile.teaching + currentProfile.mentoring + currentProfile.service + currentProfile.reputation)/6;
      if (avgScore < 50) {
        newStats.morale -= 25;
        newStats.research -= 25;
        newStats.reputation -= 25;
        message = '⚠️ Weak faculty granted tenure! Department suffers significant decline.';
      } else {
        newStats.morale += 10;
        newStats.reputation += 5;
        newStats.research += 5;
        message = '🎓 Promotion successful! Strong faculty member promoted.';
      }
    } else {
      newStats.morale -= 10;
      newStats.reputation -= 5;
      newStats.research -= 5;
      message = '⚠️ Promotion denied. Faculty morale decreases.';
    }

    // Check for specific game over conditions after the promotion decision
    const overMsg = getGameOverMessage(newStats);
    if (overMsg) {
      setStats(newStats);
      setGameOver(overMsg);
      return;
    }

    if (year >= 5) {
      setStats(newStats);
      setGameOver('You successfully completed 5 years term as a chair!');
      return;
    }

    setStats(newStats);
    setSpecialEvent({ message });
    setCurrentProfile(null);
  };

  const proceedAfterYearEnd = () => {
    setSpecialEvent(null);
    setRound(1);
    setYear(year + 1);
    setScenarioIndex(Math.floor(Math.random() * scenarios.length));
  };

  if (specialEvent && specialEvent.message) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="p-6 w-[600px] text-center">
        <CardHeader><CardTitle>Year {year} Complete</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4 text-lg">{specialEvent.message}</p>
          <div className="mb-4">
            <p>💰 Budget: ${stats.budget}</p>
            <p>😊 Morale: {stats.morale}</p>
            <p>🏛️ Reputation: {stats.reputation}</p>
            <p>🔬 Research Confidence: {stats.research}</p>
          </div>
          <Button onClick={proceedAfterYearEnd}>Continue to Year {year + 1}</Button>
        </CardContent>
      </Card>
    </div>
  );

  const restartGame = () => {
    setRound(1);
    setYear(1);
    setStats({ budget: 20000, morale: 50, reputation: 50, research: 40 });
    setHistory([]);
    setGameOver(false);
    setSpecialEvent(null);
    setScenarioIndex(Math.floor(Math.random() * scenarios.length));
    setStarted(false);
  };

  // Intro screen shown before the first turn starts
  if (!started) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="p-6 w-[700px] text-center">
        <CardHeader>
          <CardTitle>Game: Good Chair of Math Department</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg">
            Congratulations! You just won the vote and have been appointed the Chair of Math Department for the next 5 years.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Each month, make decisions that balance your budget, faculty morale, reputation, and research confidence.
            Survive the full term to succeed.
          </p>
          <Button
            onClick={() => {
              setHistory([
                {
                  round: (year - 1) * 12 + round,
                  budget: stats.budget,
                  morale: stats.morale,
                  reputation: stats.reputation,
                  research: stats.research,
                },
              ]);
              setStarted(true);
            }}
          >
            Begin Year 1
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  if (gameOver) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="p-6 w-[600px] text-center">
        <CardHeader><CardTitle>Game Over</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">{gameOver}</p>
          <ul>
            <li>Budget: ${stats.budget}</li>
            <li>Morale: {stats.morale}</li>
            <li>Reputation: {stats.reputation}</li>
            <li>Research Confidence: {stats.research}</li>
          </ul>
          <Button className="mt-4" onClick={restartGame}>Restart</Button>
        </CardContent>
      </Card>
    </div>
  );

  if (specialEvent === 'promotion' && currentProfile) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="p-6 w-[600px] text-center">
        <CardHeader><CardTitle>Promotion & Tenure Review</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-4">Review the faculty profile:</p>
          <Suspense fallback={<div className="text-sm text-gray-500">Loading radar...</div>}>
            <PromotionRadar profile={currentProfile} />
          </Suspense>
          <div className="mt-4 space-x-4">
            <Button onClick={() => handlePromotionDecision(true)}>Promote</Button>
            <Button onClick={() => handlePromotionDecision(false)}>Deny</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const scenario = scenarios[scenarioIndex];

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="p-6 w-[600px] shadow-xl mb-6">
        <CardHeader><CardTitle>Year {year}, Month {round}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-lg font-medium mb-4">{scenario.question}</p>
          <div className="space-y-3">
            {scenario.choices.map((choice, index) => (
              <Button key={index} variant="outline" className="w-full" onClick={() => handleChoice(choice.effects)}>{choice.text}</Button>
            ))}
          </div>
          <div className="mt-6 border-t pt-4 text-sm text-gray-600">
            <p>💰 Budget: ${stats.budget}</p>
            <p>😊 Morale: {stats.morale}</p>
            <p>🏛️ Reputation: {stats.reputation}</p>
            <p>🔬 Research Confidence: {stats.research}</p>
          </div>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Suspense fallback={<div className="text-sm text-gray-500">Loading charts...</div>}>
          <div className="flex gap-6 w-full max-w-[1600px]">
            <Card className="p-6 flex-1 shadow-md">
              <CardHeader><CardTitle>Budget Progress</CardTitle></CardHeader>
              <CardContent>
                <BudgetChart history={history} />
              </CardContent>
            </Card>
            <Card className="p-6 flex-1 shadow-md">
              <CardHeader><CardTitle>Department Metrics</CardTitle></CardHeader>
              <CardContent>
                <MetricsChart history={history} />
              </CardContent>
            </Card>
          </div>
        </Suspense>
      )}
    </motion.div>
  );
}
