import { Delete, MoreVert, Share, Star } from "@mui/icons-material";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import type { Recipe } from "../../models/recipe";
import { useState } from "react";
import { deleteRecipe } from "../../stores/recipeSlice";
import { useAppDispatch } from "../../hooks";
import { useNavigate } from "react-router";

interface RecipeActionsMenuProps {
  recipe: Recipe;
  redirectAfterDelete?: boolean;
}

export function RecipeActionsMenu({
  recipe,
  redirectAfterDelete,
}: RecipeActionsMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuButton, setMenuButton] = useState<null | HTMLElement>(null);

  function openMenu(event: React.MouseEvent<HTMLElement>) {
    setMenuButton(event.currentTarget);
  }

  function closeMenu() {
    setMenuButton(null);
  }

  function toggleFavorite() {
    closeMenu();
  }

  function shareRecipe() {
    closeMenu();
  }

  async function deleteCurrentRecipe() {
    await dispatch(deleteRecipe(recipe.id));
    closeMenu();
    if (redirectAfterDelete) {
      navigate("/");
    }
  }

  return (
    <>
      <IconButton
        aria-label="More actions"
        id={`moreButton${recipe.id}`}
        aria-controls={menuButton ? `moreMenu${recipe.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={menuButton ? "true" : "false"}
        onClick={openMenu}
        data-test="recipe-actions-menu-button"
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
        <MenuItem onClick={deleteCurrentRecipe}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
