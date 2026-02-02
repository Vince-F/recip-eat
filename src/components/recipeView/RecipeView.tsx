import {
  AppBar,
  Avatar,
  Card,
  CardContent,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import type { Recipe } from "../../models/recipe";
import { ArrowBack, Delete, MoreVert, Share, Star } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { getIngredientById } from "../../services/ingredientsHelper";
import type { QuantityType } from "../../models/quantityType";

interface ReceipeViewProps {
  recipe: Recipe | undefined;
}

export function RecipeView({ recipe }: ReceipeViewProps) {
  const [menuButton, setMenuButton] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  if (!recipe) {
    return <div>This recipe doesn't exist!</div>;
  }

  const steps = (recipe.steps ?? []).map((step, index) => (
    <li key={index}>{step}</li>
  ));
  const ingredients = (recipe.ingredients ?? []).map(
    (ingredientEntry, index) => {
      const ingredient = getIngredientById(ingredientEntry.ingredientId);
      return (
        <li className="flex gap-4 items-center mb-4" key={index}>
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

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    setMenuButton(event.currentTarget);
  }

  function closeMenu() {
    setMenuButton(null);
  }

  function toggleFavorite() {}

  function shareRecipe() {}

  function deleteRecipe() {}

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
          <Typography variant="h6" component="h1" className="flex-1">
            {recipe.title}
          </Typography>
          <IconButton
            aria-label="More actions"
            id={`moreButton${recipe.id}`}
            aria-controls={menuButton ? `moreMenu${recipe.id}` : undefined}
            aria-haspopup="true"
            aria-expanded={menuButton ? "true" : "false"}
            onClick={openMenu}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id={`moreMenu${recipe.id}`}
            anchorEl={menuButton}
            open={Boolean(menuButton)}
            slotProps={{
              list: {
                "aria-labelledby": `moreButton${recipe.id}`,
              },
            }}
            onClose={closeMenu}
          >
            <MenuItem onClick={toggleFavorite}>
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText>Set favorite</ListItemText>
            </MenuItem>
            <MenuItem onClick={shareRecipe}>
              <ListItemIcon>
                <Share />
              </ListItemIcon>
              <ListItemText>Share</ListItemText>
            </MenuItem>
            <MenuItem onClick={deleteRecipe}>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <div className="flex justify-center m-4 text-center">
        <Card className="m-4 flex-1" variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              Preparation time
            </Typography>
            {recipe.preparationTimeMinutes} minutes
          </CardContent>
        </Card>
        <Card className="m-4 flex-1" variant="outlined">
          <CardContent>
            <Typography variant="h5" component="div">
              Cooking time
            </Typography>
            {recipe.cookingTimeMinutes} minutes
          </CardContent>
        </Card>
      </div>

      <Divider />

      <div className="p-4">
        <Typography variant="h4" component="h2" className="m-4">
          Ingredients
        </Typography>
        <div className="m-4">
          <ul className="list-none">{ingredients}</ul>
        </div>
      </div>

      <Divider />

      <div className="p-4">
        <Typography variant="h4" component="h2" className="m-4">
          Steps
        </Typography>
        <div className="m-4">
          <ol className="list-decimal">{steps}</ol>
        </div>
      </div>
    </div>
  );
}
