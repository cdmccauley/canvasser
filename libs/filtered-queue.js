export function filteredQueue(activeCourses, courses, queue, filter) {
  return Object.fromEntries(
    Object.entries(queue).filter(
      ([key, submission]) =>
        activeCourses.includes(courses[submission.courseId].code) &&
        `${submission.assignmentName} ${courses[submission.courseId].name}`
          .toLowerCase()
          .includes(filter.toLowerCase())
    )
  );
}
