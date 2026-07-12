import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: errors.array(),
        });
    }

    next();
}

// Create Product
export const createProductValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("gender")
        .notEmpty()
        .withMessage("Gender is required")
        .isIn(["Men", "Women", "Unisex"])
        .withMessage("Invalid gender"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required"),

    validateRequest,
];

// Add Variant
export const addProductVariantValidator = [
    body("color")
        .trim()
        .notEmpty()
        .withMessage("Color is required"),

    body("size")
        .notEmpty()
        .withMessage("Size is required")
        .isIn(["XS", "S", "M", "L", "XL", "XXL"])
        .withMessage("Invalid size"),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be 0 or greater"),

    body("priceAmount")
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 0"),

    validateRequest,
];