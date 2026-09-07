import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router";
import { RecipeActionsMenu } from "../recipeView/RecipeActionsMenu";
import type { Recipe } from "../../models/recipe";

interface RecipeListEntryProps {
  recipe: Recipe;
}

export function RecipeListEntry({ recipe }: RecipeListEntryProps) {
  const navigate = useNavigate();

  function goToRecipe(recipeId: string) {
    navigate(`/recipe/${recipeId}`);
  }

  return (
    <ListItem data-test={"recipe-entry-" + recipe.id} secondaryAction={<RecipeActionsMenu data-test="recipe-actions-menu-button" recipe={recipe} />}>
      <ListItemButton data-test="select-recipe-button" component="a" onClick={() => goToRecipe(recipe.id)}>
        <ListItemAvatar>
          <Avatar alt={recipe.title} src={recipe.image} variant="square" />
        </ListItemAvatar>
        <ListItemText data-test="recipe-name" primary={recipe.title} />
      </ListItemButton>
    </ListItem>
  );
}
