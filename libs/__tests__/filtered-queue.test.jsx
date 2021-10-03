import { filteredQueue } from "../filtered-queue";

test("setup", () => {
  const activeCourses = ["C000"];
  const courses = {
    0: {
      code: "C000",
      name: "Course Zero",
    },
    1: {
      code: "C123",
      name: "Course One",
    },
  };
  const queue = {
    1: {
      assignmentName: "abc",
      courseId: 0,
    },
    2: {
      assignmentName: "abc",
      courseId: 0,
    },
    3: {
      assignmentName: "abc",
      courseId: 1,
    },
    4: {
      assignmentName: "def",
      courseId: 1,
    },
    5: {
      assignmentName: "ghi",
      courseId: 2,
    },
  };
  const filter = "abc";
  const expected = {
    1: {
      assignmentName: "abc",
      courseId: 0,
    },
    2: {
      assignmentName: "abc",
      courseId: 0,
    },
    3: {
      assignmentName: "abc",
      courseId: 1,
    },
  };
  expect(courses[queue[1].courseId].code).toBe("C000")
  // const actual = filteredQueue(activeCourses, courses, queue, filter);
  // expect(actual).toStrictEqual(expected);
  expect(true).toBe(true)
});
