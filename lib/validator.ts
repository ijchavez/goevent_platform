import { z } from "zod"

export const eventFormSchema = z.object({
    title: z.string().min(3, {
      message: "Title must be at least 3 characters.",
    }),
    description: z.string().max(400, {
        message: "Title must be less than 400 characters.",
    }),
    location: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }).max(400, {
        message: "Title must be less than 400 characters.",
    }),
    imageUrl: z.string().min(1 , {
        message: "Image URL is required.",
      }),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string().refine(value => value !== '', {
        message: "Category is required",
    }),
    price: z.string().min(1 , {
        message: "Price is required.",
      }),
    isFree: z.boolean(),
    url: z.string().url()
  })