import { filteredQueue } from "../filtered-queue";

// user only has one active course
const oneActiveCourse = ["C000"];
const allActiveCourses = ["C000", "C123", "C456"];
const courses = {
  0: {
    code: "C000",
    name: "Course Zero",
  },
  1: {
    code: "C123",
    name: "Course One",
  },
  2: {
    code: "C456",
    name: "Course Two",
  },
};
const queue = {
  // keys will be unique numbers
  // 1 and 2 assignmentName matches filter and course is in the oneActiveCourse array
  1: {
    assignmentName: "zabc",
    courseId: 0,
  },
  2: {
    assignmentName: "abcz",
    courseId: 0,
  },
  // 3 assignmentName matches filter exactly but course is not in the oneActiveCourse array
  3: {
    assignmentName: "abc",
    courseId: 1,
  },
  // 4 assignmentName doesn't match and in a course that has a matching assignment
  4: {
    assignmentName: "def",
    courseId: 1,
  },
  // 5 assignmentName doesn't match and in a course that has no other assignments
  5: {
    assignmentName: "ghi",
    courseId: 2,
  },
};
const filter = "abc";
const expected = {
  1: {
    assignmentName: "zabc",
    courseId: 0,
  },
  2: {
    assignmentName: "abcz",
    courseId: 0,
  },
};

test("filteredQueue returns filter matches in selected courses", () => {
  const actual = filteredQueue(oneActiveCourse, courses, queue, filter);
  expect(actual).toEqual(expected);
});

test("filteredQueue returns the entire queue", () => {
  const undefinedActual = filteredQueue(
    allActiveCourses,
    courses,
    queue,
    undefined
  );
  expect(undefinedActual).toEqual(queue);
  const nullActual = filteredQueue(allActiveCourses, courses, queue, null);
  expect(nullActual).toEqual(queue);
  const allActual = filteredQueue(allActiveCourses, courses, queue, "");
  expect(allActual).toEqual(queue);
});
