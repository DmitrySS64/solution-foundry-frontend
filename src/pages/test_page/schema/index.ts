import {z} from 'zod';

const testPageSchema = z.object({
    select: z.string(),
})

export {testPageSchema};