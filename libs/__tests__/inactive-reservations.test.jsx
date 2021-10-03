import { inactiveReservations } from "../inactive-reservations.js";

test("inactiveReservations returns single submission", () => {
  const external = ["abc"];
  const internal = ["abc", "def"];
  const expected = ["def"];
  const inactive = inactiveReservations(external, internal);
  expect(inactive).toStrictEqual(expected);
});

test("inactiveReservations returns multiple submissions", () => {
  const external = ["abc"];
  const internal = ["abc", "def", "ghi"];
  const expected = ["def", "ghi"];
  const inactive = inactiveReservations(external, internal);
  expect(inactive).toStrictEqual(expected);
});

test("inactiveReservations returns empty arrays", () => {
  const external = ["abc"];
  const internal = ["abc"];
  const expected = [];
  const inactive = inactiveReservations(external, internal);
  expect(inactive).toStrictEqual(expected);
});

test("inactiveReservations handles empty arrays", () => {
  const external = [];
  const internal = [];
  const expected = [];
  const inactive = inactiveReservations(external, internal);
  expect(inactive).toStrictEqual(expected);
});
