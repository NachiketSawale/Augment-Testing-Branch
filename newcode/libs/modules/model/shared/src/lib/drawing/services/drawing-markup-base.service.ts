/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable, Subject } from 'rxjs';
import {inject} from '@angular/core';
import {isNumber} from 'lodash';
import { PlatformHttpService } from '@libs/platform/common';
import {IMarkupService} from '../model/interfaces/markup-service.interface';
import {IMarkupAnnotationEntity} from '../model/interfaces/markup-annotation-entity.interface';
import {IMarkupAnnoMarkerEntity} from '../model/interfaces/markup-anno-marker-entity.interface';
import {IDrawingMarkupEntity} from '../model/interfaces/drawing-markup-entity.interface';
import {ModelShareDrawingMarkupDownloadService} from './drawing-markup-download.service';
import {DrawingMarkupEntity} from '../model/drawing-markup-entity';
import { IDrawingMarkupEditInfo, IMarkupRequest } from '../model/interfaces/drawing-markup-edit-info.interface';
import { ModelShareDrawingMarkupEditDialogService } from './drawing-markup-edit-dialog.service';
import { BasicsSharedClerkLookupService } from '@libs/basics/shared';
import { IFormConfig } from '@libs/ui/common';
import { MarkupStyle } from '@rib/ige-engine-core/src/ige';

/**
 * ModelSharedMarkupServiceBase
 */
export abstract class ModelSharedMarkupServiceBase implements IMarkupService {
	private readonly http = inject(PlatformHttpService);
	private readonly markupDownloadService = new ModelShareDrawingMarkupDownloadService();
	private readonly markupEditService = new ModelShareDrawingMarkupEditDialogService();
	private readonly clerkLookupService = inject(BasicsSharedClerkLookupService);

	public currentMarkups: DrawingMarkupEntity[] = [];

	private deleteMarkupSubject = new Subject<string>();
	private onLoadMarkupSubject = new Subject<DrawingMarkupEntity[]>();
	private zoomToMarkupSubject = new Subject<string>();
	private markupToolSubject = new Subject<MarkupStyle>();

	private async fillClerk(entity: IMarkupAnnotationEntity) {
		if (entity.Clerk || !entity.ClerkFk) {
			return;
		}
		const clerk = await this.clerkLookupService.getItemByKeyAsync({id: entity.ClerkFk});
		if (clerk) {
			//TODO use userLookup for clerk.UserFk wait userLookup
			entity.Clerk = clerk.FirstName || '';
			if (clerk.FamilyName && clerk.FamilyName.length > 0 && entity.Clerk !== clerk.FamilyName) {
				entity.Clerk += ' ' + clerk.FamilyName;
			}
			if (entity.Clerk.length < 1) {
				entity.Clerk = clerk.Code || clerk.Description || '';
			}
		}
		const markupItem = this.currentMarkups.find(e => e.AnnotationFk === entity.Id);
		if (markupItem && !markupItem.Clerk) {
			markupItem.Clerk = entity.Clerk;
		}
	}

	/**
	 * load all model annotation and markers by modelId.
	 * @param modelId
	 */
	public async getAnnotations(modelId: number) {
		const entities = await this.http.get<IMarkupAnnotationEntity[]>('model/docmarker/getannotations', {params: {modelId: modelId}});
		entities.forEach(entity => this.fillClerk(entity));
		return entities;
	}

	/**
	 * save model annotation
	 * @param annotations
	 */
	public async saveAnnotations(annotations: IMarkupAnnotationEntity[]) {
		const entities = await this.http.post<IMarkupAnnotationEntity[]>('model/docmarker/saveannotations', annotations);
		entities.forEach(entity => this.fillClerk(entity));
		return entities;
	}

	/**
	 * create -new markup annotation marker entity
	 * @param annotationId
	 */
	public async createAnnoMarker(annotationId: number) {
		return this.http.post<IMarkupAnnoMarkerEntity>('model/annotation/marker/create', {params: {PKey1: annotationId}});
	}

	/**
	 * save markup annotation marker
	 * @param entity
	 */
	public async updateAnnoMarker(entity: IMarkupAnnoMarkerEntity) {
		return this.http.post<IMarkupAnnoMarkerEntity>('model/annotation/marker/save', entity);
	}

