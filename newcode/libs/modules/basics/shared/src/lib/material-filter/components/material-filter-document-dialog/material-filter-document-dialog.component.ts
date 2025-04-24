/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { BasicsSharedMaterialSearchDocumentPreviewService, MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO } from '../../../material-search';

/**
 * Material filter document dialog component
 */
@Component({
	selector: 'basics-shared-material-filter-document-dialog',
	templateUrl: './material-filter-document-dialog.component.html',
	styleUrl: './material-filter-document-dialog.component.scss'
})
export class BasicsSharedMaterialFilterDocumentDialogComponent implements AfterViewInit {
	private readonly documentInfo = inject(MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO);
	private readonly elementRef = inject(ElementRef);
	private readonly documentPreviewService = inject(BasicsSharedMaterialSearchDocumentPreviewService);

	public async ngAfterViewInit() {
		const documentContainer = this.elementRef.nativeElement.querySelector('.material-filter-preview-document-box');
		await this.documentPreviewService.insertDocument(documentContainer, this.documentInfo.FileArchiveDocFk, this.documentInfo.MdcInternetCatalogFk);
	}
}