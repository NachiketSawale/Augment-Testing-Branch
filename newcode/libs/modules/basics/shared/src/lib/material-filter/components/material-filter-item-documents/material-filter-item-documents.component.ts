/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ControlContextInjectionToken, UiCommonDialogService } from '@libs/ui/common';
import { IMaterialSearchDocumentEntity, IMaterialSearchEntity, MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO } from '../../../material-search';
import { BasicsSharedMaterialFilterDocumentDialogComponent } from '../material-filter-document-dialog/material-filter-document-dialog.component';

/**
 * Material filter preview item documents component
 */
@Component({
	selector: 'basics-shared-material-filter-item-documents',
	templateUrl: './material-filter-item-documents.component.html',
	styleUrl: './material-filter-item-documents.component.scss'
})
export class BasicsSharedMaterialFilterItemDocumentsComponent {
	private readonly modalDialogService = inject(UiCommonDialogService);
	private readonly controlContext = inject(ControlContextInjectionToken);
	private _documents: IMaterialSearchDocumentEntity[] = [];

	/**
	 * Get document list
	 */
	public get documentList() {
		const currentDocs = this.getCurrentDocs();

		if ((this._documents === currentDocs) || (!this._documents?.length && !currentDocs?.length)) {
			return this._documents;
		}

		this._documents = currentDocs;
		return this._documents;
	}

	/**
	 * Preview document
	 */
	public async previewDocument(document: IMaterialSearchDocumentEntity): Promise<void> {
		if (!document.FileArchiveDocFk) {
			return;
		}

		this.modalDialogService.show({
			headerText: document.Description,
			bodyComponent: BasicsSharedMaterialFilterDocumentDialogComponent,
			width: '90%',
			height: '90%',
			buttons: [{
				id: 'Close',
				autoClose: true,
				caption: {key: 'basics.common.button.close'}
			}],
			bodyProviders: [{
				provide: MATERIAL_SEARCH_DOCUMENT_PREVIEW_INFO,
				useValue: {FileArchiveDocFk: document.FileArchiveDocFk, MdcInternetCatalogFk: this.internetCatalogFk}
			}]
		});
	}

	private get entity(): IMaterialSearchEntity | undefined | null {
		return this.controlContext.entityContext.entity as (IMaterialSearchEntity | undefined | null);
	}

	private get internetCatalogFk() {
		return this.entity?.InternetCatalogFk;
	}

	private getCurrentDocs() {
		return this.entity?.Documents ?? [];
	}

}