	/**
	 * save markup annotation
	 * @param entity
	 */
	public async updateAnnotation(entity: IMarkupAnnotationEntity) {
		return this.http.post<IMarkupAnnotationEntity>('model/annotation/save', entity);
	}

	/**
	 * delete markup annotation
	 * @param entity
	 */
	public deleteAnnotation(entity: IMarkupAnnotationEntity) {
		this.http.post('model/annotation/delete', entity);
	}

	/**
	 * delete markup annotation marker
	 * @param entity
	 */
	public deleteAnnoMarker(entity: IMarkupAnnoMarkerEntity) {
		this.http.post('model/annotation/marker/delete', entity);
	}

	/**
	 * hexColorToInt
	 */
	public hexColorToInt(colour: string) {
		let color;
		if (isNumber(colour)) {
			color = colour;
		} else if (colour.length > 7) {
			const colStr = colour.substr(1, 6);
			color = parseInt(colStr, 16);
		} else {
			color = parseInt(colour.slice(1), 16);
		}
		return color;
	}

	/**
	 * markup change (Change the location in IGE)
	 * @param entity
	 */
	public async updateMarkupChange(entity: IDrawingMarkupEntity) {
		if (!entity.MarkupAnnoMarkerEntity) {
			return entity;
		}
		entity.MarkupAnnoMarkerEntity = await this.updateAnnoMarker(entity.MarkupAnnoMarkerEntity);
		return entity;
	}

	/**
	 * delete markup entity(delete modelAnnotation && modelAnnoMarker)
	 * @param entity
	 */
	public deleteMarkup(entity: IDrawingMarkupEntity) {
		if (entity && entity.MarkupAnnotationEntity) {
			this.deleteMarkupSubject.next(entity.MarkerId);
		}
	}

	public downloadPdfAsObservable() {
		return this.markupDownloadService.downloadPdfAsObservable();
	}

	public downloadPdfNameAsObservable() {
		return this.markupDownloadService.downloadPdfNameAsObservable();
	}

	public deleteMarkupAsObservable(): Observable<string> {
		return this.deleteMarkupSubject.asObservable();
	}

	/**
	 * download pdf with markup
	 * @param modelId
	 * @param fileArchiveDocId
	 * @param fileName
	 */
	public savePdfWithMarkup(modelId: number | null | undefined, fileArchiveDocId: number, fileName: string) {
		this.markupDownloadService.savePdfWithMarkup(modelId, fileArchiveDocId, fileName);
	}

	public setDrawingViewerState(value: boolean) {
		this.markupDownloadService.setDrawingViewerState(value);
	}

	public getDrawingViewerState() {
		return this.markupDownloadService.getDrawingViewerState();
	}

	/**
	 * highlight select markup
	 * @param markerId
	 */
	public selectMarkup(markerId: string) {
		this.currentMarkups.forEach((e) => e.IsSelect = false);
		const markupItem = this.currentMarkups.find(e => e.MarkerId === markerId);
		if (markupItem) {
			markupItem.IsSelect = true;
			markupItem.IsShow = true;
		}
		this.zoomToMarkupSubject.next(markerId);
	}

	public zoomToMarkupAsObservable(): Observable<string> {
		return this.zoomToMarkupSubject.asObservable();
	}

	public markupEditAsObservable() {
		return this.markupEditService.markupEditAsObservable();
	}

	public showEditDialog(param: IMarkupRequest, currentMarkups: DrawingMarkupEntity[]) {
		this.markupEditService.showEditDialog(param, currentMarkups);
	}

	public sendLoadMarkup(markups: DrawingMarkupEntity[]) {
		this.onLoadMarkupSubject.next(markups);
	}

	public loadMarkupAsObservable(): Observable<DrawingMarkupEntity[]> {
		return this.onLoadMarkupSubject.asObservable();
	}

	public markupEditDialogAsObservable(): Observable<[IDrawingMarkupEditInfo, IFormConfig<IDrawingMarkupEditInfo>]> {
		return this.markupEditService.editDialogAsObservable();
	}

	public sendPrepareCreateMarkupInTool(style: MarkupStyle) {
		this.markupToolSubject.next(style);
	}

	public prepareCreateMarkupAsObservable(): Observable<MarkupStyle> {
		return this.markupToolSubject.asObservable();
	}
}