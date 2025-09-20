'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import {
    Plus,
    Upload,
    X,
    Package,
    DollarSign,
    AlertTriangle,
    CheckCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MicroLoading } from '@/components/ui/micro-loading';
import { PRODUCT_CATEGORIES, FILE_UPLOAD, VALIDATION_RULES } from '@/constants';
import { ProductInput } from '../types';

// Advanced Product Schema with comprehensive validation
const addProductSchema = z.object({
    name: z.string()
        .min(2, 'Product name must be at least 2 characters')
        .max(100, 'Product name must be less than 100 characters')
        .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Product name contains invalid characters'),

    sku: z.string()
        .min(3, 'SKU must be at least 3 characters')
        .max(20, 'SKU must be less than 20 characters')
        .regex(VALIDATION_RULES.SKU_PATTERN, 'SKU must contain only uppercase letters, numbers, and hyphens'),

    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters')
        .optional(),

    price: z.number()
        .positive('Price must be positive')
        .min(0.01, 'Price must be at least $0.01')
        .max(999999.99, 'Price cannot exceed $999,999.99'),

    costPrice: z.number()
        .positive('Cost price must be positive')
        .min(0.01, 'Cost price must be at least $0.01')
        .max(999999.99, 'Cost price cannot exceed $999,999.99')
        .optional(),

    category: z.string()
        .min(1, 'Please select a category'),

    subcategory: z.string()
        .min(1, 'Please select a subcategory')
        .optional(),

    brand: z.string()
        .min(1, 'Brand is required')
        .max(50, 'Brand name must be less than 50 characters')
        .optional(),

    model: z.string()
        .max(50, 'Model name must be less than 50 characters')
        .optional(),

    weight: z.number()
        .positive('Weight must be positive')
        .min(0.01, 'Weight must be at least 0.01')
        .max(1000, 'Weight cannot exceed 1000 kg')
        .optional(),

    dimensions: z.object({
        length: z.number().positive().min(0.01).max(1000).optional(),
        width: z.number().positive().min(0.01).max(1000).optional(),
        height: z.number().positive().min(0.01).max(1000).optional(),
    }).optional(),

    stockQuantity: z.number()
        .int('Stock quantity must be a whole number')
        .min(0, 'Stock quantity cannot be negative')
        .max(999999, 'Stock quantity cannot exceed 999,999'),

    lowStockThreshold: z.number()
        .int('Low stock threshold must be a whole number')
        .min(0, 'Low stock threshold cannot be negative')
        .max(999999, 'Low stock threshold cannot exceed 999,999'),

    reorderPoint: z.number()
        .int('Reorder point must be a whole number')
        .min(0, 'Reorder point cannot be negative')
        .max(999999, 'Reorder point cannot exceed 999,999')
        .optional(),

    maxStockLevel: z.number()
        .int('Max stock level must be a whole number')
        .min(1, 'Max stock level must be at least 1')
        .max(999999, 'Max stock level cannot exceed 999,999')
        .optional(),

    isActive: z.boolean(),
    isFeatured: z.boolean().optional(),
    isOnSale: z.boolean().optional(),

    salePrice: z.number()
        .positive('Sale price must be positive')
        .min(0.01, 'Sale price must be at least $0.01')
        .max(999999.99, 'Sale price cannot exceed $999,999.99')
        .optional(),

    saleStartDate: z.string().optional(),
    saleEndDate: z.string().optional(),

    tags: z.array(z.string())
        .max(10, 'Maximum 10 tags allowed')
        .optional(),

    imageUrl: z.string().url('Invalid image URL').optional(),

    // Additional fields
    warranty: z.string().max(100, 'Warranty description must be less than 100 characters').optional(),
    returnPolicy: z.string().max(200, 'Return policy must be less than 200 characters').optional(),
    shippingWeight: z.number().positive().min(0.01).max(1000).optional(),
    isDigital: z.boolean().optional(),
    downloadUrl: z.string().url('Invalid download URL').optional(),
    fileSize: z.number().positive().min(0.01).max(1000).optional(),

    // SEO fields
    metaTitle: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
    metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
    metaKeywords: z.string().max(200, 'Meta keywords must be less than 200 characters').optional(),

    // Supplier information
    supplierName: z.string().max(100, 'Supplier name must be less than 100 characters').optional(),
    supplierEmail: z.string().email('Invalid supplier email').optional(),
    supplierPhone: z.string().max(20, 'Supplier phone must be less than 20 characters').optional(),

    // Tax and compliance
    taxRate: z.number().min(0).max(100).optional(),
    isTaxable: z.boolean().optional(),
    barcode: z.string().max(50, 'Barcode must be less than 50 characters').optional(),
    upc: z.string().max(13, 'UPC must be exactly 13 digits').optional(),
    ean: z.string().max(13, 'EAN must be exactly 13 digits').optional(),

}).refine((data) => {
    // Custom validation: Sale price should be less than regular price
    if (data.salePrice && data.price && data.salePrice >= data.price) {
        return false;
    }
    return true;
}, {
    message: 'Sale price must be less than regular price',
    path: ['salePrice'],
}).refine((data) => {
    // Custom validation: Sale dates should be valid
    if (data.saleStartDate && data.saleEndDate) {
        const startDate = new Date(data.saleStartDate);
        const endDate = new Date(data.saleEndDate);
        return endDate > startDate;
    }
    return true;
}, {
    message: 'Sale end date must be after start date',
    path: ['saleEndDate'],
}).refine((data) => {
    // Custom validation: Low stock threshold should be less than stock quantity
    if (data.lowStockThreshold >= data.stockQuantity) {
        return false;
    }
    return true;
}, {
    message: 'Low stock threshold should be less than current stock quantity',
    path: ['lowStockThreshold'],
});

