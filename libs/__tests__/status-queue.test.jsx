import { statusQueue } from '../status-queue'
import { STATUS } from '../constants'

test('statusQueue assigns statuses', () => {
    const queue = { 
        sub1: { submissionUrl: 'abc' }, 
        sub2: { submissionUrl: 'def' },
        sub3: { submissionUrl: 'ghi' }
    }
    const reserved = {
        reserved: ['abc'],
        selfReserved: ['def']
    }
    const expected = { 
        sub1: {  submissionUrl: 'abc', status: STATUS.reserved }, 
        sub2: { submissionUrl: 'def', status: STATUS.selfReserved },
        sub3: { submissionUrl: 'ghi', status: STATUS.unreserved }
    }
    const result = statusQueue(queue, reserved)
    expect(result).toStrictEqual(expected)
});

test('statusQueue handles empty queue', () => {
    const queue = { }
    const reserved = {
        reserved: ['abc'],
        selfReserved: ['def']
    }
    const expected = { }
    const result = statusQueue(queue, reserved)
    expect(result).toStrictEqual(expected)
});

test('statusQueue handles empty reserve', () => {
    const queue = { 
        sub1: { submissionUrl: 'abc' }, 
        sub2: { submissionUrl: 'def' },
        sub3: { submissionUrl: 'ghi' }
    }
    const reserved = {
        reserved: [],
        selfReserved: []
    }
    const expected = { 
        sub1: {  submissionUrl: 'abc', status: STATUS.unreserved }, 
        sub2: { submissionUrl: 'def', status: STATUS.unreserved },
        sub3: { submissionUrl: 'ghi', status: STATUS.unreserved }
    }
    const result = statusQueue(queue, reserved)
    expect(result).toStrictEqual(expected)
});

test('statusQueue handles empty arguments', () => {
    const queue = { }
    const reserved = { }
    const expected = { }
    const result = statusQueue(queue, reserved)
    expect(result).toStrictEqual(expected)
});