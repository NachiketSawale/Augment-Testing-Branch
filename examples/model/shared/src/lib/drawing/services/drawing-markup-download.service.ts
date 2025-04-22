/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { firstValueFrom, Subject } from 'rxjs';
import { IMarkupAnnoMarkerEntity } from '../model/interfaces/markup-anno-marker-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ModelShareDrawingMarkupDownloadService {
	public hasDrawingViewer = false;
	private configService = inject(PlatformConfigurationService);
	private downPdfSubject = new Subject<string>();
	private downPdfNameSubject = new Subject<string>();
	private readonly http = inject(HttpClient);

	public setDrawingViewerState(value: boolean) {
		this.hasDrawingViewer = value;
	}

	public getDrawingViewerState() {
		return this.hasDrawingViewer;
	}

	public sendDownloadPdf(param: string) {
		this.downPdfSubject.next(param);
	}

	public downloadPdfAsObservable() {
		return this.downPdfSubject.asObservable();
	}

	public setDownloadPdfName(name: string) {
		this.downPdfNameSubject.next(name);
	}

	public downloadPdfNameAsObservable() {
		return this.downPdfNameSubject.asObservable();
	}

	/**
	 * download pdf with markup
	 * @param modelId The ID of the model, if known.
	 * @param fileArchiveDocId The ID of the file archive document.
	 * @param fileName The name of the file to be downloaded.
	 */
	public savePdfWithMarkup(modelId: number | null | undefined, fileArchiveDocId: number, fileName: string) {
		try {
			this.downloadPdfWithMarkup(modelId, fileArchiveDocId, fileName);
		} catch (error) {
			throw new Error(`download PDF failed! ERROR:${error}`);
		}
	}

	/**
	 * downloads pdf files with markup in IGE
	 */
	private async downloadPdfWithMarkup(modelId: number | null | undefined, fileArchiveDocId: number, fileName: string) {
		if (!modelId) {
			const docState = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}documents/projectdocument/getjobstatusbyfilearchivedocfk?fileArchiveDocFk=${fileArchiveDocId}`));
			modelId = (docState as IPreviewModelParamEntity).ModelFk;
		}
		const res = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}model/annotation/marker/listbymodel?modelId=${modelId}`));
		const markers = res as IMarkupAnnoMarkerEntity[];
		const markupDatas: { [id: string]: { markups: object[] } } = {};
		markers.forEach((marker) => {
			const parsedMarkup = JSON.parse(marker.MarkupJson);
			if (!markupDatas[marker.LayoutId]) {
				markupDatas[marker.LayoutId] = { markups: [] };
			}
			markupDatas[marker.LayoutId].markups.push(parsedMarkup);
		});
		const saveOptions: IMarkupSavePdfOptionEntity[] = Object.entries(markupDatas).map(([layoutId, { markups }]) => ({
			layoutId: layoutId,
			calibrationAngle: 0.0,
			calibrationX: 1.0,
			calibrationY: 1.0,
			markupData: JSON.stringify(markups),
			options: 0
		}));
		if (!fileName) {
			// TODO getFileName when model
			// const modelFileRes = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}model/project/modelfile/list?mainItemId=${modelId}`));
			// let modelFileItem = modelFileRes.data[0];
			// fileName = modelFileItem.OriginFileName;
		}
		this.setDownloadPdfName(fileName);
		const downloadPdfParam = saveOptions.length > 0 ? JSON.stringify(saveOptions) : '';
		this.sendDownloadPdf(downloadPdfParam);
	}
}

/**
 * markup save pdf entity
 */
interface IMarkupSavePdfOptionEntity{
	layoutId: string,
	calibrationAngle: number,
	calibrationX: number,
	calibrationY: number,
	markupData: string,
	options: number
}

/**
 * Preview Model Param Entity
 */
interface IPreviewModelParamEntity{
	Id: number,
	JobState: number,
	ModelFk: number,
	LoggingMessage: string
}
