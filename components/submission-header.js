import React from "react";

import {
  TableHead,
  TableSortLabel,
  TableRow,
  TableCell,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function SubmissionHeader(props) {
  // id should be name of object property for sorting
  const sortCells = [
    { id: "priority", label: "Priority" },
    { id: "assignmentName", label: "Assignment" },
    { id: "courseName", label: "Course" },
    { id: "submittedAt", label: "Submitted" },
  ];

  const classes = useStyles();

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = props.orderBy === property && props.order === "asc";
    props.setOrder(isAsc ? "desc" : "asc");
    props.setOrderBy(property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>Status</TableCell>
        {sortCells.map((sortCell) => (
          <TableCell
            key={sortCell.id}
            sortDirection={props.orderBy === sortCell.id ? props.order : false}
          >
            <TableSortLabel
              active={props.orderBy === sortCell.id}
              direction={props.orderBy === sortCell.id ? props.order : "asc"}
              onClick={createSortHandler(sortCell.id)}
            >
              {sortCell.label}
              {props.orderBy === sortCell.id ? (
                <span className={classes.visuallyHidden}>
                  {props.order === "desc"
                    ? "sorted descending"
                    : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
