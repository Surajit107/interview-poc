import React from 'react';
import {
    AlertTriangle,
    Trash2,
    Edit,
    Package,
    X,
    Check,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

/**
 * Props for the ConfirmationModal component
 */
export interface ConfirmationModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Callback when action is confirmed */
    onConfirm: () => void;
    /** Modal title */
    title: string;
    /** Modal description */
    description: string;
    /** Text for the confirm button */
    confirmText?: string;
    /** Text for the cancel button */
    cancelText?: string;
    /** Visual variant of the modal */
    variant?: 'danger' | 'warning' | 'info' | 'success';
    /** Custom icon to display */
    icon?: React.ReactNode;
    /** Whether the modal is in loading state */
    isLoading?: boolean;
    /** Variant for the confirm button */
    confirmButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

/**
 * Get styles based on the modal variant
 */
const getVariantStyles = (variant: ConfirmationModalProps['variant']) => {
    switch (variant) {
        case 'danger':
            return {
                icon: <Trash2 className="h-6 w-6 text-red-600" />,
                buttonVariant: 'destructive' as const,
                iconBg: 'bg-red-100',
                iconColor: 'text-red-600'
            };
        case 'warning':
            return {
                icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
                buttonVariant: 'default' as const,
                iconBg: 'bg-yellow-100',
                iconColor: 'text-yellow-600'
            };
        case 'info':
            return {
                icon: <Info className="h-6 w-6 text-blue-600" />,
                buttonVariant: 'default' as const,
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600'
            };
        case 'success':
            return {
                icon: <Check className="h-6 w-6 text-green-600" />,
                buttonVariant: 'default' as const,
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600'
            };
        default:
            return {
                icon: <AlertTriangle className="h-6 w-6 text-gray-600" />,
                buttonVariant: 'default' as const,
                iconBg: 'bg-gray-100',
                iconColor: 'text-gray-600'
            };
    }
};

/**
 * Dynamic confirmation modal component
 * 
 * @example
 * ```tsx
 * // For delete actions
 * <ConfirmationModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onConfirm={handleDelete}
 *   title="Delete Product"
 *   description={`Are you sure you want to delete ${productName}? This action cannot be undone.`}
 *   variant="danger"
 *   confirmText="Delete"
 *   isLoading={isDeleting}
 * />
 * 
 * // For update actions
 * <ConfirmationModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onConfirm={handleUpdate}
 *   title="Update Product"
 *   description="Are you sure you want to update this product?"
 *   variant="warning"
 *   confirmText="Update"
 *   isLoading={isUpdating}
 * />
 * 
 * // For restock actions
 * <ConfirmationModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onConfirm={handleRestock}
 *   title="Update Stock"
 *   description={`Update stock for ${productName} from ${currentStock} to ${newStock}?`}
 *   variant="info"
 *   confirmText="Restock"
 *   icon={<Package className="h-6 w-6 text-blue-600" />}
 *   isLoading={isRestocking}
 * />
 * ```
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'warning',
    icon,
    isLoading = false,
    confirmButtonVariant
}) => {
    const variantStyles = getVariantStyles(variant);
    const finalIcon = icon || variantStyles.icon;
    const finalButtonVariant = confirmButtonVariant || variantStyles.buttonVariant;

    const handleConfirm = () => {
        if (!isLoading) {
            onConfirm();
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${variantStyles.iconBg}`}>
                            {finalIcon}
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-lg font-semibold">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-gray-600 mt-1">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="flex gap-2 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="min-w-[80px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={finalButtonVariant}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="min-w-[80px]"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                {confirmText}
                            </div>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
