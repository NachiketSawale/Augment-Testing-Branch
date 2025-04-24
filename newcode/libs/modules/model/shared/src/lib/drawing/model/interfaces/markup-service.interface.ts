/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';
import {IMarkupAnnotationEntity} from './markup-annotation-entity.interface';
import {IDrawingMarkupEntity} from './drawing-markup-entity.interface';
import {DrawingMarkupEntity} from '../drawing-markup-entity';
import { IDrawingMarkupEditInfo, IMarkupRequest } from './drawing-markup-edit-info.interface';
import { IFormConfig } from '@libs/ui/common';
import { MarkupStyle } from '@rib/ige-engine-core/src/ige';

/**
 * IMarkupService
 */
export interface IMarkupService {
	/**
	 * current markup list
	 */
	currentMarkups: DrawingMarkupEntity[];

	/**
	 * load all model annotation and markers by modelId
	 * @param modelId
	 */
	getAnnotations(modelId: number): Promise<IMarkupAnnotationEntity[]>;

	/**
	 * save model annotation
	 * @param annotations
	 */
	saveAnnotations(annotations: IMarkupAnnotationEntity[]): Promise<IMarkupAnnotationEntity[]>;

	/**
	 * delete markup annotation
	 * @param entity
	 */
	deleteAnnotation(entity: IMarkupAnnotationEntity): void;

	/**
	 * markup change (Change the location in IGE) (can't update color and description to annotationEntity)
	 * @param entity AnnoMarker Entity
	 */
	updateMarkupChange(entity: IDrawingMarkupEntity): Promise<IDrawingMarkupEntity>;

	/**
	 * delete markup entity(delete modelAnnotation && modelAnnoMarker)
	 * @param entity
	 */
	deleteMarkup(entity: IDrawingMarkupEntity): void;

	/**
	 * download pdf with markup
	 * @param modelId
	 * @param fileArchiveDocId
	 * @param fileName
	 */
	savePdfWithMarkup(modelId: number | null | undefined, fileArchiveDocId: number, fileName: string): void;

	/**
	 * highlight select markup
	 * @param markerId
	 */
	selectMarkup(markerId: string): void;

	/**
	 * Download Pdf Subject
	 */
	downloadPdfAsObservable(): Observable<string>;

	/**
	 * Download Pdf Name Subject
	 */
	downloadPdfNameAsObservable(): Observable<string>;

	/**
	 * set DrawingViewer State
	 * @param value
	 */
	setDrawingViewerState(value: boolean): void;

	/**
	 * get DrawingViewer is use
	 */
	getDrawingViewerState(): boolean;

	/**
	 * markup edit dialog when close
	 */
	markupEditAsObservable(): Observable<IDrawingMarkupEditInfo>; // Extension

	/**
	 * update param and formConfig when prepare show markup edit dialog
	 */
	markupEditDialogAsObservable(): Observable<[IDrawingMarkupEditInfo, IFormConfig<IDrawingMarkupEditInfo>]>; // Extension

	/**
	 * show markup edit dialog
	 */
	showEditDialog(param: IMarkupRequest, currentMarkups: DrawingMarkupEntity[]): void;

	/**
	 * convert string to color number
	 */
	hexColorToInt(colour: string): number;

	deleteMarkupAsObservable(): Observable<string>;

	zoomToMarkupAsObservable(): Observable<string>;

	sendLoadMarkup(currentMarkups: DrawingMarkupEntity[]): void;

	loadMarkupAsObservable(): Observable<DrawingMarkupEntity[]>; // Extension

	sendPrepareCreateMarkupInTool(style: MarkupStyle): void;

	prepareCreateMarkupAsObservable(): Observable<MarkupStyle>; // Extension
}
