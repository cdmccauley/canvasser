import React, { useState } from "react";

import {
  Tooltip,
  IconButton,
  Menu,
  ListItem,
  TextField,
} from "@material-ui/core";

import { FilterListRounded } from "@material-ui/icons";

export default function Filter(props) {
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const open = Boolean(filterAnchorEl);

  const handleFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (event) => {
    props.setFilter(event.target.value);
  };

  return (
    <React.Fragment>
      <Tooltip title="Filter" placement="top">
        <IconButton onClick={handleFilterMenu}>
          <FilterListRounded />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={filterAnchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleFilterMenuClose}
      >
        <ListItem>
          <TextField
            fullWidth
            value={props.filter}
            onChange={handleFilterChange}
            variant={"outlined"}
            size={"small"}
            label={"Filter"}
            InputProps={{
              color: "secondary",
            }}
            InputLabelProps={{
              color: "secondary",
            }}
          />
        </ListItem>
      </Menu>
    </React.Fragment>
  );
}
