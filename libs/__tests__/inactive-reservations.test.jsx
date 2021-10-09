import { inactiveReservations } from "../inactive-reservations.js";

const queue = {
  // keys and submissionUrl will be unique
  1: { submissionUrl: "abc" },
  2: { submissionUrl: "def" },
  3: { submissionUrl: "ghi" },
  4: { submissionUrl: "jkl" },
  5: { submissionUrl: "mno" },
};

const singleInactive = ["abc", "pqr"]
const multipleInactive = ["abc", "pqr", "stu"]

test("it returns items that are in singleInactive but not in queue", () => {
  const actual = inactiveReservations(queue, singleInactive);
  expect(actual).toEqual(["pqr"])
});

test("it returns items that are in multipleInactive but not in queue", () => {
  const actual = inactiveReservations(queue, multipleInactive);
  expect(actual).toEqual(["pqr", "stu"])
});

test("it handles empty queue and empty reserve", () => {
  const actual = inactiveReservations({}, []);
  expect(actual).toEqual([]);
})

test("it handles empty queue", () => {
  const actual = inactiveReservations({}, singleInactive);
  expect(actual).toEqual(singleInactive);
})

test("it handles empty reserve", () => {
  const actual = inactiveReservations(queue, []);
  expect(actual).toEqual([]);
})