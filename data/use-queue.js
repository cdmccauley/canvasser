import { useSWRInfinite } from "swr";
import { useState } from 'react'

import queueFetcher from "../libs/api-queue";

const urlParameters = "student_ids[]=all&include[]=assignment&workflow_state[]=submitted&workflow_state[]=pending_review&enrollment_state=active";
let canvasUrl, apiKey, courses;

const getKey = (pageIndex, previousPageData) => {
    if (pageIndex > courses.length) return null
    return `${canvasUrl}/api/v1/courses/${courses[pageIndex]}/students/submissions?${urlParameters}&access_token=${apiKey}`
}

const getPriority = (submission, priorities) => {
    let priority = priorities.length + 1;
    priorities.map((level) => {
        level.map((name) => {
            if (submission.assignment.name.toLowerCase().includes(name.toLowerCase())) priority = priorities.indexOf(level) + 1;
        })
    })
    return priority;
}

export default function useQueue(props) {
    // console.log('useQueue:', props)
    canvasUrl = props.canvasUrl;
    apiKey = props.apiKey;
    courses = Object.keys(props.courses);

    const [priorities, setPriorities] = useState([
            ['meeting', 'cisco', 'course completion'],
            ['pacific', ' ace ']
        ])

    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(getKey, queueFetcher, { initialSize: courses.length });

    let queue = { };
    data ? data.map((page) => {
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
                priority: getPriority(submission, priorities)
            }
        })
    }) : { }

    const queueLoading = !data && !error;
    const queueError = error && error.status === 403;

    return {
        queueLoading,
        queueError,
        queue: queue,
        mutateQueue: mutate,
    };
}