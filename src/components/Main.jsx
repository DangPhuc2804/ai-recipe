import React from "react";
import IngredientsList from "../components/IngredientsList.jsx";
import { getRecipeFromMistral } from "../ai"; // ✅ Đổi từ ChatGPT sang HuggingFace
import ReactMarkdown from "react-markdown";

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
    }

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient");
        if (newIngredient && newIngredient.trim() !== "") {
            setIngredients(prev => [...prev, newIngredient.trim()]);
        }
    }

    return (
        <main>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    addIngredient(new FormData(e.target));
                    e.target.reset();
                }}
                className="add-ingredient-form"
            >
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                />
            }

            {recipe && (
                <div className="recipe-markdown">
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                </div>
            )}
        </main>
    );
}
