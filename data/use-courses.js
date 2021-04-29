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
    // console.log('useCourses:', props)
    firstPage = props.firstPage;
    canvasUrl = props.canvasUrl;
    apiKey = props.apiKey;
    
    const { data, error, mutate, size, setSize, isValidating } = useSWRInfinite(getKey, coursesFetcher, { initialSize: 10 });

    // const courses = data ? [].concat(...data.map((page) => page.canvasData)) : [];
    // const courses = data ? [].concat(...data.map((page) => page.canvasData.map((course) => { return { id: course.id, code: course.course_code, name: course.name } }))) : { };
    // const courses = data ? data.map((page) => page.canvasData.map((course) => { return { id: course.id, code: course.course_code, name: course.name } })) : { };
    
    let courses = { };
    if (data) data.map((page) => {
        page.canvasData.map((course) => {
            courses[course.id] = {
                code: course.course_code,
                name: course.name
            }
        })
    })

    const courseLoading = !data && !error;
    const courseError = error && error.status === 403;

    if (courses.length === size * 10) setSize(size + 10)

    return {
        courseLoading,
        courseError,
        courses: courses,
        mutateCourses: mutate,
    };
}