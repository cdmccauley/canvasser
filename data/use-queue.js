import { useSWRInfinite } from "swr";

import queueFetcher from "../libs/api-queue";

const urlParameters =
  "student_ids[]=all&include[]=assignment&workflow_state[]=submitted&workflow_state[]=pending_review&enrollment_state=active";
let canvasUrl, apiKey, courses;

const getKey = (pageIndex, previousPageData) => {
  if (!courses[pageIndex]) return null; // need to fix the cause of this
  if (courses.length === 0) return null;
  if (pageIndex > courses.length) return null;
  if (previousPageData && previousPageData.next)
    return `${previousPageData.next}&access_token=${apiKey}`;
  if (courses.length === 1)
    return `${canvasUrl}/api/v1/courses/${courses[0]}/students/submissions?${urlParameters}&access_token=${apiKey}`;
  return `${canvasUrl}/api/v1/courses/${courses[pageIndex]}/students/submissions?${urlParameters}&access_token=${apiKey}`;
};

const getPriority = (submission, priorities) => {
  let priority = priorities.length + 1;
  // create reversed copy to set priorities from lowest to highest
  priorities
    .slice(0)
    .reverse()
    .map((level) => {
      level.map((name) => {
        if (submission.toLowerCase().includes(name.toLowerCase()))
          priority = priorities.indexOf(level) + 1;
      });
    });
  return priority;
};

export default function useQueue(props) {
  canvasUrl = props.canvasUrl;
  apiKey = props.apiKey;
  courses = props.courses
    ? Object.keys(props.courses).filter(
        (courseId) => props.courses[courseId].active
      )
    : null;

  const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    queueFetcher,
    {
      initialSize: courses ? courses.length : 0,
      revalidateAll: true,
      refreshInterval: props.refreshRate * 1000,
      revalidateOnFocus: false,
      refreshWhenHidden: true,
    }
  );

  let queue = null;
  if (error) {
    console.log("/data/use-queue.useQueue error");
    if (error.name) console.log("error.name", error.name);
    if (error.status) console.log("error.status", error.status);
    if (error.message) console.log("error.message", error.message);
    if (error.info) console.log("error.info", error.info);
    if (data) console.log("useQueue data", data)
    props.setError(true);
  }
  if (data) {
    queue = {};
    data.map((page) => {
      page.canvasData.map((submission) => {
        queue[submission.id] = {
          id: submission.id,
          courseId: submission.assignment.course_id,
          courseName: props.courses[submission.assignment.course_id].name,
          assignmentId: submission.assignment_id,
          assignmentName: submission.assignment.name,
          userId: submission.user_id,
          userUrl: `${canvasUrl}/courses/${submission.assignment.course_id}/grades/${submission.user_id}`,
          submittedAt: new Date(submission.submitted_at),
          submissionUrl: `${canvasUrl}/courses/${submission.assignment.course_id}/gradebook/speed_grader?assignment_id=${submission.assignment_id}&student_id=${submission.user_id}`,
          priority: getPriority(
            `${props.courses[submission.assignment.course_id].name} ${
              submission.assignment.name
            }`,
            props.priorities
          ),
        };
      });
    });
  }

  const queueLoading = !data && !error;
  const queueError = error;

  return {
    queueLoading,
    queueError,
    queue: queue,
    mutateQueue: mutate,
  };
}
