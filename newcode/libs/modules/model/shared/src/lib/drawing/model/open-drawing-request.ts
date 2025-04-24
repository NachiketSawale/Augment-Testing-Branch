/*
 * Copyright(c) RIB Software GmbH
 */

import {OpenModelRequest} from './open-model-request';
import {DrawingDisplayMode} from './enums';
import { IDescriptionInfo } from '@libs/platform/common';

/**
 * Open drawing request
 */
export class OpenDrawingRequest {
    /**
     * open current layout id, optional
     */
    public layoutId?: string | null;
    /**
     * Open current layout index by default
     */
    public layoutIndex? = 0;
    /**
     * Open drawing in which display mode.
     */
    public displayMode: DrawingDisplayMode;
    /**
     * Is drawing converted?
     */
    public converted?: boolean;
    /**
     * Drawing code
     */
    public code?: string;
    /**
     * Drawing description
     */
    public description?: string;
    /**
     * Model request data
     */
    public modelRequest?: OpenModelRequest;
    /**
     * Dimension uuids to be selected after drawing opened
     */
    public dimensionUuids?: string[];

    /**
     * The constructor
     * @param drawingId
     */
    public constructor(public drawingId: string) {
        this.displayMode = DrawingDisplayMode.D2;
    }
}

export interface IDrawingLayoutInfo {
	drawingId: string,
	filename: string,
	layouts: IDrawingLayoutConvertEntity[],
	processedLayout: number,
	totalLayout: number
}
export interface IDrawingLayoutConvertEntity {
	convertResultCode: number,
	convertResultMessage: string,
	id: string,
	name: string,
	type: string,
	paperSize: IDrawingLayoutConvertPaperSize
}
export interface IDrawingLayoutConvertPaperSize {
	height: number,
	width: number,
	x: number,
	y: number
}

export interface IDrawingPrintInfo {
	ModelCode: string,
	ModelDesc: string,
	ProjectName: string,
	ProjectName2: string,
	ProjectNo: string,
	CompanyName: string,
	CompanyCode: string,
	UserName: string,
	UnitInfo: IDescriptionInfo,
	Legends: IDrawingPrintLegend[],
}
export interface IDrawingPrintLegend {
	Code: string,
	DescriptionInfo: IDescriptionInfo,
	PositiveColor: number,
	NegativeColor: number,
	DimensionTypeFk: number,
	ModelObjects: IDrawingPrintModelObject[]
}

export interface IDrawingPrintModelObject {
	ModelFk: number,
	ModelObjectFk: number
}

export interface IDrawingPrintLegendGroup {
	name: string,
	value: string,
	colour: number[]
}