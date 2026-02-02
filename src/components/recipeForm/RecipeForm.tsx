import {
  AppBar,
  Autocomplete,
  Button,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { NumberSpinner } from "../NumberSpinner";
import { allIngredients, getIngredientById } from "../../services/ingredientsHelper";
import type { Ingredient } from "../../models/ingredient";
import { ArrowBack, Delete } from "@mui/icons-material";
import { QuantityType } from "../../models/quantityType";
import { useNavigate } from "react-router";
import { addRecipe } from "../../stores/recipeSlice";
import { useAppDispatch } from "../../hooks";
import { v4 as uuidv4 } from 'uuid';

export function RecipeForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [preparationTime, setPreparationTime] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [ingredients, setIngredients] = useState<
    Array<{ ingredientId: string; quantity: number }>
  >([]);
  const [steps, setSteps] = useState<string[]>([]);

  const navigate = useNavigate();

  const stepFields = steps.map((step, index) => {
    return (
      <div key={index} className="mb-2">
        <TextField
          key={index}
          label={`Step ${index + 1}`}
          value={step}
          multiline
          fullWidth
          onChange={(event) => {
            const updatedSteps = [...steps];
            updatedSteps[index] = event.target.value;
            setSteps(updatedSteps);
          }}
        />
      </div>

    );
  });

  const ingredientFields = ingredients.map((ingredientEntry, index) => {
    const selectedIngredient = getIngredientById(ingredientEntry.ingredientId) ?? null;
    return (
      <li key={ingredientEntry.ingredientId + "_" + index} className="flex gap-2 flex-col">
        <div className="flex justify-between items-center">
          <h3>Ingredient {index + 1}</h3>
          <IconButton onClick={() => removeIngredient(index)}>
            <Delete />
          </IconButton>
        </div>

        <Autocomplete
          value={selectedIngredient}
          options={allIngredients}
          getOptionLabel={(option) => option.key}
          getOptionKey={(option) => option.id}
          renderInput={(params) => <TextField {...params} label="Ingredient" />}
          onChange={(_event, newValue) =>
            updateSelectedIngredient(index, newValue)
          }
        />
        <NumberSpinner
          label={`Quantity${getUnit(selectedIngredient?.quantityType)}`}
          value={ingredientEntry.quantity}
          min={0}
          onValueChange={(value) => {
            updateSelectedIngredientQuantity(index, value ?? 0);
          }}
        />
      </li>
    );
  });

  function updateSelectedIngredient(
    index: number,
    ingredient: Ingredient | null,
  ) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].ingredientId = ingredient?.id ?? "";
    setIngredients(updatedIngredients);
  }

  function updateSelectedIngredientQuantity(index: number, quantity: number) {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].quantity = quantity;
    setIngredients(updatedIngredients);
  }

  function removeIngredient(index: number) {
    setIngredients(ingredients.slice(0, index).concat(ingredients.slice(index + 1)));
  }

  function getUnit(quantityType: QuantityType | undefined): string {
    switch (quantityType) {
      case QuantityType.WEIGHT:
        return " (grams)";
      case QuantityType.VOLUME:
        return " (liters)";
      case QuantityType.UNIT:
      default:
        return "";
    }
  }

  async function createRecipe() {
    const newRecipe = {
      id: uuidv4(),
      title: name,
      image: "",
      preparationTimeMinutes: preparationTime,
      cookingTimeMinutes: cookingTime,
      ingredients: ingredients,
      steps: steps,
    };
    await dispatch(addRecipe(newRecipe));
    navigate("/");
  }

  function goBackToRecipeList() {
    navigate("/");
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            aria-label="Back to recipe list"
            onClick={goBackToRecipeList}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="h1">
            Create new recipe
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="p-4">
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="p-4">
        <NumberSpinner
          label="Preparation Time (minutes)"
          value={preparationTime}
          onValueChange={(value) => setPreparationTime(value ?? 0)}
        />
      </div>

      <div className="p-4">
        <NumberSpinner
          label="Cooking Time (minutes)"
          value={cookingTime}
          onValueChange={(value) => setCookingTime(value ?? 0)}
        />
      </div>

      <div className="p-4">
        <Typography variant="h4" component="h2" className="m-4">
          Ingredients
        </Typography>
        <div className="m-4">
          <ul className="list-none mb-4">{ingredientFields}</ul>
          <Button variant="outlined" onClick={() => setIngredients([...ingredients, { ingredientId: "", quantity: 0 }])}>
            Add Ingredient
          </Button>
        </div>
      </div>

      <Divider />

      <div className="p-4">
        <Typography variant="h4" component="h2" className="m-4">
          Steps
        </Typography>
        <div className="m-4">
          {stepFields}
          <Button variant="outlined" onClick={() => setSteps([...steps, ""])}>
            Add Step
          </Button>
        </div>
      </div>

      <div className="p-4 text-right">
        <Button variant="contained" color="primary" onClick={createRecipe}>
          Create Recipe
        </Button>
      </div>

    </div>
  );
}
