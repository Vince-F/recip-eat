import {
  AppBar,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import type { Recipe } from "../../models/recipe";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { getIngredientById } from "../../services/ingredientsHelper";
import type { QuantityType } from "../../models/quantityType";
import { RecipeActionsMenu } from "./RecipeActionsMenu";

interface ReceipeViewProps {
  recipe: Recipe | undefined;
}

export function RecipeView({ recipe }: ReceipeViewProps) {
  const navigate = useNavigate();

  if (!recipe) {
    return (
      <div>
        <AppBar position="static">
          <Toolbar data-test="recipe-view-header">
            <IconButton
              data-test="back-to-recipe-list-button"
              aria-label="Back to recipe list"
              onClick={goBackToRecipeList}
            >
              <ArrowBack />
            </IconButton>
            <Typography data-test="recipe-title" variant="h6" component="h1" className="flex-1">
              Recipe not found
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="p-2" data-test="recipe-not-found-content">
          This recipe doesn't exist!
        </div>
      </div>
    );
  }

  const steps = (recipe.steps ?? []).map((step, index) => (
    <li key={index} data-test={`recipe-step-${index}`}>
      {step}
    </li>
  ));

  const ingredients = (recipe.ingredients ?? []).map(
    (ingredientEntry, index) => {
      const ingredient = getIngredientById(ingredientEntry.ingredientId);
      return (
        <li className="flex gap-4 items-center mb-4" data-test={`recipe-ingredient-${index}`} key={index}>
          <Avatar alt="" src={ingredient?.image} variant="rounded" />
          {getQuantityText(
            ingredient?.key ?? "",
            ingredientEntry.quantity,
            ingredient?.quantityType,
          )}
        </li>
      );
    },
  );

  function getQuantityText(
    ingredientKey: string,
    quantity: number,
    quantityType: QuantityType | undefined,
  ): string {
    switch (quantityType) {
      case "UNIT":
        return `${quantity} x ${ingredientKey}`;
      case "WEIGHT":
        return `${quantity}g ${ingredientKey}`;
      case "VOLUME":
        return `${quantity}L ${ingredientKey}`;
      default:
        throw new Error(`Unknown quantity type: ${quantityType}`);
    }
  }

  function goBackToRecipeList() {
    navigate("/");
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar data-test="recipe-view-header">
          <IconButton
            data-test="back-to-recipe-list-button"
            aria-label="Back to recipe list"
            onClick={goBackToRecipeList}
          >
            <ArrowBack />
          </IconButton>
          <Typography data-test="recipe-title" variant="h6" component="h1" className="flex-1">
            {recipe.title}
          </Typography>
          <RecipeActionsMenu recipe={recipe} redirectAfterDelete={true} />
        </Toolbar>
      </AppBar>

      <div className="flex justify-center m-4 text-center" data-test="recipe-time-content">
        <Card className="m-4 flex-1" variant="outlined">
          <CardContent data-test="recipe-preparation-time-content">
            <Typography variant="h5" component="div">
              Preparation time
            </Typography>
            {recipe.preparationTimeMinutes} minutes
          </CardContent>
        </Card>
        <Card className="m-4 flex-1" variant="outlined">
          <CardContent data-test="recipe-cooking-time-content">
            <Typography variant="h5" component="div">
              Cooking time
            </Typography>
            {recipe.cookingTimeMinutes} minutes
          </CardContent>
        </Card>
      </div>

      <Divider />

      <div className="p-4" data-test="recipe-ingredients-content">
        <Typography variant="h4" component="h2" className="m-4">
          Ingredients
        </Typography>
        <div className="m-4">
          <ul className="list-none" data-test="recipe-ingredients-list">
            {ingredients}
          </ul>
        </div>
      </div>

      <Divider />

      <div className="p-4" data-test="recipe-steps-content" data-testid="recipe-steps-content">
        <Typography variant="h4" component="h2" className="m-4">
          Steps
        </Typography>
        <div className="m-4">
          <ol className="list-decimal" data-test="recipe-steps-list">
            {steps}
          </ol>
        </div>
      </div>
    </div>
  );
}
