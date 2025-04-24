/*
 * Copyright(c) RIB Software GmbH
 */

export interface IDrawingCompareConfig {
	mode: number;
	useTolerance: boolean;
	baseDrawingId: string;
	baseLayoutId: string;
	refDrawingId?: string;
	refLayoutId?: string;
	refModelId?: number;
	calibrationFactor: number;

	baseLayoutInfo?: string;
	refLayoutInfo?: string;
}

export enum DrawingComparisonType {
	Overlay = 1,
	Geometry = 2,
	Object = 3
}