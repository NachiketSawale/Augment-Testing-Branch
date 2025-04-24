/*
 * Copyright(c) RIB Software GmbH
 */


import { ISlickGridEventArgs } from './slick-grid-event-args.interface';

export interface IDragEventArgs<T extends object> extends ISlickGridEventArgs<T> {
	count: number;
	deltaX: number;
	deltaY: number;
	offsetX: number;
	offsetY: number;
	originalX: number;
	originalY: number;
	available: HTMLDivElement | HTMLDivElement[];
	drag: HTMLDivElement;
	drop: HTMLDivElement | HTMLDivElement[];
	helper: HTMLDivElement;
	proxy: HTMLDivElement;
	target: HTMLDivElement;
	mode: string;
	row: number;
	rows: number[];
	startX: number;
	startY: number;
}
