/*
 * Copyright(c) RIB Software GmbH
 */
import { SplitAreaDirective } from '../directive/split-area.directive';

export interface IPoint {
	x: number;
	y: number;
}

export interface IArea {
	id: number;
	component: SplitAreaDirective;
	order: number;
	size: number | null;
	minSize: number | null;
	maxSize: number | null;
	sizeBeforeCollapse: number | null;
	gutterBeforeCollapse: number;
	originalArea: number;
}

// CREATED ON DRAG START

export interface ISplitSnapshot {
	gutterNum: number;
	allAreasSizePixel: number;
	allInvolvedAreasSizePercent: number;
	lastSteppedOffset: number;
	areasBeforeGutter: Array<IAreaSnapshot>;
	areasAfterGutter: Array<IAreaSnapshot>;
}

export interface IAreaSnapshot {
	area: IArea;
	sizePixelAtStart: number;
	sizePercentAtStart: number;
}

// CREATED ON DRAG PROGRESS

export interface ISplitSideAbsorptionCapacity {
	remain: number;
	list: Array<IAreaAbsorptionCapacity>;
}

export interface IAreaAbsorptionCapacity {
	areaSnapshot: IAreaSnapshot;
	pixelAbsorb: number;
	percentAfterAbsorption: number;
	pixelRemain: number;
}

export interface IDefaultOptions {
	dir: string;
	direction: string;
	disabled: boolean;
	gutterDblClickDuration: number;
	gutterSize: number | null;
	gutterStep: number;
	restrictMove: boolean;
	unit: string;
	useTransition: boolean;
}

// CREATED TO SEND OUTSIDE

export interface IOutputData {
	gutterNum: number;
	sizes: IOutputAreaSizes;
}

export interface IOutputAreaSizes extends Array<number | '*'> {}
