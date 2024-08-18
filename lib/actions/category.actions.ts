'use server'

import { CreateCategoryParams } from '@/types'
import { handleError } from '../utils'
import { connectToDatabase } from '../database'
import Category from '../database/models/category.model'

export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDatabase()

    const newCategory = await Category.create({ name: categoryName })

    return JSON.parse(JSON.stringify(newCategory))
  } catch (error) {
    handleError(error)
  }
}

export const getAllCategories = async () => {
  try {
    await connectToDatabase()

    const categories = await Category.find()

    return JSON.parse(JSON.stringify(categories))
  } catch (error) {
    handleError(error)
  }
}
// Obtener una categoría por ID
export const getCategoryById = async (categoryId: string) => {
  try {
    await connectToDatabase()
    return await Category.findById(categoryId)
  } catch (error) {
    handleError(error)
  }
}

// Actualizar una categoría por ID
export const updateCategory = async (
  categoryId: string,
  { categoryName }: { categoryName: string },
) => {
  try {
    await connectToDatabase()
    return await Category.findByIdAndUpdate(
      categoryId,
      { name: categoryName },
      { new: true },
    )
  } catch (error) {
    handleError(error)
  }
}

// Eliminar una categoría por ID
export const deleteCategory = async (categoryId: string) => {
  try {
    await connectToDatabase()
    await Category.findByIdAndDelete(categoryId)
  } catch (error) {
    handleError(error)
  }
}
