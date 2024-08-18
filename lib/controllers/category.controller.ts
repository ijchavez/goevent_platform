import { Request, Response } from 'express'
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from '@/lib/actions/category.actions'
import { handleError } from '@/lib/utils'

// Crear una categoría
export const createCategoryController = async (req: Request, res: Response) => {
  const { categoryName } = req.body

  if (!categoryName) {
    return res.status(400).json({ message: 'Category name is required' })
  }

  try {
    const result = await createCategory({ categoryName })
    res.status(201).json(result)
  } catch (error) {
    handleError(error)
    res
      .status(500)
      .json({ message: 'An error occurred while creating the category' })
  }
}

// Obtener todas las categorías
export const getAllCategoriesController = async (_: Request, res: Response) => {
  try {
    const result = await getAllCategories()
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ error: 'Error fetching categories' })
  }
}

// Obtener una categoría por ID
export const getCategoryByIdController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getCategoryById(req.params.id)
    if (!result) return res.status(404).json({ error: 'Category not found' })
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ error: 'Error fetching category' })
  }
}

// Actualizar una categoría
export const updateCategoryController = async (req: Request, res: Response) => {
  try {
    const result = await updateCategory(req.params.id, {
      categoryName: req.body.categoryName,
    })
    if (!result) return res.status(404).json({ error: 'Category not found' })
    res.json(result)
  } catch (error) {
    handleError(error)
    res.status(500).json({ error: 'Error updating category' })
  }
}

// Eliminar una categoría
export const deleteCategoryController = async (req: Request, res: Response) => {
  try {
    await deleteCategory(req.params.id)
    res.status(204).send()
  } catch (error) {
    handleError(error)
    res.status(500).json({ error: 'Error deleting category' })
  }
}
