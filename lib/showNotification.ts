import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";
type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

interface ToastOptions {
	type: ToastType;
	message: string;
	duration?: number; // Optional duration in milliseconds
	position?: ToastPosition;
	description?: string;
	action?: {
		label: string;
		onClick: () => void;
	};
}

export const showToast = ({ 
	type, 
	message, 
	duration = 4000, 
	position = "top-right",
	description,
	action 
}: ToastOptions) => {
	const baseOptions = {
		duration,
		position: position as any,
		description,
		action: action ? {
			label: action.label,
			onClick: action.onClick,
		} : undefined,
	};

	// Call the appropriate toast function based on the type
	switch (type) {
		case "success":
			toast.success(message, baseOptions);
			break;
		case "error":
			toast.error(message, baseOptions);
			break;
		case "info":
			toast.info(message, baseOptions);
			break;
		case "warning":
			toast.warning(message, baseOptions);
			break;
		default:
			console.error("❌ [NOTIFICATION] Invalid toast type:", type);
			toast(message, baseOptions);
	}
};
