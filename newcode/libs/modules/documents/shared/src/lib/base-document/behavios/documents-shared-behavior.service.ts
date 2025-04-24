/*
 * Copyright(c) RIB Software GmbH
 */

import { isFunction } from 'lodash';
import { ItemType } from '@libs/ui/common';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IDocumentService } from '../services/interface/document-service.interface';
import { Injector } from '@angular/core';
import { DocumentsSharedDocumentPreviewService } from '../../service/document-preview.service';
import { IDocumentPreviewEntity } from '@libs/documents/interfaces';

/**
 * The document base behavior for different type document entity container
 */
export class DocumentsSharedBehaviorService<T extends object> implements IEntityContainerBehavior<IGridContainerLink<T>, T> {
	private dataService: IDocumentService<T>;

	private readonly previewService = this.injector.get(DocumentsSharedDocumentPreviewService);

	/**
	 * The constructor
	 * @param documentDataService data service.
	 * @param injector injector
	 */
	public constructor(
		documentDataService: IDocumentService<T>,
		protected injector: Injector,
	) {
		this.dataService = documentDataService;
	}

	/**
	 * Handle container on create
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<T>): void {
		this.previewService.getPreviewSameTab();
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'basics.common.upload.button.uploadCaption' },
				disabled: () => {
					return !this.dataService.canUploadForSelected();
				},
				hideItem: !this.dataService.uploadForSelectedBtVisible,
				iconClass: 'tlb-icons ico-upload',
				id: 'upload',
				fn: () => {
					//todo: need to handle saveSubDocumentBySelf case
					if (isFunction(this.dataService.uploadForSelected)) {
						this.dataService.uploadForSelected();
					}
				},
				sort: 1,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.upload.button.uploadAndCreateDocument' },
				disabled: () => {
					return !this.dataService.canUploadAndCreateDocs();
				},
				hideItem: !this.dataService.uploadAndCreateDocsBtVisible,
				iconClass: 'tlb-icons ico-upload-create',
				id: 'multipleupload',
				fn: () => {
					//todo: need to handle saveSubDocumentBySelf case
					if (isFunction(this.dataService.uploadAndCreateDocs)) {
						this.dataService.uploadAndCreateDocs();
					}
				},
				sort: 2,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.upload.button.downloadCaption' },
				disabled: () => {
					return !this.dataService.canDownloadFiles();
				},
				hideItem: !this.dataService.downloadFilesBtVisible,
				iconClass: 'tlb-icons ico-download',
				id: 'download',
				fn: () => {
					this.dataService.downloadFiles();
				},
				sort: 3,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.upload.button.downloadPdfCaption' },
				disabled: () => {
					return this.dataService.canDownloadPdf();
				},
				hideItem: !this.dataService.downloadFilesBtVisible,
				iconClass: 'tlb-icons ico-download-markers',
				id: 'downloadPdf',
				fn: () => {
					this.dataService.downloadPdf();
				},
				sort: 4,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.upload.button.cancelUploadCaption' },
				disabled: () => {
					//return !this.canCancelUpload();
					return true;
				},
				hideItem: true, //!this.cancelUploadFilesBtVisible,
				iconClass: 'tlb-icons ico-upload-cancel',
				id: 'cancelUpload',
				fn: () => {
					///todo:
					//this.cancelUploadFiles();
				},
				sort: 5,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.preview.button.previewCaption' },
				disabled: () => {
					const entity = this.dataService.getSelectedEntity() as IDocumentPreviewEntity;
					return !entity || !this.previewService.canPreview(entity);
				},
				hideItem: false, // tod0:!this.previewBtVisible,
				iconClass: 'tlb-icons ico-preview-form',
				id: 'preview',
				fn: async () => {
					const entity = this.dataService.getSelectedEntity() as IDocumentPreviewEntity;
					await this.previewService.preview(entity);
				},
				sort: 6,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.previewProgram.caption' },
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-container-config',
				id: 'previewProgram',
				sort: 7,
				type: ItemType.DropdownBtn,
				list: {
					showImages: false,
					showTitles: true,
					cssClass: 'dropdown-menu-right',
					items: [{
						id: 'previewInTab',
						caption: {
							text: 'Auto Preview in Same Tab',
							key: 'basics.common.preview.button.autoPreviewBrowser'
						},
						type: ItemType.Check,
						value: this.previewService.openPreviewInSameTab,
						fn: (info) => {
							this.previewService.setPreviewSameTab(info.isChecked);
						},
						disabled: () => {
							return false;
						}
					}]
				}
			},
			{
				caption: { key: 'basics.common.previewEidtOfficeDocument' },
				disabled: () => {
					return !this.dataService.canOnlineEditOfficeDocument();
				},
				hideItem: !this.dataService.onlineEditBtVisible,
				iconClass: 'tlb-icons ico-draw',
				id: 'edit',
				fn: () => {
					this.dataService.onlineEditOfficeDocument();
				},
				sort: 8,
				type: ItemType.Item,
			},
			{
				caption: { key: 'basics.common.synchronize.button.synchronizeCaption' },
				disabled: () => {
					return !this.dataService.canSynchronizeDocument();
				},
				hideItem: !this.dataService.onlineEditBtVisible,
				iconClass: 'tlb-icons ico-reset',
				id: 'synchronize',
				fn: () => {
					this.dataService.synchronizeOfficeDocument();
				},
				sort: 9,
				type: ItemType.Item,
			},

			//todo: add other all need buttons
		]);

		containerLink.uiAddOns.navigation.removeNavigator({internalModuleName: 'Documents.Project'});
		this.customizeToolbar(containerLink);
	}

	private customizeToolbar(containerLink: IGridContainerLink<T>) {
		if (!this.dataService.createBtVisible) {
			containerLink.uiAddOns.toolbar.deleteItems(['create']);
		}
	}
}
