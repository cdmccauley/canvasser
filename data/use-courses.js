import { useSWRInfinite } from "swr";

import coursesFetcher from "../libs/api-courses.js";

let firstPage;
let canvasUrl;
let apiKey;

const getKey = (pageIndex, previousPageData) => {
    if (!canvasUrl || !apiKey) return null
    if (previousPageData && !previousPageData.next) return null
    if (pageIndex === 0) return `${canvasUrl}/api/v1/courses?enrollment_type=teacher&access_token=${apiKey}`
    return `${previousPageData.next}&access_token=${apiKey}`
}

export default function useCourses(props) {
    firstPage = props.firstPage;
    canvasUrl = props.canvasUrl;
    apiKey = props.apiKey;
    
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(getKey, coursesFetcher, { initialSize: 10 });
    let courses = { };
    if (!error && data) data.map((page) => {
        page.canvasData.map((course) => {
            courses[course.id] = {
                code: course.course_code,
                name: course.name,
                active: !props.activeCourses ? true : props.activeCourses.includes(course.course_code) ? true : false
            }
        })
    })

    const courseLoading = !data && !error;
    const courseError = error;

    if (courses.length === size * 10) setSize(size + 10)

    return {
        courseLoading,
        courseError,
        courses: courses,
        mutateCourses: mutate,
    };
}