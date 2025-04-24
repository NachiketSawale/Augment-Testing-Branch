/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';

/**
 * Material search document preview service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedMaterialSearchDocumentPreviewService {
	private readonly httpService = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);

	/**
	 * insert document in pointer html element
	 * @param content
	 * @param fileArchiveDocFk
	 * @param internetCatalogFk
	 */
	public async insertDocument(content: HTMLElement, fileArchiveDocFk: number, internetCatalogFk?: number | null) {
		const previewUrl = internetCatalogFk ?
			'basics/material/commoditysearch/1.0/internetpreview' :
			'basics/common/document/preview';
		const previewParams = new HttpParams().set('fileArchiveDocId', fileArchiveDocFk);
		if (internetCatalogFk) {
			previewParams.set('catalogId', internetCatalogFk);
		}

		const fileUrl = await this.httpService.get<string>(previewUrl, {params: previewParams, responseType: 'text' as 'json'});
		const typeName = (fileUrl.split('.').pop())?.toLowerCase();
		if (!typeName) {
			return;
		}

		const editorParams = new HttpParams().set('docId', fileArchiveDocFk);
		if (['mp4', 'wav', 'webm', 'm4a', 'ogg', 'mp3'].includes(typeName)) {
			content.innerHTML = `<video width='100%' height='100%' controls='controls' autoplay='autoplay' src='${fileUrl}'></video>`;
		} else if (['eml', 'msg'].includes(typeName)) {
			content.innerHTML = await this.httpService.get<string>('basics/common/document/getmsgineditor', {params: editorParams, responseType: 'text' as 'json'});
		} else if ('rtf' === typeName) {
			content.innerHTML = await this.httpService.get<string>('basics/common/document/getfileineditor', {params: editorParams, responseType: 'text' as 'json'});
		} else if ('pdf' === typeName) {
			//TODO wait PdfOverlay, use sandbox but not display
			content.innerHTML = `<iframe credentialless style='width: 100%;height: 400px' src='${fileUrl}' type='application/pdf'></iframe>`;
		} else if (['xml', 'txt', 'html', 'htm', 'png', 'bmp', 'jpg', 'tif', 'gif', 'jpeg'].includes(typeName)) {
			content.innerHTML = `<iframe credentialless sandbox='allow-same-origin' style='width: 100%;height: 400px' class='border-none fullheight fullwidth' src='${fileUrl}'/>`;
		} else {
			content.innerText = this.translationService.instant('documents.project.errPreviewBrower').text;
		}
	}
}