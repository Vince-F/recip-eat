import {
  Alert,
  AppBar,
  Autocomplete,
  Button,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { NumberSpinner } from "../NumberSpinner";
import {
  allIngredients,
  getIngredientById,
} from "../../services/ingredientsHelper";
import type { Ingredient } from "../../models/ingredient";
import { ArrowBack, Delete } from "@mui/icons-material";
import { QuantityType } from "../../models/quantityType";
import { useNavigate } from "react-router";
import { addRecipe } from "../../stores/recipeSlice";
import { useAppDispatch } from "../../hooks";
import { v4 as uuidv4 } from "uuid";

export function RecipeForm() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [preparationTime, setPreparationTime] = useState(0);
  const [cookingTime, setCookingTime] = useState(0);
  const [ingredients, setIngredients] = useState<
    Array<{ ingredientId: string; quantity: number }>
  >([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [ nameError, setNameError ] = useState<string | null>(null);
  const [ ingredientsError, setIngredientsError ] = useState<Array<string | null>>([]);
  const [ ingredientsQuantityError, setIngredientsQuantityError ] = useState<Array<string | null>>([]);
  const [ stepsErrors, setStepsErrors ] = useState<Array<string | null>>([]);
  const [ errorMessage, setErrorMessage ] = useState<string>("");
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const errorBannerRef = useRef<HTMLDivElement | null>(null);
  const ingredientsInputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const ingredientsQuantityAnchorRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const stepsInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const navigate = useNavigate();

  const stepFields = steps.map((step, index) => {
    return (
      <div key={index} className="mb-2 flex gap-1 items-start">
        <TextField
          key={index}
          label={`Step ${index + 1}`}
          value={step}
          required
          multiline
          fullWidth
          inputRef={el => { stepsInputsRef.current[index] = el; }}
          error={!!stepsErrors[index]}
          helperText={stepsErrors[index] ?? ""}
          onChange={(event) => {
            const updatedSteps = [...steps];
            updatedSteps[index] = event.target.value;
            setSteps(updatedSteps);
          }}
        />
        <IconButton onClick={() => removeStep(index)}>
          <Delete />
        </IconButton>
      </div>
    );
  });

  const ingredientFields = ingredients.map((ingredientEntry, index) => {
    const selectedIngredient =
      getIngredientById(ingredientEntry.ingredientId) ?? null;
    return (
      <li
        key={ingredientEntry.ingredientId + "_" + index}
        className="flex gap-2 flex-col"
      >
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
          renderInput={(params) => 
            <TextField required {...params} label="Ingredient" error={!!ingredientsError[index]} helperText={ingredientsError[index] ?? ""}
              inputRef={el => { ingredientsInputsRef.current[index] = el; }} />}
              onChange={(_event, newValue) =>
                updateSelectedIngredient(index, newValue)
              }
        />
        {/* it's a bit hacky to focus just before the NumberSpinner but so far I have not found a simple way to focus the input */}
        <a className="sr-only" tabIndex={-1} ref={el => { ingredientsQuantityAnchorRef.current[index] = el; }} />
        <NumberSpinner
          label={`Quantity${getUnit(selectedIngredient?.quantityType)}`}
          value={ingredientEntry.quantity}
          min={0}
          error={!!ingredientsQuantityError[index]}
          onValueChange={(value) => {
            updateSelectedIngredientQuantity(index, value ?? 0);
          }}
        />
        {ingredientsQuantityError[index] && <p className="text-xs text-red-500">{ingredientsQuantityError[index]}</p>}
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
    setIngredients(
      ingredients.slice(0, index).concat(ingredients.slice(index + 1)),
    );
    ingredientsInputsRef.current.splice(index, 1);
    ingredientsQuantityAnchorRef.current.splice(index, 1);
  }

  function removeStep(index: number) {
    setSteps(
      steps.slice(0, index).concat(steps.slice(index + 1)),
    );
    stepsInputsRef.current.splice(index, 1);
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

  function validateForm(): boolean {
    if (!name.trim()) {
      setNameError("Name is required");
      nameInputRef.current?.focus();
      return false;
    }
    setNameError(null);
    if (ingredients.length === 0) {
      setErrorMessage("You need to add at least one ingredient");
      errorBannerRef.current?.focus();
      return false;
    }
    if (steps.length === 0) {
      setErrorMessage("You need to add at least one step");
      errorBannerRef.current?.focus();
      return false;
    }
    setErrorMessage("");
    for(let i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      if (ingredient.ingredientId.trim() === "") {
        const ingredientErrors = new Array(ingredients.length).fill(null);
        ingredientErrors[i] = "You must select an ingredient. Delete his ingredient entry if you don't want to use it.";
        setIngredientsError(ingredientErrors);
        ingredientsInputsRef.current[i]?.focus();
        return false;
      }
      if (ingredient.quantity <= 0) {
        const quantityErrors = new Array(ingredients.length).fill(null);
        quantityErrors[i] = "Quantity must be greater than 0. Delete his ingredient entry if you don't want to use it.";
        setIngredientsQuantityError(quantityErrors);
        ingredientsQuantityAnchorRef.current[i]?.focus();
        return false;
      }
    }
    setIngredientsError(new Array(ingredients.length).fill(null));
    setIngredientsQuantityError(new Array(ingredients.length).fill(null));
    for(let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.trim() === "") {
        const stepErrors = new Array(steps.length).fill(null);
        stepErrors[i] = "Step description is required. Delete this step if you don't want to use it.";
        setStepsErrors(stepErrors);
        stepsInputsRef.current[i]?.focus();
        return false;
      }
    }
    setStepsErrors(new Array(steps.length).fill(null));
    return true;
  }

  async function createRecipe() {
    if (!validateForm()) {
      return;
    }
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
      <form autoComplete="off">
        { errorMessage.length > 0 && <Alert tabIndex={-1} ref={errorBannerRef} severity="error">{errorMessage}</Alert> }
        <p className="pt-2 text-right text-xs text-gray-400">*: indicates required field</p>
        <div className="p-4">
          <TextField
            required
            label="Name"
            fullWidth
            value={name}
            inputRef={nameInputRef}
            error={!!nameError}
            helperText={nameError ?? ""}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="p-4">
          <NumberSpinner
            label="Preparation Time (minutes)"
            min={0}
            value={preparationTime}
            onValueChange={(value) => setPreparationTime(value ?? 0)}
          />
        </div>

        <div className="p-4">
          <NumberSpinner
            label="Cooking Time (minutes)"
            min={0}
            value={cookingTime}
            onValueChange={(value) => setCookingTime(value ?? 0)}
          />
        </div>

        <fieldset className="p-4">
          <legend>
            <Typography variant="h4" component="h2" className="m-4">
              Ingredients
            </Typography>
          </legend>
          
          <p className="text-right text-xs text-gray-400">You need at least one ingredient</p>
          <div className="m-4">
            <ul className="list-none mb-4">{ingredientFields}</ul>
            <Button
              variant="outlined"
              onClick={() =>
                setIngredients([
                  ...ingredients,
                  { ingredientId: "", quantity: 0 },
                ])
              }
            >
              Add Ingredient
            </Button>
          </div>
        </fieldset>

        <Divider />

        <fieldset className="p-4">
          <legend>
            <Typography variant="h4" component="h2" className="m-4">
              Steps
            </Typography>
          </legend>
          <p className="text-right text-xs text-gray-400">You need at least one step</p>
          <div className="m-4">
            {stepFields}
            <Button variant="outlined" onClick={() => setSteps([...steps, ""])}>
              Add Step
            </Button>
          </div>
        </fieldset>

        <div className="p-4 text-right">
          <Button variant="contained" color="primary" onClick={createRecipe}>
            Create Recipe
          </Button>
        </div>
      </form>
    </div>
  );
}
