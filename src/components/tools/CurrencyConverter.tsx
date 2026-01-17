'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRightLeft, TrendingUp, Calendar, RefreshCw, AlertCircle } from 'lucide-react';

interface Rates {
    [key: string]: number;
}

interface HistoricalData {
    amount: number;
    base: string;
    start_date: string;
    end_date: string;
    rates: {
        [date: string]: {
            [currency: string]: number;
        };
    };
}

const CURRENCIES = {
    USD: "United States Dollar",
    EUR: "Euro",
    GBP: "British Pound Sterling",
    JPY: "Japanese Yen",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    SEK: "Swedish Krona",
    NZD: "New Zealand Dollar",
    MXN: "Mexican Peso",
    SGD: "Singapore Dollar",
    HKD: "Hong Kong Dollar",
    NOK: "Norwegian Krone",
    KRW: "South Korean Won",
    TRY: "Turkish Lira",
    INR: "Indian Rupee",
    BRL: "Brazilian Real",
    ZAR: "South African Rand",
};

export default function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState<string>('USD');
    const [toCurrency, setToCurrency] = useState<string>('EUR');
    const [rate, setRate] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [error, setError] = useState<string>('');

    // Fetch Rate and History
    useEffect(() => {
        const fetchData = async () => {
            if (fromCurrency === toCurrency) {
                setRate(1);
                setHistoryData([]);
                return;
            }

            setLoading(true);
            setError('');

            try {
                // 1. Fetch Latest Rate
                // Frankfurter API: free, no key, based on ECB data
                const rateRes = await fetch(`https://api.frankfurter.app/latest?amount=1&from=${fromCurrency}&to=${toCurrency}`);
                if (!rateRes.ok) throw new Error('Failed to fetch rates');
                const rateData = await rateRes.json();

                if (rateData.rates && rateData.rates[toCurrency]) {
                    setRate(rateData.rates[toCurrency]);
                    setLastUpdated(rateData.date);
                }

                // 2. Fetch Historical Data (Last 30 Days)
                const endDate = new Date().toISOString().split('T')[0];
                const startDateObj = new Date();
                startDateObj.setDate(startDateObj.getDate() - 30);
                const startDate = startDateObj.toISOString().split('T')[0];

                const historyRes = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurrency}&to=${toCurrency}`);
                if (!historyRes.ok) throw new Error('Failed to fetch history');
                const historyJson: HistoricalData = await historyRes.json();

                // Process history for Recharts
                const chartData = Object.entries(historyJson.rates).map(([date, rates]) => ({
                    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    rate: rates[toCurrency]
                }));

                setHistoryData(chartData);

            } catch (err) {
                console.error(err);
                setError('Could not fetch currency data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(debounce);
    }, [fromCurrency, toCurrency]);

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <div className="currency-converter">
            <div className="converter-card">
                <div className="inputs-row">
                    <div className="input-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="amount-input"
                        />
                    </div>

                    <div className="currency-select-group">
                        <div className="select-wrapper">
                            <label>From</label>
                            <select
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value)}
                            >
                                {Object.entries(CURRENCIES).map(([code, name]) => (
                                    <option key={code} value={code}>{code} - {name}</option>
                                ))}
                            </select>
                        </div>

                        <button className="swap-btn" onClick={handleSwap} aria-label="Swap currencies">
                            <ArrowRightLeft size={20} />
                        </button>

                        <div className="select-wrapper">
                            <label>To</label>
                            <select
                                value={toCurrency}
                                onChange={(e) => setToCurrency(e.target.value)}
                            >
                                {Object.entries(CURRENCIES).map(([code, name]) => (
                                    <option key={code} value={code}>{code} - {name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {error ? (
                    <div className="error-message">
                        <AlertCircle size={20} /> {error}
                    </div>
                ) : (
                    <div className="result-display">
                        <div className="main-result">
                            <span className="from-val">{amount} {fromCurrency} =</span>
                            <span className="to-val">
                                {rate ? (amount * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '...'}
                                <small>{toCurrency}</small>
                            </span>
                        </div>
                        <div className="rate-info">
                            1 {fromCurrency} = {rate} {toCurrency} • Updated: {lastUpdated}
                        </div>
                    </div>
                )}
            </div>

            {historyData.length > 0 && !error && (
                <div className="chart-card">
                    <div className="chart-header">
                        <h3><TrendingUp size={20} /> Exchange Rate History (Last 30 Days)</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={historyData}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: 'var(--secondary)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fill: 'var(--secondary)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={40}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--surface)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--border)',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                    itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="rate"
                                    stroke="var(--primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRate)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <style jsx>{`
                .currency-converter { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
                
                .converter-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
                
                .inputs-row { display: flex; flex-direction: column; gap: 1.5rem; }
                
                .input-group, .select-wrapper { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-group label, .select-wrapper label { font-size: 0.9rem; font-weight: 600; color: var(--secondary); }
                
                .amount-input, select {
                    padding: 1rem; border-radius: 0.75rem; border: 1px solid var(--border); background: var(--background);
                    font-size: 1.1rem; color: var(--foreground); transition: 0.2s; width: 100%;
                }
                .amount-input:focus, select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-soft); }

                .currency-select-group { display: flex; align-items: flex-end; gap: 1rem; }
                .select-wrapper { flex: 1; }
                
                .swap-btn {
                    margin-bottom: 4px;
                    width: 3rem; height: 3rem; border-radius: 50%; background: var(--surface); border: 1px solid var(--border);
                    display: flex; align-items: center; justify-content: center; color: var(--primary); transition: 0.2s; cursor: pointer;
                    flex-shrink: 0;
                }
                .swap-btn:hover { background: var(--primary); color: white; transform: rotate(180deg); }

                .result-display { margin-top: 2rem; text-align: center; padding-top: 2rem; border-top: 1px dashed var(--border); }
                .main-result { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
                .from-val { font-size: 1.1rem; color: var(--secondary); font-weight: 500; }
                .to-val { font-size: 3rem; font-weight: 800; color: var(--primary); line-height: 1; }
                .to-val small { font-size: 1.25rem; margin-left: 0.5rem; opacity: 0.8; }
                
                .rate-info { margin-top: 1rem; font-size: 0.9rem; color: var(--secondary); background: var(--background); display: inline-block; padding: 0.5rem 1rem; border-radius: 2rem; }

                .chart-card { background: var(--surface); padding: 2rem; border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
                .chart-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
                .chart-header h3 { font-size: 1.2rem; display: flex; align-items: center; gap: 0.75rem; }

                .error-message { background: #fee2e2; color: #ef4444; padding: 1rem; border-radius: 0.75rem; display: flex; align-items: center; gap: 0.5rem; margin-top: 1.5rem; }

                @media (max-width: 768px) {
                    .currency-select-group { flex-direction: column; align-items: stretch; }
                    .swap-btn { width: 100%; height: 2.5rem; border-radius: 0.5rem; margin-bottom: 0; transform: rotate(90deg); }
                    .swap-btn:hover { transform: rotate(270deg); }
                }
            `}</style>
        </div>
    );
}
