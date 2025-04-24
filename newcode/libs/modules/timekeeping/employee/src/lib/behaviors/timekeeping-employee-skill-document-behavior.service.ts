/*
 * Copyright(c) RIB Software GmbH
 */


import { inject, Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEmployeeSkillDocumentEntity } from '@libs/timekeeping/interfaces';
import { ConcreteMenuItem, ItemType } from '@libs/ui/common';
import { TimekeepingEmployeeSkillDataService, TimekeepingEmployeeSkillDocumentService } from '../services';
import { DocumentsSharedDocumentPreviewProgramService } from '@libs/documents/shared';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeeSkillDocumentBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IEmployeeSkillDocumentEntity>, IEmployeeSkillDocumentEntity> {

	private readonly skillDocumentDataService = inject(TimekeepingEmployeeSkillDocumentService);
	private readonly skillDataService = inject(TimekeepingEmployeeSkillDataService);
	private readonly previewProgramService = inject(DocumentsSharedDocumentPreviewProgramService);
	public onCreate(containerLink: IGridContainerLink<IEmployeeSkillDocumentEntity>) {
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
					return !this.skillDocumentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.skillDocumentDataService.canUploadForSelected()){
						this.skillDocumentDataService.uploadForSelected();
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
					return !this.skillDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.skillDocumentDataService.canUploadAndCreateDocs()){
						this.skillDocumentDataService.uploadAndCreateDocs();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDownload'},
				iconClass: 'tlb-icons ico-download',
				type: ItemType.Item,
				sort: 402,
				disabled: () => {
					return !this.skillDocumentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.skillDocumentDataService.canDownloadFiles()){
						this.skillDocumentDataService.downloadFiles();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDownloadPdf'},
				iconClass: 'tlb-icons ico-download-markers',
				type: ItemType.Item,
				sort: 403,
				disabled: () => {
					return !this.skillDocumentDataService.getSelectedEntity();
				},
				fn: () => {
					if (this.skillDocumentDataService.canDownloadPdf()){
						this.skillDocumentDataService.downloadPdf();
					}
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityCancelUpload'},
				iconClass: 'tlb-icons ico-upload-cancel',
				type: ItemType.Item,
				sort: 404,
				disabled: () => {
					return !this.skillDocumentDataService.cancelUploadFilesBtVisible;
				},
				fn: () => {
					//TODO
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityPreview'},
				iconClass: 'tlb-icons ico-preview-form',
				type: ItemType.Item,
				sort: 405,
				disabled: () => {
					return !this.skillDocumentDataService.getSelectedEntity();
				},
				fn: () => {
					//TODO Not yet implement in base class
				}
			},
			{
				caption: {key: 'timekeeping.employee.entityDefaultPreviewProgram'},
				//TODO
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
					return !this.skillDocumentDataService.canOnlineEditOfficeDocument();
				},
				fn: () => {
					this.skillDocumentDataService.onlineEditOfficeDocument();
				}
			},
			{
				caption: {key: 'timekeeping.employee.entitySaveDocumentToRib40'},
				//TODO
				iconClass: 'tlb-icons ico-reset',
				type: ItemType.Item,
				sort: 408,
				disabled: () => {
					return !this.skillDocumentDataService.canSynchronizeDocument();
				},
				fn: () => {
					this.skillDocumentDataService.synchronizeOfficeDocument();
				}
			}
		];

		containerLink.uiAddOns.toolbar.addItems(menuItems);
	}
}