type AddProductFormData = z.infer<typeof addProductSchema>;

interface AddProductFormProps {
    onSubmit: (data: ProductInput) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function AddProductForm({ onSubmit, onCancel, isLoading = false }: AddProductFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        trigger,
        reset,
    } = useForm<AddProductFormData>({
        resolver: zodResolver(addProductSchema),
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            price: 0,
            costPrice: 0,
            category: '',
            subcategory: '',
            brand: '',
            model: '',
            weight: 0,
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
            },
            stockQuantity: 0,
            lowStockThreshold: 5,
            reorderPoint: 10,
            maxStockLevel: 100,
            isActive: true,
            isFeatured: false,
            isOnSale: false,
            salePrice: 0,
            saleStartDate: '',
            saleEndDate: '',
            tags: [],
            imageUrl: '',
            warranty: '',
            returnPolicy: '',
            shippingWeight: 0,
            isDigital: false,
            downloadUrl: '',
            fileSize: 0,
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            supplierName: '',
            supplierEmail: '',
            supplierPhone: '',
            taxRate: 0,
            isTaxable: true,
            barcode: '',
            upc: '',
            ean: '',
        },
        mode: 'onChange',
    });

    const watchedValues = watch();

    // File upload handling
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter(file => {
            if (file.size > FILE_UPLOAD.MAX_SIZE) {
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                return false;
            }
            if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type as 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/gif')) {
                alert(`File ${file.name} is not a valid image type.`);
                return false;
            }
            return true;
        });

        const newImages = [...images, ...validFiles];
        setImages(newImages);

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    }, [images, imagePreviews]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': FILE_UPLOAD.ALLOWED_EXTENSIONS
        },
        maxFiles: 5,
        maxSize: FILE_UPLOAD.MAX_SIZE,
    });

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImages(newImages);
        setImagePreviews(newPreviews);
    };

    // Tag management
    const addTag = () => {
        if (newTag.trim() && watchedValues.tags && watchedValues.tags.length < 10) {
            setValue('tags', [...(watchedValues.tags || []), newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        const updatedTags = watchedValues.tags?.filter(tag => tag !== tagToRemove) || [];
        setValue('tags', updatedTags);
    };

    const handleFormSubmit = async (data: AddProductFormData) => {
        try {
            setUploadProgress(0);

            // Simulate file upload progress
            if (images.length > 0) {
                for (let i = 0; i <= 100; i += 10) {
                    setUploadProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }

            // Transform data to ProductInput format
            const productInput: ProductInput = {
                name: data.name,
                description: data.description,
                price: data.price,
                category: data.category,
                imageUrl: data.imageUrl,
                stockQuantity: data.stockQuantity,
                lowStockThreshold: data.lowStockThreshold,
                isActive: data.isActive,
            };

            await onSubmit(productInput);
            reset();
            setImages([]);
            setImagePreviews([]);
            setCurrentStep(1);
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    const nextStep = async () => {
        const isStepValid = await trigger();
        if (isStepValid) {
            setCurrentStep(Math.min(currentStep + 1, totalSteps));
        }
    };

    const prevStep = () => {
        setCurrentStep(Math.max(currentStep - 1, 1));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter product name"
                                    {...register('name')}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku">SKU *</Label>
                                <Input
                                    id="sku"
                                    placeholder="e.g., PROD-001"
                                    {...register('sku')}
                                    className={errors.sku ? 'border-red-500' : ''}
                                />
                                {errors.sku && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.sku.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select onValueChange={(value) => setValue('category', value)}>
                                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRODUCT_CATEGORIES.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.category.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input
                                    id="brand"
                                    placeholder="Enter brand name"
                                    {...register('brand')}
                                    className={errors.brand ? 'border-red-500' : ''}
                                />
                                {errors.brand && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.brand.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter product description"
                                rows={4}
                                {...register('description')}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('price', { valueAsNumber: true })}
                                        className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.price && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="costPrice">Cost Price</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="costPrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('costPrice', { valueAsNumber: true })}
                                        className={`pl-10 ${errors.costPrice ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.costPrice && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.costPrice.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salePrice">Sale Price</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        id="salePrice"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('salePrice', { valueAsNumber: true })}
                                        className={`pl-10 ${errors.salePrice ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.salePrice && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.salePrice.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                                <Input
                                    id="stockQuantity"
                                    type="number"
                                    placeholder="0"
                                    {...register('stockQuantity', { valueAsNumber: true })}
                                    className={errors.stockQuantity ? 'border-red-500' : ''}
                                />
                                {errors.stockQuantity && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.stockQuantity.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lowStockThreshold">Low Stock Threshold *</Label>
                                <Input
                                    id="lowStockThreshold"
                                    type="number"
                                    placeholder="5"
                                    {...register('lowStockThreshold', { valueAsNumber: true })}
                                    className={errors.lowStockThreshold ? 'border-red-500' : ''}
                                />
                                {errors.lowStockThreshold && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.lowStockThreshold.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reorderPoint">Reorder Point</Label>
                                <Input
                                    id="reorderPoint"
                                    type="number"
                                    placeholder="10"
                                    {...register('reorderPoint', { valueAsNumber: true })}
                                    className={errors.reorderPoint ? 'border-red-500' : ''}
                                />
                                {errors.reorderPoint && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.reorderPoint.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isActive"
                                    checked={watchedValues.isActive}
                                    onCheckedChange={(checked) => setValue('isActive', checked)}
                                />
                                <Label htmlFor="isActive">Active Product</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isFeatured"
                                    checked={watchedValues.isFeatured}
                                    onCheckedChange={(checked) => setValue('isFeatured', checked)}
                                />
                                <Label htmlFor="isFeatured">Featured Product</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isOnSale"
                                    checked={watchedValues.isOnSale}
                                    onCheckedChange={(checked) => setValue('isOnSale', checked)}
                                />
                                <Label htmlFor="isOnSale">On Sale</Label>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Label>Product Images</Label>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                    {isDragActive
                                        ? 'Drop the files here...'
                                        : 'Drag & drop images here, or click to select files'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Maximum 5 files, 5MB each. Supported: JPG, PNG, GIF
                                </p>
                            </div>

                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <Progress value={uploadProgress} className="w-full" />
                                </div>
                            )}

                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label>Tags</Label>
                            <div className="flex gap-2 flex-wrap">
                                {watchedValues.tags?.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    placeholder="Add a tag"
                                    className="flex-1"
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag} disabled={!newTag.trim() || (watchedValues.tags?.length || 0) >= 10}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                {...register('imageUrl')}
                                className={errors.imageUrl ? 'border-red-500' : ''}
                            />
                            {errors.imageUrl && (
                                <p className="text-sm text-red-600 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    {errors.imageUrl.message}
                                </p>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('weight', { valueAsNumber: true })}
                                    className={errors.weight ? 'border-red-500' : ''}
                                />
                                {errors.weight && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.weight.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shippingWeight">Shipping Weight (kg)</Label>
                                <Input
                                    id="shippingWeight"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('shippingWeight', { valueAsNumber: true })}
                                    className={errors.shippingWeight ? 'border-red-500' : ''}
                                />
                                {errors.shippingWeight && (
                                    <p className="text-sm text-red-600 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {errors.shippingWeight.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>Dimensions (cm)</Label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="length">Length</Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('dimensions.length', { valueAsNumber: true })}
                                        className={errors.dimensions?.length ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="width">Width</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('dimensions.width', { valueAsNumber: true })}
                                        className={errors.dimensions?.width ? 'border-red-500' : ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="height">Height</Label>
                                    <Input
                                        id="height"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register('dimensions.height', { valueAsNumber: true })}
                                        className={errors.dimensions?.height ? 'border-red-500' : ''}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="isDigital"
                                    checked={watchedValues.isDigital}
                                    onCheckedChange={(checked) => setValue('isDigital', checked)}
                                />
                                <Label htmlFor="isDigital">Digital Product</Label>
                            </div>

                            {watchedValues.isDigital && (
                                <div className="space-y-4 pl-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="downloadUrl">Download URL</Label>
                                        <Input
                                            id="downloadUrl"
                                            type="url"
                                            placeholder="https://example.com/download"
                                            {...register('downloadUrl')}
                                            className={errors.downloadUrl ? 'border-red-500' : ''}
                                        />
                                        {errors.downloadUrl && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                {errors.downloadUrl.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fileSize">File Size (MB)</Label>
                                        <Input
                                            id="fileSize"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...register('fileSize', { valueAsNumber: true })}
                                            className={errors.fileSize ? 'border-red-500' : ''}
                                        />
                                        {errors.fileSize && (
                                            <p className="text-sm text-red-600 flex items-center gap-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                {errors.fileSize.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label>SEO Information</Label>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle">Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        placeholder="SEO optimized title"
                                        {...register('metaTitle')}
                                        className={errors.metaTitle ? 'border-red-500' : ''}
                                    />
                                    {errors.metaTitle && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors.metaTitle.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        placeholder="SEO optimized description"
                                        rows={3}
                                        {...register('metaDescription')}
                                        className={errors.metaDescription ? 'border-red-500' : ''}
                                    />
                                    {errors.metaDescription && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors.metaDescription.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                                    <Input
                                        id="metaKeywords"
                                        placeholder="keyword1, keyword2, keyword3"
                                        {...register('metaKeywords')}
                                        className={errors.metaKeywords ? 'border-red-500' : ''}
                                    />
                                    {errors.metaKeywords && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertTriangle className="w-4 h-4" />
                                            {errors.metaKeywords.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Add New Product
                </CardTitle>
                <CardDescription>
                    Create a new product with comprehensive details and advanced features
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Step {currentStep} of {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                </div>

                {/* Step Indicators */}
                <div className="flex justify-between">
                    {[1, 2, 3, 4].map((step) => (
                        <div
                            key={step}
                            className={`flex items-center gap-2 ${step <= currentStep ? 'text-blue-600' : 'text-gray-400'
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                            </div>
                            <span className="hidden sm:inline">
                                {step === 1 && 'Basic Info'}
                                {step === 2 && 'Pricing & Stock'}
                                {step === 3 && 'Media & Tags'}
                                {step === 4 && 'Advanced'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                        >
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            {currentStep < totalSteps ? (
                                <Button type="button" onClick={nextStep} disabled={!isValid}>
                                    Next
                                </Button>
                            ) : (
                                <>
                                    <Button type="button" variant="outline" onClick={onCancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isLoading || !isValid}>
                                        {isLoading ? (
                                            <MicroLoading className="w-4 h-4" />
                                        ) : (
                                            <Plus className="w-4 h-4" />
                                        )}
                                        Create Product
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
