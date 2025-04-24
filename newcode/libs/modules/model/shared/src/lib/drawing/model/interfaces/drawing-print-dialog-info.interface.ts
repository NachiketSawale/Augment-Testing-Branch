/*
 * Copyright(c) RIB Software GmbH
 */
import { InjectionToken } from '@angular/core';
import { PrintPageOrientation, PrintPageSection, PrintPageSize } from '../enums/print-page-info.enum';
import { IgeViewer } from '@rib-4.0/ige-viewer';

/**
 * Drawing Print Dialog info
 */
export interface IDrawingPrintDialogInfo {
	legends: IDimensionLegend[];
	showLegend: boolean;
	isShowLegend: boolean;
	pageOrientation: PrintPageOrientation,
	pageSize: PrintPageSize;
	useVectorPublisher: boolean;

	companyText: string;
	projectText: string;
	modelText: string;
	userText: string;
	pageInfo: string;

	sectionGroups: IPrintSectionGroup[],
	igeViewer? : IgeViewer
}

export interface IDimensionLegend {
	color: string;
	colorInt: number;
	name: string;
	value: number;
	uom: string;
}

export interface IPrintSectionGroup {
	id: PrintPageSection,
	title: string;
	inputValue: string;
	buttons: IPrintSectionButton[];
	sections: IPrintSectionArea[];
}

export interface IPrintSectionArea {
	id: PrintPageSection,
	title: string;
	content: string;
	active: boolean;
	value: IPrintSectionValues[]
}

export interface IPrintSectionValues {
	id: string,
	value: string
}

export interface IPrintSectionButton {
	id: number;
	title: string;
	disable: boolean;
	description: string;
	value: string;
}

/**
 * injection token of Drawing print dialog options
 */
export const DRAWING_PRINT_DIALOG_TOKEN = new InjectionToken<IDrawingPrintDialogInfo>('DRAWING_PRINT_DIALOG_TOKEN');