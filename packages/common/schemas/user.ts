import { z } from 'zod';

export const personalInfoSchema = z.object({
  dob: z.string(),              
  maritalStatus: z.string(),   
  motherName: z.string().optional(),
  fatherName: z.string().optional(),
  education: z.string().optional(),
});