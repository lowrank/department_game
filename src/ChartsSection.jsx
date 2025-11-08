import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

export function BudgetChart({ history }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={history}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="round" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Budget ($)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="budget" stroke="#2563eb" strokeWidth={2} name="Budget" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MetricsChart({ history }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={history}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="round" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
        <YAxis label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="morale" stroke="#16a34a" strokeWidth={2} name="Morale" />
        <Line type="monotone" dataKey="reputation" stroke="#f59e0b" strokeWidth={2} name="Reputation" />
        <Line type="monotone" dataKey="research" stroke="#9333ea" strokeWidth={2} name="Research" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function PromotionRadar({ profile }) {
  const data = useMemo(() => ([
    { subject: 'Funding', A: profile.funding },
    { subject: 'Research', A: profile.research },
    { subject: 'Teaching', A: profile.teaching },
    { subject: 'Mentoring', A: profile.mentoring },
    { subject: 'Service', A: profile.service },
    { subject: 'Reputation', A: profile.reputation }
  ]), [profile]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
