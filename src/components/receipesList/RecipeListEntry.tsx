import {
  Avatar,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { RecipeOverview } from "../../models/recipeOverview";
import { Delete, MoreVert, Share, Star } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router";

interface RecipeListEntryProps {
  recipe: RecipeOverview;
}

export function RecipeListEntry({ recipe }: RecipeListEntryProps) {
  /* TODO maybe some of it should be extracted in reduce to be reused in RecipeView */
  const [menuButton, setMenuButton] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  function goToRecipe(recipeId: string) {
    navigate(`/recipe/${recipeId}`);
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

  return (
    <ListItem
      secondaryAction={
        <>
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
        </>
      }
    >
      <ListItemButton component="a" onClick={() => goToRecipe(recipe.id)}>
        <ListItemAvatar>
          <Avatar alt={recipe.title} src={recipe.image} variant="square" />
        </ListItemAvatar>
        <ListItemText primary={recipe.title} />
      </ListItemButton>
    </ListItem>
  );
}
