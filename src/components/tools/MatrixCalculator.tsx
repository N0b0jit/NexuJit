'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';

export default function MatrixCalculator() {
    const [matrixA, setMatrixA] = useState([[1, 2], [3, 4]]);
    const [matrixB, setMatrixB] = useState([[5, 6], [7, 8]]);
    const [result, setResult] = useState<number[][] | null>(null);
    const [size, setSize] = useState(2);
    const [operation, setOperation] = useState('add');
    const [error, setError] = useState('');

    const handleSizeChange = (newSize: number) => {
        setSize(newSize);
        // Reset matrices
        const newMat = Array(newSize).fill(0).map(() => Array(newSize).fill(0));
        setMatrixA(newMat);
        setMatrixB(newMat);
        setResult(null);
        setError('');
    };

    const updateMatrixA = (r: number, c: number, val: number) => {
        const newMat = [...matrixA];
        newMat[r] = [...newMat[r]];
        newMat[r][c] = val;
        setMatrixA(newMat);
    };

    const updateMatrixB = (r: number, c: number, val: number) => {
        const newMat = [...matrixB];
        newMat[r] = [...newMat[r]];
        newMat[r][c] = val;
        setMatrixB(newMat);
    };

    const calculate = () => {
        setError('');
        try {
            if (operation === 'add') {
                const res = matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j]));
                setResult(res);
            } else if (operation === 'sub') {
                const res = matrixA.map((row, i) => row.map((val, j) => val - matrixB[i][j]));
                setResult(res);
            } else if (operation === 'mul') {
                // Matrix Multiplication
                const res = Array(size).fill(0).map(() => Array(size).fill(0));
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        for (let k = 0; k < size; k++) {
                            res[i][j] += matrixA[i][k] * matrixB[k][j];
                        }
                    }
                }
                setResult(res);
            } else if (operation === 'detA') {
                if (size === 2) {
                    const det = matrixA[0][0] * matrixA[1][1] - matrixA[0][1] * matrixA[1][0];
                    setResult([[det]]);
                } else if (size === 3) {
                    const det = matrixA[0][0] * (matrixA[1][1] * matrixA[2][2] - matrixA[1][2] * matrixA[2][1]) -
                        matrixA[0][1] * (matrixA[1][0] * matrixA[2][2] - matrixA[1][2] * matrixA[2][0]) +
                        matrixA[0][2] * (matrixA[1][0] * matrixA[2][1] - matrixA[1][1] * matrixA[2][0]);
                    setResult([[det]]);
                } else {
                    setError('Determinant only supported for 2x2 and 3x3 currently.');
                }
            }
        } catch (e) {
            setError('Calculation Error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-lg space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Calculator /> Matrix Calculator</h2>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-secondary">Size:</label>
                            <select
                                value={size}
                                onChange={(e) => handleSizeChange(Number(e.target.value))}
                                className="bg-background border border-border rounded-lg p-2 font-bold outline-none"
                            >
                                <option value={2}>2x2</option>
                                <option value={3}>3x3</option>
                                <option value={4}>4x4</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-bold text-secondary">Operation:</label>
                            <select
                                value={operation}
                                onChange={(e) => setOperation(e.target.value)}
                                className="bg-background border border-border rounded-lg p-2 font-bold outline-none"
                            >
                                <option value="add">A + B</option>
                                <option value="sub">A - B</option>
                                <option value="mul">A × B</option>
                                <option value="detA">Det(A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Matrix A */}
                    <div className="space-y-2">
                        <div className="text-center font-bold text-primary">Matrix A</div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                            {matrixA.map((row, i) => (
                                row.map((val, j) => (
                                    <input
                                        key={`a-${i}-${j}`}
                                        type="number"
                                        value={val}
                                        onChange={(e) => updateMatrixA(i, j, parseFloat(e.target.value) || 0)}
                                        className="w-full p-2 text-center font-mono font-bold bg-background border border-border rounded-lg focus:border-primary outline-none"
                                    />
                                ))
                            ))}
                        </div>
                    </div>

                    {/* Operator */}
                    <div className="flex justify-center flex-col items-center gap-4">
                        <div className="text-4xl font-black text-secondary/30">
                            {operation === 'add' && '+'}
                            {operation === 'sub' && '-'}
                            {operation === 'mul' && '×'}
                            {operation === 'detA' && 'Det'}
                        </div>
                        <button
                            onClick={calculate}
                            className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-8 rounded-full shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            Calculate =
                        </button>
                    </div>

                    {/* Matrix B (Hidden if unary op) */}
                    {operation !== 'detA' ? (
                        <div className="space-y-2">
                            <div className="text-center font-bold text-primary">Matrix B</div>
                            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
                                {matrixB.map((row, i) => (
                                    row.map((val, j) => (
                                        <input
                                            key={`b-${i}-${j}`}
                                            type="number"
                                            value={val}
                                            onChange={(e) => updateMatrixB(i, j, parseFloat(e.target.value) || 0)}
                                            className="w-full p-2 text-center font-mono font-bold bg-background border border-border rounded-lg focus:border-primary outline-none"
                                        />
                                    ))
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-secondary opacity-50 italic">
                            Matrix B not used for Determinant
                        </div>
                    )}
                </div>

                {/* Result */}
                {result && (
                    <div className="pt-8 border-t border-border">
                        <div className="max-w-[200px] mx-auto space-y-2">
                            <div className="text-center font-bold text-green-500 uppercase text-sm">Result</div>
                            {result.length === 1 && result[0].length === 1 ? (
                                <div className="text-4xl font-black text-center">{result[0][0]}</div>
                            ) : (
                                <div className="grid gap-2 p-4 bg-green-500/5 border border-green-500/20 rounded-xl" style={{ gridTemplateColumns: `repeat(${result.length}, 1fr)` }}>
                                    {result.map((row, i) => (
                                        row.map((val, j) => (
                                            <div key={`r-${i}-${j}`} className="text-center font-mono font-bold py-2">
                                                {Number.isInteger(val) ? val : val.toFixed(2)}
                                            </div>
                                        ))
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="text-center text-red-500 font-bold bg-red-500/10 p-4 rounded-xl">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
