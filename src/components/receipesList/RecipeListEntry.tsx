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
    <ListItem secondaryAction={<RecipeActionsMenu recipe={recipe} />}>
      <ListItemButton component="a" onClick={() => goToRecipe(recipe.id)}>
        <ListItemAvatar>
          <Avatar alt={recipe.title} src={recipe.image} variant="square" />
        </ListItemAvatar>
        <ListItemText primary={recipe.title} />
      </ListItemButton>
    </ListItem>
  );
}
