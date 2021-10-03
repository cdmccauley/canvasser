import { STATUS } from './constants'

export function statusQueue(queue, reservations) {
    return Object.fromEntries(Object.entries(queue).map(([key, submission]) => [key, {
        ...submission, 
        status: reservations.reserved.includes(submission.submissionUrl) ? 
            STATUS.reserved : 
        reservations.selfReserved.includes(submission.submissionUrl) ? 
            STATUS.selfReserved : 
            STATUS.unreserved
    }]))
}