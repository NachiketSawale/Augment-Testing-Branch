/*
 * Copyright(c) RIB Software GmbH
 */

import { forkJoin } from 'rxjs';
import { escape, isNil } from 'lodash';
import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { MaterialSearchScope } from '../../model/material-search-scope';
import { IMaterialAttributeLoadEntity } from '../../model/interfaces/material-search-attribute-load.interface';
import {
	IMaterialSearchDocumentEntity,
	IMaterialSearchDocumentTypeEntity
} from '../../model/interfaces/material-search-document-entity.interfact';
import { BasicsSharedMaterialSearchDocumentPreviewService } from '../../services/material-search-document-preview.service';

/**
 * Material detail view
 */
@Component({
	selector: 'basics-shared-material-search-detail',
	templateUrl: './material-search-detail.component.html',
	styleUrls: ['./material-search-detail.component.scss'],
})
export class BasicsSharedMaterialSearchDetailComponent implements OnInit {
	private readonly elementRef = inject(ElementRef);
	private readonly documentPreviewService = inject(BasicsSharedMaterialSearchDocumentPreviewService);
	/**
	 * Search scope
	 */
	@Input()
	public scope!: MaterialSearchScope;
	/**
	 * if show material 3d model
	 */
	public mdc3dShow: boolean = false;

	/**
	 * preview attributes
	 */
	public previewAttributes: IMaterialAttributeLoadEntity[] = [];

	/**
	 * preview document
	 */
	public previewDocuments: IMaterialSearchDocumentEntity[] = [];

	/**
	 * preview document type
	 */
	public previewDocumentTypes: IMaterialSearchDocumentTypeEntity[] = [];

	/**
	 * preview material catalog id
	 */
	public internetCatalog?: number = undefined;

	/**
	 * initializing
	 */
	public ngOnInit() {
		if (this.scope.detailItem) {
			this.mdc3dShow = !isNil(this.scope.detailItem.Uuid);
			forkJoin([
				this.scope.searchService.getPreviewAttribute(this.scope.detailItem),
				this.scope.searchService.getDocumentByMaterial(this.scope.detailItem)
			]).subscribe((response) => {
				this.previewAttributes = response[0];
				this.previewAttributes.forEach(a => {
					a.Property = escape(a.Property);
					a.Value = escape(a.Value);
				});
				this.previewDocuments = response[1].Main;
				this.previewDocuments.forEach(d => {
					d.Description = escape(d.Description);
				});
				this.previewDocumentTypes = response[1].DocumentType;
				if (this.scope.detailItem && this.scope.detailItem.InternetCatalogFk) {
					this.internetCatalog = this.scope.detailItem.InternetCatalogFk;
				}
			});
		}
	}

	/**
	 * Go back search view
	 */
	public goBack() {
		this.scope.showDetail = false;
		this.scope.detailItem = undefined;
	}

	/**
	 * handle on preview document
	 * @param id
	 * @param index
	 */
	public async onDocumentPreview(id: number, index: number) {
		const content = this.elementRef.nativeElement.querySelector('.ms-sv-commodity-preview-document-box .ms-sv-commodity-preview-document-content_' + index);
		if (content.classList.contains('hidden')) {
			const documentEntity = this.previewDocuments.find(d => d.Id === id);
			if (!documentEntity || !documentEntity.FileArchiveDocFk) {
				return;
			}

			await this.documentPreviewService.insertDocument(content, documentEntity.FileArchiveDocFk, this.scope?.detailItem?.InternetCatalogFk);
		}
		content.classList.toggle('hidden');
	}
}
