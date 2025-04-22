/*
 * Copyright(c) RIB Software GmbH
 */

import { MarkupStyle, MarkupType } from '@rib/ige-engine-core';

/**
 * Drawing markup edit dialog info.
 */
export interface IDrawingMarkupEditInfo {
	Id: string;
	Color: number;
	Comment: string;
	AnnotationRawType: boolean;
	AnnotationDescription: string;
	FontHeight: number;
	LineWidth: number;
	Product: number;
	LinePattern: number;
	Stacking: number;
	FillColor: number;
	RegionShape: number;
	InstallSequence: number;
	ReadOnlyConfig: IMarkupEditConfig;
	Change: IMarkupEditChange;
}

export interface IMarkupEditChange {
	isColor: boolean;
	isComment: boolean;
	isAnnotationRawType: boolean;
	isAnnotationDescription: boolean;
	isFontHeight: boolean;
	isLineWidth: boolean;
	isProduct: boolean;
	isLinePattern: boolean;
	isStacking: boolean;
	isFillColor: boolean;
	isRegionShape: boolean;
	isInstallSequence: boolean;
}

/**
 * MarkupLineOptions TODO remove it after get MarkupLineOptions from IGE
 */
export enum MarkupLineOptionEnum {
	None = 0,
	Cloud = 1
}

export interface IMarkupEditConfig {
	isReadOnlyColor: boolean;
	isTakeOffMode: boolean;
	isDefaultAnnoRawType: boolean;
	isRawTypeModule: boolean;
	isSameAnnotation: boolean;
	isNewMarkup: boolean;
	isNoPoint: boolean;
	isFillColor: boolean;
	isUseAnnoRawType: boolean;
	isHighlighter: boolean;
}

/**
 * MarkupUpdateRequest param TODO remove it after IGE has this request
 */
export interface IMarkupRequest {
	/**
	 * Markup.id
	 */
	markupId: string;

	/**
	 * Markup.text
	 */
	text: string;

	/**
	 * Markup.fontHeight
	 */
	height: number;

	/**
	 * is new markup
	 */
	bNewMarkup: boolean;

	/**
	 * MarkupType
	 */
	markupType?: MarkupType;

	/**
	 * MarkupStyle
	 */
	markupStyle?: MarkupStyle;

	Color: string;
}

/**
* IGE MarkupRegionShape TODO wait IGE
*/
export enum MarkupRegionShapeEnum {
	Rectangle =  0,
	Ellipse = 1
}

/**
* IGE MarkupType TODO wait IGE
*/
export enum MarkupTypeEnum {
	Point = 0,
	Line = 1,
	Region = 2,
	Freehand = 3
}

/**
* IGE MarkupPointStyle TODO wait IGE
*/
export enum MarkupPointStyleEnum {
	Default = 0,
	Arrow = 1,
	Tick = 2,
	Cross = 3,
	Star = 4,
	NotVisible = 5
}
