'use client';

import { useState, useMemo } from 'react';
import { ArrowRightLeft, Copy, Check, Hash, Scale, Thermometer, Maximize, Zap, Play, Clock, Wind, Cylinder, Layers, Activity } from 'lucide-react';
import { Button, Input, Select, Card } from '@/components/ui/Core';
import { motion, AnimatePresence } from 'framer-motion';

type UnitType = 'length' | 'weight' | 'temperature' | 'area' | 'speed' | 'volume' | 'digital' | 'time' | 'pressure' | 'energy' | 'power' | 'force';

interface UnitConverterProps {
    type: UnitType;
    title: string;
    description: string;
}

const UNITS: Record<string, Record<string, number | ((val: number) => number)>> = {
    length: { 'nm': 1e-9, 'mm': 0.001, 'cm': 0.01, 'm': 1, 'km': 1000, 'inch': 0.0254, 'ft': 0.3048, 'yd': 0.9144, 'mi': 1609.344 },
    weight: { 'mg': 1e-6, 'g': 0.001, 'kg': 1, 'tonne': 1000, 'oz': 0.0283495, 'lb': 0.453592, 'stone': 6.35029 },
    area: { 'sq_mm': 1e-6, 'sq_cm': 0.0001, 'sq_m': 1, 'sq_km': 1e6, 'hectare': 10000, 'sq_inch': 0.00064516, 'sq_ft': 0.092903, 'sq_yd': 0.836127, 'acre': 4046.86, 'sq_mi': 2.59e6 },
    volume: { 'ml': 0.001, 'l': 1, 'c_m': 1000, 'tsp': 0.00492892, 'tbsp': 0.0147868, 'fl_oz': 0.0295735, 'cup': 0.236588, 'pt': 0.473176, 'qt': 0.946353, 'gal': 3.78541 },
    speed: { 'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'knot': 0.514444, 'mach': 343 },
    digital: { 'bit': 0.125, 'B': 1, 'KB': 1024, 'MB': 1048576, 'GB': 1073741824, 'TB': 1099511627776, 'PB': 1125899906842624 },
    time: { 'ms': 0.001, 's': 1, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800, 'mo': 2628000, 'y': 31536000 },
    pressure: { 'Pa': 1, 'kPa': 1000, 'bar': 100000, 'psi': 6894.76, 'atm': 101325, 'torr': 133.322 },
    energy: { 'J': 1, 'kJ': 1000, 'cal': 4.184, 'kcal': 4184, 'Wh': 3600, 'kWh': 3.6e6, 'eV': 1.6022e-19, 'BTU': 1055.06 },
    power: { 'W': 1, 'kW': 1000, 'MW': 1e6, 'hp': 745.7, 'lumen/s': 0.001496 },
    force: { 'N': 1, 'kN': 1000, 'dyn': 1e-5, 'lbf': 4.44822, 'kgf': 9.80665 }
};

const LABELS: Record<string, string> = {
    'nm': 'Nanometers', 'mm': 'Millimeters', 'cm': 'Centimeters', 'm': 'Meters', 'km': 'Kilometers', 'inch': 'Inches', 'ft': 'Feet', 'yd': 'Yards', 'mi': 'Miles',
    'mg': 'Milligrams', 'g': 'Grams', 'kg': 'Kilograms', 'tonne': 'Metric Tonnes', 'oz': 'Ounces', 'lb': 'Pounds', 'stone': 'Stones',
    'sq_mm': 'Square Millimeters', 'sq_cm': 'Square Centimeters', 'sq_m': 'Square Meters', 'sq_km': 'Square Kilometers', 'hectare': 'Hectares', 'sq_inch': 'Square Inches', 'sq_ft': 'Square Feet', 'sq_yd': 'Square Yards', 'acre': 'Acres', 'sq_mi': 'Square Miles',
    'ml': 'Milliliters', 'l': 'Liters', 'c_m': 'Cubic Meters', 'tsp': 'Teaspoons', 'tbsp': 'Tablespoons', 'fl_oz': 'Fluid Ounces', 'cup': 'Cups', 'pt': 'Pints', 'qt': 'Quarts', 'gal': 'Gallons',
    'm/s': 'm/s', 'km/h': 'km/h', 'mph': 'mph', 'knot': 'Knots', 'mach': 'Mach',
    'bit': 'Bits', 'B': 'Bytes', 'KB': 'Kilobytes', 'MB': 'Megabytes', 'GB': 'Gigabytes', 'TB': 'Terabytes', 'PB': 'Petabytes',
    'ms': 'ms', 's': 'Seconds', 'min': 'Minutes', 'h': 'Hours', 'd': 'Days', 'wk': 'Weeks', 'mo': 'Months', 'y': 'Years',
    'c': 'Celsius', 'f': 'Fahrenheit', 'k': 'Kelvin', 'Pa': 'Pascals', 'kPa': 'Kilopascals', 'bar': 'Bars', 'psi': 'PSI', 'atm': 'Atmospheres', 'torr': 'Torr',
    'J': 'Joules', 'kJ': 'Kilojoules', 'cal': 'Calories', 'kcal': 'Kilocalories', 'Wh': 'Wh', 'kWh': 'kWh', 'eV': 'eV', 'BTU': 'BTU',
    'W': 'Watts', 'kW': 'Kilowatts', 'MW': 'Megawatts', 'hp': 'Horsepower', 'lumen/s': 'Lumens/s',
    'N': 'Newtons', 'kN': 'Kilonewtons', 'dyn': 'Dynes', 'lbf': 'Pound-force', 'kgf': 'kg-force'
};

const TypeIcons: Record<UnitType, any> = {
    length: Maximize, weight: Scale, temperature: Thermometer, area: Layers, speed: Play, volume: Cylinder, digital: Hash, time: Clock, pressure: Wind, energy: Zap, power: Activity, force: Activity
};

export default function UnitConverter({ type, title, description }: UnitConverterProps) {
    const [amount, setAmount] = useState<string>('1');
    const units = type === 'temperature' ? ['c', 'f', 'k'] : Object.keys(UNITS[type]);
    const [fromUnit, setFromUnit] = useState(units[0]);
    const [toUnit, setToUnit] = useState(units[1] || units[0]);
    const [copied, setCopied] = useState(false);

    const Icon = TypeIcons[type] || Hash;

    const result = useMemo(() => {
        const val = parseFloat(amount);
        if (isNaN(val)) return 0;
        if (type === 'temperature') {
            if (fromUnit === toUnit) return val;
            let celsius = val;
            if (fromUnit === 'f') celsius = (val - 32) * 5 / 9;
            if (fromUnit === 'k') celsius = val - 273.15;
            if (toUnit === 'c') return celsius;
            if (toUnit === 'f') return (celsius * 9 / 5) + 32;
            if (toUnit === 'k') return celsius + 273.15;
            return val;
        } else {
            const factors = UNITS[type] as Record<string, number>;
            const baseValue = val * factors[fromUnit];
            return baseValue / factors[toUnit];
        }
    }, [amount, fromUnit, toUnit, type]);

    const formattedResult = result % 1 !== 0
        ? result.toLocaleString(undefined, { maximumFractionDigits: 6 })
        : result.toLocaleString();

    const handleCopy = () => {
        navigator.clipboard.writeText(result.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-fg px-1">Value to Convert</label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e: any) => setAmount(e.target.value)}
                        className="text-lg font-bold"
                    />
                </div>

                <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-fg px-1">From</label>
                    <Select value={fromUnit} onChange={(e: any) => setFromUnit(e.target.value)}>
                        {units.map(u => <option key={u} value={u}>{LABELS[u] || u}</option>)}
                    </Select>
                </div>

                <div className="md:col-span-1 flex justify-center pt-6">
                    <Button variant="ghost" size="sm" onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="rounded-full w-10 h-10 p-0">
                        <ArrowRightLeft size={16} />
                    </Button>
                </div>

                <div className="md:col-span-3 space-y-2">
                    <label className="text-[10px] font-black uppercase text-muted-fg px-1">To</label>
                    <Select value={toUnit} onChange={(e: any) => setToUnit(e.target.value)}>
                        {units.map(u => <option key={u} value={u}>{LABELS[u] || u}</option>)}
                    </Select>
                </div>
            </div>

            <Card className="relative overflow-hidden bg-accent/5 border-accent/10 py-12 flex flex-col items-center justify-center space-y-2 group">
                <div className="absolute top-4 right-4">
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </Button>
                </div>

                <Icon size={48} className="text-accent opacity-20 mb-2 group-hover:scale-110 transition-fast" />
                <motion.div
                    key={formattedResult}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-black text-fg tracking-tighter"
                >
                    {formattedResult}
                </motion.div>
                <div className="text-xs font-black uppercase text-muted-fg tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/10">
                    {LABELS[toUnit] || toUnit}
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border flex items-center gap-4">
                    <div className="p-2 bg-bg rounded-md"><Icon size={18} className="text-accent" /></div>
                    <div>
                        <div className="text-[10px] font-black text-muted-fg uppercase tracking-widest">System Ratio</div>
                        <div className="text-sm font-bold">1 {fromUnit} ≈ {(typeof result === 'number' && amount !== '0' ? result / parseFloat(amount) : 0).toFixed(4)} {toUnit}</div>
                    </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border flex items-center gap-4">
                    <div className="p-2 bg-bg rounded-md"><Zap size={18} className="text-accent" /></div>
                    <div>
                        <div className="text-[10px] font-black text-muted-fg uppercase tracking-widest">Efficiency</div>
                        <div className="text-sm font-bold">Lossless Real-time Conversion</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
