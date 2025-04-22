/**
 * IWorkflowSVGAttribute interface stores the attribute information of different node shapes. Shapes such as rectangle, polygon etc.
 */
export interface IWorkflowSVGAttribute {
	fill?: string;
	rx?: string;
	ry?: string;
	points?: string;
	stroke?: string;
	strokeWidth?: string;
	lineStroke?: string;
	shape: string;
	actionIcon?: string;
	actionUpdateIcon?: IWorkflowActionUpdateIcon;
	x0?: string;
	x1?: string;
	x2?: string;
	y0?: string;
	y1?: string;
	y2?: string;
}

export interface IWorkflowActionUpdateIcon {
	iconClass?: string;
	tooltip?: string;
}