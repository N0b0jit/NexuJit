'use client';

import { useState } from 'react';

export default function LifeExpectancyCalculator() {
    const [birthYear, setBirthYear] = useState('');
    const [lifeExpectancy, setLifeExpectancy] = useState<number | null>(null);

    const calculate = () => {
        const year = parseInt(birthYear, 10);
        if (!isNaN(year) && year > 1900 && year < new Date().getFullYear()) {
            // Simple global average life expectancy ~ 72 years
            const expectancy = 72 - (new Date().getFullYear() - year);
            setLifeExpectancy(expectancy > 0 ? expectancy : 0);
        } else {
            setLifeExpectancy(null);
        }
    };

    return (
        <div className="tool-card">
            <h2 className="tool-title">Life Expectancy Calculator</h2>
            <p>Enter your birth year to estimate remaining years based on a global average of 72 years.</p>
            <input
                type="number"
                placeholder="e.g., 1990"
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
                className="input"
            />
            <button onClick={calculate} className="calc-btn">Calculate</button>
            {lifeExpectancy !== null && (
                <p className="result">Estimated remaining years: <strong>{lifeExpectancy}</strong></p>
            )}
            <style jsx>{`\n        .tool-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-md); }\n        .tool-title { color: var(--primary); margin-bottom: 0.5rem; }\n        .input { width: 100%; padding: 0.75rem; margin-top: 0.5rem; border: 1px solid var(--border); border-radius: 0.5rem; }\n        .calc-btn { margin-top: 0.75rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; }\n        .calc-btn:hover { background: var(--primary-dark); }\n        .result { margin-top: 1rem; font-size: 1.2rem; }\n      `}</style>
        </div>
    );
}
