/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { IEntityIdentification, PlatformTranslateService } from '@libs/platform/common';
import { IEntityList, IEntitySelection } from '@libs/platform/data-access';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { BasicsSharedDocumentTypeLookupService, BasicsSharedFileUploadService, BasicsSharedOneDriveOnlineEditService, BasicsShareFileDownloadService, IDatengutFile, IOneDriveSynchronizeResponseEntity } from '@libs/basics/shared';
import { inject, Injector } from '@angular/core';
import { ModelShareDrawingMarkupDownloadService } from '@libs/model/shared';
import { BasicsDocumentType } from '@libs/basics/interfaces';
import { IDocumentUploadServiceOptions } from './interface/document-service-upload-options.interace';
import { FieldType, IGridDialogOptions, IMessageBoxOptions, StandardDialogButtonId, UiCommonGridDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { DocumentsSharedDocumentPreviewService } from '../../service/document-preview.service';

/**
 * document manager service
 */
export class DocumentManagerService<T extends IDocumentBaseEntity> {
	protected readonly dataService: IEntitySelection<T> & IEntityList<T>;
	protected readonly fileDownLoadService = inject(BasicsShareFileDownloadService);
	protected readonly markupDownloadService = new ModelShareDrawingMarkupDownloadService();
	protected readonly onlineEditService = inject(BasicsSharedOneDriveOnlineEditService);
	protected readonly documentTypeLookupService = inject(BasicsSharedDocumentTypeLookupService);
	protected readonly gridDialogService = inject(UiCommonGridDialogService);
	protected readonly uploadService?: BasicsSharedFileUploadService;
	protected readonly translate = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly injector = inject(Injector);
	private readonly previewService = this.injector.get(DocumentsSharedDocumentPreviewService);

	/**
	 * constructor.
	 * @param dataService data service.
	 * @param uploadOptions upload configs.
	 * @param uploadService upload service for uploading documents.
	 */
	public constructor(
		dataService: IEntitySelection<T> & IEntityList<T>,
		protected uploadOptions: IDocumentUploadServiceOptions,
		uploadService?: BasicsSharedFileUploadService,
	) {
		this.dataService = dataService;
		this.uploadService = uploadService;
		this.dataService.selectionChanged$.subscribe(() => {
			// Three containers, each will trigger once (documents project container, revision container, document container).
			const currentItem = this.dataService.getSelectedEntity();
			if (currentItem) {
				this.previewService.onSelectedPreview(currentItem);
			}
		});
	}

	/**
	 * common download file function
	 */
	public downloadFiles(): void {
		const selectedItems = this.dataService.getSelection();
		const docIdArray: number[] = selectedItems.filter((item) => item.FileArchiveDocFk != null).map((item) => item.FileArchiveDocFk!);
		if (docIdArray.length > 0) {
			this.fileDownLoadService.download(docIdArray);
		} else {
			console.error('no files found');
		}
	}

	/**
	 * download files by ids
	 * @param fileArchiveDocIds file archive ids.
	 * @param datengutFiles datengut files.
	 */
	public downloadFilesByIds(fileArchiveDocIds: number[], datengutFiles?: IDatengutFile[]): void {
		this.fileDownLoadService.download(fileArchiveDocIds, datengutFiles);
	}

	/**
	 * Check if you can download the file
	 * @return true if it can download files.
	 */
	public canDownloadFiles(): boolean {
		const selectedItems = this.dataService.getSelection();
		if (selectedItems.length < 1) {
			return false;
		}
		const docIdArray = selectedItems.filter((item) => item.FileArchiveDocFk != null).map((item) => item.FileArchiveDocFk!);

		return docIdArray.length > 0;
	}

	/**
	 * Upload file(s) and create documents after file(s) uploaded.
	 */
	public uploadAndCreateDocs(): void {
		this.uploadService?.uploadFiles(this.uploadOptions.configs);
	}

	/**
	 * Upload file for selected entity.
	 * @param selectedEntityId Id of selected entity.
	 */
	public uploadForSelected(selectedEntityId: IEntityIdentification): void {
		this.uploadService?.uploadFiles(
			this.uploadOptions.configs,
			selectedEntityId,
			this.uploadOptions.checkDuplicateClientSide
				? async (toUploadFileName: string) => {
						if (!toUploadFileName) {
							return false;
						}
						const upperCaseFileName = toUploadFileName.toUpperCase();
						const dataList = this.dataService?.getList() as IDocumentBaseEntity[];

						const duplicateFileData = dataList.find((fileData) => {
							const fileName = fileData.OriginFileName;
							return fileName && upperCaseFileName === fileName.toUpperCase();
						});

						if (duplicateFileData) {
							const result = await this.showInfoFilesExist([{ Id: duplicateFileData.Id, Info: duplicateFileData.OriginFileName ?? '' }]);
							return result?.closingButtonId === StandardDialogButtonId.Ok;
						} else {
							return true;
						}
					}
				: undefined,
		);
	}

	/**
	 * download Pdf file about markup (only pdf type and need use ige viewer)
	 * @param modelId model id.
	 * @param fileArchiveDocId file archive id.
	 * @param fileName file name.
	 */
	public downloadPdf(modelId: number | null | undefined, fileArchiveDocId: number, fileName: string): void {
		this.markupDownloadService.savePdfWithMarkup(modelId, fileArchiveDocId, fileName);
	}

	/**
	 * can download pdf file about markup
	 * @return it can download when return false because 'disable'
	 */
	public canDownloadPdf(): boolean {
		const selectedItem = this.dataService.getSelectedEntity();
		if (!selectedItem) {
			return true;
		}
		const isPdfDocumentType = selectedItem.DocumentTypeFk === BasicsDocumentType.Pdf;
		// 1 not use downloadPdf when the IGE not working (TODO wait IGE support)
		// 2 (check pdf documentType when no extension) or (user set other non-pdf type but extension is pdf)
		const canDownloadPdf = this.markupDownloadService.getDrawingViewerState() && (isPdfDocumentType || this.compareExtension(selectedItem.OriginFileName, 'pdf'));
		return !(this.canDownloadFiles() && canDownloadPdf);
	}

	/**
	 * Compares whether the file name is of the specified type
	 * @param fileName
	 * @param extension
	 * @return is file extension
	 */
	public compareExtension(fileName: string | null | undefined, extension: string): boolean {
		if (!fileName || fileName.length < extension.length || fileName.indexOf('.') < 0) {
			return false;
		}
		const fileExtension = fileName.split('.').pop();
		return fileExtension?.toLowerCase() === extension;
	}

	/**
	 * Check whether online edit is disabled or not.
	 * @return return true if online edit is enabled.
	 */
	public async enableOnlineEdit() {
		return this.onlineEditService.getOnlineEditEnableOption();
	}

	/**
	 * Check whether online edit office document is disabled or not.
	 * @return return true if it can online edit office document.
	 */
	public canOnlineEditOfficeDocument(): boolean {
		//todo: permission check, status check.
		// if (!currentItem || !currentItem.OriginFileName || !currentItem.FileArchiveDocFk || currentItem.Version === 0
		// || (currentItem !== null && currentItem.CanWriteStatus !== undefined && !currentItem.CanWriteStatus)) {
		//  return false;
		// }
		// let parentSelectItem = parentService.getSelected();
		// if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus) {
		//  return false;
		// }

		const curItem = this.dataService.getSelectedEntity();
		if (curItem) {
			return this.canOnlineEditThisOfficeDocument(curItem);
		}
		return false;
	}

	private canOnlineEditThisOfficeDocument(curItem: T): boolean {
		if (!curItem || curItem.FileArchiveDocFk == null || curItem.Version == 0 || !curItem.OriginFileName) {
			return false;
		}
		const fileName = curItem.OriginFileName;
		const extDotIndex = fileName.lastIndexOf('.');
		const fileEXT = extDotIndex === -1 ? '' : fileName.substring(extDotIndex + 1);
		const supportEditTypes = ['docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt'];
		return supportEditTypes.indexOf(fileEXT) !== -1;
	}

	/**
	 * Check whether it can synchronize the online edited office document back to 4.0.
	 * @return return true if it can synchronize online edited office document.
	 */
	public canSynchronizeDocument(): boolean {
		return this.canOnlineEditOfficeDocument();
	}

	/**
	 * Online edit office document.
	 */
	public onlineEditOfficeDocument() {
		const curItem = this.dataService.getSelectedEntity();
		if (curItem && curItem.FileArchiveDocFk) {
			this.onlineEditService.onlineEditOfficeDocument(curItem.FileArchiveDocFk);
		}
	}

	/**
	 * Synchronize the online edited office document back to 4.0.
	 * @return return response data.
	 */
	public synchronizeOfficeDocument(fileArchiveDocId: number): Promise<IOneDriveSynchronizeResponseEntity | null> {
		return this.onlineEditService.synchronizeOfficeDocument(fileArchiveDocId);
	}

	/**
	 * find document type by file extension.
	 * @param fileName
	 */
	public async getDocumentType(fileName: string) {
		const suffix = fileName
			.slice(fileName.lastIndexOf('.') + 1)
			.replace(/[.*]/g, '') //remove '.' and '*'
			.toLowerCase();

		const documentTypes = await firstValueFrom(this.documentTypeLookupService.getList());
		return documentTypes.find((type) => type.Extention && type.Extention.toLowerCase().includes(suffix));
	}

	/**
	 * Open information grid dialog show files already exist.
	 * @param infoList Info list to show.
	 * @return Dialog result.
	 */
	public async showInfoFilesExist(infoList: { Id: number; Info: string }[]) {
		const infoGridDialogData: IGridDialogOptions<{ Id: number; Info: string }> = {
			width: '550px',
			backdrop: false,
			windowClass: 'grid-dialog',
			isReadOnly: true,
			resizeable: true,
			headerText: 'basics.common.taskBar.info',
			topDescription: 'basics.common.uploadDocument.duplicateTips',
			gridConfig: {
				idProperty: 'Id',
				uuid: 'a56751e44155437a8db3dac485dc0b34',
				columns: [
					{
						type: FieldType.Comment,
						id: 'info',
						model: 'Info',
						label: { text: 'Information', key: 'basics.common.taskBar.info' },
						sortable: true,
						visible: true,
						width: 500,
					},
				],
			},
			items: infoList,
			selectedItems: [],
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'basics.common.uploadDocument.uploadBtn' },
					autoClose: true,
				},
				{ id: StandardDialogButtonId.Ignore, caption: { key: 'basics.common.uploadDocument.IgnoreBtn' } },
			],
		};
		return await this.gridDialogService.show(infoGridDialogData);
	}

	/**
	 * Open message dialog to show invalid files.
	 * @param invalidFiles Invalid files to show.
	 * @return Dialog result.
	 */
	public showInfoInvalidFiles(invalidFiles: string[]): void {
		if (!invalidFiles || invalidFiles.length === 0) {
			return;
		}
		let errMsg: string;
		if (invalidFiles.length > 1) {
			const fileNames = invalidFiles.join('<br/>');
			errMsg = '<br/>' + this.translate.instant('documents.project.FileUpload.validation.FileExtensionsErrorInfo') + ':<br/>' + fileNames;
		} else {
			errMsg = '<br/>' + this.translate.instant('documents.project.FileUpload.validation.FileExtensionErrorInfo') + ':<br/>' + invalidFiles[0];
		}
		errMsg = '<div style="height:300px">' + errMsg + '</div>';

		const msgOptions: IMessageBoxOptions = {
			headerText: 'documents.project.FileUpload.validation.FileExtensionErrorMsgBoxTitle',
			bodyText: errMsg,
			iconClass: 'ico-warning',
		};
		this.messageBoxService.showMsgBox(msgOptions)?.then();
	}
}
