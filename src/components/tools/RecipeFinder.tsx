'use client';

import { useState } from 'react';
import { Search, ChefHat, Clock, Users, Flame, ChevronRight, Utensils, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data to simulate Spoonacular if no key is provided
const MOCK_RECIPES = [
    {
        id: 716429,
        title: "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
        image: "https://spoonacular.com/recipeImages/716429-556x370.jpg",
        readyInMinutes: 45,
        servings: 2,
        nutrition: { nutrients: [{ name: "Calories", amount: 580, unit: "kcal" }, { name: "Protein", amount: 19, unit: "g" }] }
    },
    {
        id: 715538,
        title: "Bruschetta Style Pork & Pasta",
        image: "https://spoonacular.com/recipeImages/715538-556x370.jpg",
        readyInMinutes: 35,
        servings: 4,
        nutrition: { nutrients: [{ name: "Calories", amount: 620, unit: "kcal" }, { name: "Protein", amount: 25, unit: "g" }] }
    }
];

export default function RecipeFinder() {
    const [query, setQuery] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [recipes, setRecipes] = useState<any[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [useMock, setUseMock] = useState(false);

    const searchRecipes = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setRecipes([]);
        setSelectedRecipe(null);

        if (!apiKey && !useMock) {
            // Check for env var proxy or client side key
            // Note: For this demo, we can fallback to mock if key is empty
            setUseMock(true);
            setTimeout(() => {
                setRecipes(MOCK_RECIPES);
                setLoading(false);
            }, 1000);
            return;
        }

        try {
            const endpoint = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&addRecipeNutrition=true&number=6&apiKey=${apiKey}`;
            const res = await fetch(endpoint);
            if (!res.ok) {
                if (res.status === 401) throw new Error('Invalid API Key. Using mock data instead.');
                throw new Error('Failed to fetch recipes');
            }
            const data = await res.json();
            setRecipes(data.results);
        } catch (err: any) {
            setError(err.message || 'Error occurred');
            if (err.message.includes('Invalid API Key')) {
                setUseMock(true);
                setRecipes(MOCK_RECIPES);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipeDetails = async (id: number) => {
        setLoading(true);
        // If mocking, just find in current list or simple detail
        if (useMock) {
            const r = MOCK_RECIPES.find(rd => rd.id === id);
            setSelectedRecipe({
                ...r,
                summary: "This is a delicious mock recipe summary. It tastes like victory and digital bits.",
                instructions: "1. Boil water.<br>2. Cook pasta.<br>3. Mix everything.<br>4. Enjoy life.",
                extendedIngredients: [
                    { original: "2 cups pasta" },
                    { original: "1 tbsp garlic" },
                    { original: "Love (optional)" }
                ]
            });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${apiKey}`);
            const data = await res.json();
            setSelectedRecipe(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recipe-finder max-w-5xl mx-auto space-y-8">
            {/* API Key Input (Collapsible or subtle) */}
            <div className="bg-surface p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-sm text-secondary flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>Enter your <strong>Spoonacular API Key</strong> for real data (or leave empty for demo).</span>
                </div>
                <input
                    type="password"
                    placeholder="Spoonacular API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-sm w-full md:w-64"
                />
            </div>

            {/* Search Bar */}
            <div className="search-section bg-surface p-8 rounded-2xl border border-border shadow-lg text-center">
                <ChefHat size={48} className="mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-6">Find Your Perfect Meal</h2>
                <form onSubmit={searchRecipes} className="relative max-w-2xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="What do you want to cook? (e.g. Pasta, Chicken, Vegan)"
                        className="flex-1 px-6 py-4 rounded-xl border border-border bg-background text-lg shadow-inner focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Cooking...' : <Search />}
                    </button>
                </form>
            </div>

            {/* Results Grid */}
            {!selectedRecipe && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="recipe-card bg-surface rounded-xl overflow-hidden border border-border shadow-md cursor-pointer group"
                            onClick={() => fetchRecipeDetails(recipe.id)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg leading-tight shadow-sm">{recipe.title}</h3>
                                </div>
                            </div>
                            <div className="p-4 flex justify-between text-sm text-secondary">
                                <span className="flex items-center gap-1"><Clock size={14} /> {recipe.readyInMinutes}m</span>
                                <span className="flex items-center gap-1"><Users size={14} /> {recipe.servings} ppl</span>
                                <span className="flex items-center gap-1 text-orange-500 font-medium">
                                    <Flame size={14} /> {recipe.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount} kcal
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Recipe Details View */}
            {selectedRecipe && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="recipe-detail bg-surface rounded-2xl overflow-hidden border border-border shadow-xl"
                >
                    <div className="relative h-64 md:h-80 w-full">
                        <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-full object-cover" />
                        <button
                            onClick={() => setSelectedRecipe(null)}
                            className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md hover:bg-black/70 transition-colors flex items-center gap-2"
                        >
                            <ChevronRight className="rotate-180" size={16} /> Back to Results
                        </button>
                        <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-background to-transparent">
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{selectedRecipe.title}</h1>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Utensils className="text-primary" /> Instructions</h3>
                                <div
                                    className="prose prose-sm md:prose-base dark:prose-invert text-secondary"
                                    dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions || selectedRecipe.summary }}
                                />
                            </section>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-background p-6 rounded-xl border border-border">
                                <h3 className="font-bold mb-4 uppercase tracking-wider text-sm opacity-70">Ingredients</h3>
                                <ul className="space-y-2 text-sm">
                                    {selectedRecipe.extendedIngredients?.map((ing: any, i: number) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                                            {ing.original}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                                <h3 className="font-bold mb-4 text-primary uppercase tracking-wider text-sm">Nutrition</h3>
                                <div className="space-y-2 text-sm">
                                    {selectedRecipe.nutrition?.nutrients.slice(0, 6).map((nut: any) => (
                                        <div key={nut.name} className="flex justify-between border-b border-primary/10 pb-1 last:border-0">
                                            <span>{nut.name}</span>
                                            <span className="font-bold">{nut.amount}{nut.unit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
