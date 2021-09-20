import {
  getComparator,
  descendingComparator,
  stableSort,
} from "../table-sorters";

test("getComparator returns something", () => {
  const c = getComparator(1, 2);
  expect(c).toBeDefined();
});

test("descendingComparator returns something", () => {
  const d = descendingComparator(1, 2);
  expect(d).toBeDefined();
});
