/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { IEmployeeDocumentEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeDocumentDataService, TimekeepingEmployeeDataService } from '../services';
import { DocumentsSharedDocumentPreviewProgramService } from '@libs/documents/shared';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeDocumentBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEmployeeDocumentEntity>, IEmployeeDocumentEntity> {

	private readonly documentDataService = inject(TimekeepingEmployeeDocumentDataService);
	private readonly dataService = inject(TimekeepingEmployeeDataService);
	private readonly previewProgramService = inject(DocumentsSharedDocumentPreviewProgramService);
	public onCreate(containerLink: IGridContainerLink<IEmployeeDocumentEntity>) {
		const menuItems: ConcreteMenuItem[] = [
			{
				caption: {key: 'timekeeping.employee.entityUpload'},
				iconClass: 'tlb-icons ico-upload',
				type: ItemType.FileSelect,
				sort: 400,
				options: {
					fileFilter: 'application/json',
					maxSize: '2MB',
					retrieveTextContent: true,
					multiSelect: false
				},
				disabled: () => {
					return !this.documentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.documentDataService.canUploadForSelected()){
						this.documentDataService.uploadForSelected();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityUploadAndCreate'},
				iconClass: 'tlb-icons ico-upload-create',
				type: ItemType.FileSelect,
				sort: 401,
				options: {
					fileFilter: 'application/json',
					maxSize: '2MB',
					retrieveTextContent: true,
					multiSelect: false
				},
				disabled: () => {
					return !this.dataService.getSelectedEntity();
				},
				fn: () => {
					if (this.documentDataService.canUploadAndCreateDocs()){
						this.documentDataService.uploadAndCreateDocs();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDownload'},
				iconClass: 'tlb-icons ico-download',
				type: ItemType.Item,
				sort: 402,
				disabled: () => {
					return !this.documentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.documentDataService.canDownloadFiles()){
						this.documentDataService.downloadFiles();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDownloadPdf'},
				iconClass: 'tlb-icons ico-download-markers',
				type: ItemType.Item,
				sort: 403,
				disabled: () => {
					return !this.documentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.documentDataService.canDownloadPdf()){
						this.documentDataService.downloadPdf();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityCancelUpload'},
				iconClass: 'tlb-icons ico-upload-cancel',
				type: ItemType.Item,
				sort: 404,
				disabled: () => {
				return !this.documentDataService.cancelUploadFilesBtVisible;
				},
				fn: () => {
					//TODO Not yet implement in base class
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityPreview'},
				iconClass: 'tlb-icons ico-preview-form',
				type: ItemType.Item,
				sort: 405,
				disabled: () => {
					return !this.documentDataService.getSelectedEntity();
				},
				fn: () => {
					//TODO Not yet implement in base class
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDefaultPreviewProgram'},
				iconClass: 'tlb-icons ico-container-config',
				type: ItemType.Item,
				sort: 406,
				fn: () => {
					this.previewProgramService.showDialog();
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityEditOfficeDocument'},
				//TODO
				iconClass: 'tlb-icons ico-draw',
				type: ItemType.Item,
				sort: 407,
				disabled: () => {
					return !this.documentDataService.canOnlineEditOfficeDocument();
				},
				fn: () => {
					this.documentDataService.onlineEditOfficeDocument();
				}
			},
			{
				caption: {key: 'timekeeping.employee.entitySaveDocumentToRib40'},
				//TODO
				iconClass: 'tlb-icons ico-reset',
				type: ItemType.Item,
				sort: 408,
				disabled: () => {
					return !this.documentDataService.canSynchronizeDocument();
				},
				fn: () => {
					this.documentDataService.synchronizeOfficeDocument();
				}
			}
		];

		containerLink.uiAddOns.toolbar.addItems(menuItems);
	}
}