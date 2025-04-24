/*
 * Copyright(c) RIB Software GmbH
 */
import { IDocumentService } from './interface/document-service.interface';
import { DataServiceFlatLeaf, EntityDateProcessorFactory, IDataServiceOptions, IEntityProcessor, IEntitySchemaId, IRootRole } from '@libs/platform/data-access';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { CompleteIdentification, IEntityIdentification, PlatformHttpService } from '@libs/platform/common';
import { DocumentManagerService } from './document-manager.service';
import { inject, Injector } from '@angular/core';
import { DocumentDataReadonlyProcessorService } from './processors/document-data-readonly-processor.service';
import { IDocumentServiceUploadOptions } from './interface/document-service-upload-options.interace';
import { BasicsSharedFileUploadService, BasicsSharedFileUploadServiceFactory, BasicsUploadSectionType, IFileInfo } from '@libs/basics/shared';
import { ICheckDuplicateForUploadFileRequest, ICreateForUploadFileRequest, ICreateForUploadFileResponse, IUploadedFileInfo } from './interface/create-for-upload-file-request.interace';
import { StandardDialogButtonId } from '@libs/ui/common';

/**
 * The document base leaf data service for difference document type entity
 * for example: the prcDocument,boqDocument...is the children of other entity
 */
export abstract class DocumentDataLeafService<T extends IDocumentBaseEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends DataServiceFlatLeaf<T, PT, PU> implements IDocumentService<T> {
	/**
	 *  Flag indicates whether button "cancel upload files" is visible.
	 */
	public cancelUploadFilesBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "download files" is visible.
	 */
	public downloadFilesBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "online edit office document" and "save back to 4.0" is visible.
	 */
	public onlineEditBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "preview" is visible.
	 */
	public previewBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "upload and create documents" is visible.
	 */
	public uploadAndCreateDocsBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "upload for selected entity" is visible.
	 */
	public uploadForSelectedBtVisible: boolean = true;
	/**
	 *  Flag indicates whether button "create" is visible.
	 */
	public createBtVisible: boolean = true;

	private readonly injector = inject(Injector);
	private readonly httpService = inject(PlatformHttpService);

	protected readonly uploadService?: BasicsSharedFileUploadService;
	protected readonly documentManager!: DocumentManagerService<T>;

	/**
	 *  Readonly processor.
	 */
	public readonlyProcessor: DocumentDataReadonlyProcessorService<T, PT, PU> | undefined;
	/**
	 *  Date processor.
	 */
	public dateProcessor: IEntityProcessor<T> | undefined;

	protected readonly MaxLengthOfDescription = 42;
	protected readonly EndPointUploadDefault = 'createforuploadfile';
	protected readonly EndPointCheckDuplicateDefault = 'checkduplicateforuploadfile';
	protected createForUploadFileUrl = '';

	/**
	 * constructor.
	 * @param options data service initialize options.
	 * @param uploadOptions upload options.
	 */
	protected constructor(
		options: IDataServiceOptions<T>,
		protected uploadOptions?: IDocumentServiceUploadOptions,
	) {
		super(options);

		if (uploadOptions) {
			this.createForUploadFileUrl = options.apiUrl + '/' + (uploadOptions.endPoint ?? this.EndPointUploadDefault);
			this.uploadService = BasicsSharedFileUploadServiceFactory.getService(this.injector, uploadOptions);
			this.documentManager = new DocumentManagerService<T>(this, { configs: uploadOptions.configs, checkDuplicateClientSide: uploadOptions.checkDuplicate?.checkClientSide }, this.uploadService);
		} else {
			//todo: remove this after all derived classes have provided uploadOptions.
			this.documentManager = new DocumentManagerService<T>(this, { configs: { sectionType: BasicsUploadSectionType.Dummy } }); // Only for compatible. This fallback should not happen in production.
		}

		this.documentManager.enableOnlineEdit().then((result) => {
			this.onlineEditBtVisible = result;
		});

		this.registerUploadCompletion();
	}

	/**
	 * subscribe the files upload finished event and create documents
	 */
	private registerUploadCompletion() {
		this.uploadService?.uploadFilesComplete$.subscribe(async (result) => {
			if (!result.FileInfoArray || result.FileInfoArray.length === 0) {
				return;
			}
			if (result.SelectedEntityId) {
				await this.updateSelectedAfterUploaded(result.SelectedEntityId, result.FileInfoArray[0]);
			} else {
				const identData = this.getIdForCreate();
				const sectionType = this.uploadOptions?.configs.sectionType.toString();
				if (!identData || !sectionType) {
					return;
				}
				const postData: ICreateForUploadFileRequest = {
					IdentData: identData,
					UploadedFileDataList: result.FileInfoArray,
					ExtractZipOrNot: false, //todo: get from UI.
					SectionType: sectionType,
				};
				if (this.uploadOptions?.checkDuplicate?.checkServerSide) {
					await this.createDocumentsForUploadFilesWithDupCheck(postData);
				} else {
					this.createDocumentsForUploadFiles(postData);
				}
			}
		});
	}

	/**
	 * Update entity with fileInfo after file uploaded for selected entity.
	 * @param selectedEntityId
	 * @param fileInfo
	 * @protected
	 */
	protected async updateSelectedAfterUploaded(selectedEntityId: IEntityIdentification, fileInfo: IFileInfo) {
		const toUpdate = this.getList().find((item) => item.Id === selectedEntityId.Id);
		if (toUpdate) {
			await this.setDocEntityFileInfo(toUpdate, fileInfo);
			this.setModified(toUpdate);
		}
	}

	/**
	 * Override this method if it has additional fields to update.
	 * @param toUpdate
	 * @param fileInfo
	 * @protected
	 */
	protected async setDocEntityFileInfo(toUpdate: T, fileInfo: IFileInfo) {
		toUpdate.FileArchiveDocFk = fileInfo.FileArchiveDocId;
		toUpdate.OriginFileName = fileInfo.FileName;
		toUpdate.DocumentDate = new Date().toISOString();

		let fileName = fileInfo.FileName; // if this length limitation can be retrieved, replace this improper fixed length limitation.
		if (fileName.length > this.MaxLengthOfDescription) {
			fileName = fileName.slice(0, this.MaxLengthOfDescription);
		}
		toUpdate.Description = fileName;

		const documentType = await this.documentManager.getDocumentType(fileInfo.FileName);
		if (documentType) {
			toUpdate.DocumentTypeFk = documentType.Id;
		}
	}

	/**
	 * Override this to provide a different parent entity for creating document.
	 * @protected
	 */
	protected getParentForCreate(): IEntityIdentification | undefined {
		return this.getSelectedParent();
	}

	private getIdForCreate(): IEntityIdentification | undefined {
		const parentId = this.getParentForCreate();
		if (parentId) {
			return { Id: 0, PKey1: parentId.Id };
		}
		return undefined;
	}

	/**
	 * Override this to provide entity schema id.
	 * The default implementation returns `undefined`, in which case no processor based on schema
	 * will be automatically created and added to the service.
	 * @return entity schema id.
	 */
	protected get entitySchemaId(): IEntitySchemaId | undefined {
		return undefined;
	}

	/**
	 * Override this to provide the flag whether the parent entity is readonly.
	 * The default implementation returns `false`, in which case
	 * parent item is taken as not readonly.
	 * @return true if parent entity is readonly.
	 */
	public IsParentEntityReadonly(): boolean {
		return false;
	}

	/**
	 * Override this to provide the readonly processor if it has a derived readonly processor.
	 * The default implementation returns `DocumentDataReadonlyProcessorService`, in which case
	 * DocumentDataReadonlyProcessorService is used.
	 * @return document leaf data readonly processor.
	 */
	protected provideReadonlyProcessor(): DocumentDataReadonlyProcessorService<T, PT, PU> | undefined {
		return new DocumentDataReadonlyProcessorService(this);
	}

	protected override provideAllProcessor(options: IDataServiceOptions<T>): IEntityProcessor<T>[] {
		const allProcessor = super.provideAllProcessor(options);
		this.dateProcessor = this.provideDateProcessor();
		if (this.dateProcessor) {
			allProcessor.push(this.dateProcessor);
		}
		this.readonlyProcessor = this.provideReadonlyProcessor();
		if (this.readonlyProcessor) {
			allProcessor.push(this.readonlyProcessor);
		}
		return allProcessor;
	}

	protected provideDateProcessor(): IEntityProcessor<T> | undefined {
		if (this.entitySchemaId) {
			return this.createDateProcessor(this.entitySchemaId);
		}
		return undefined;
	}

	private createDateProcessor(entitySchemaId: IEntitySchemaId): IEntityProcessor<T> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<T>(entitySchemaId);
	}

	/**
	 * Check if it can create new entity.
	 * @return true if it can create.
	 */
	public override canCreate(): boolean {
		if (this.IsParentEntityReadonly()) {
			return false;
		}
		return super.canCreate();
	}

	/**
	 * Check if it can delete entity.
	 * @return true if it can delete.
	 */
	public override canDelete(): boolean {
		if (this.IsParentEntityReadonly()) {
			return false;
		}
		return super.canDelete();
	}

	/**
	 * download files
	 */
	public downloadFiles(): void {
		//todo: start download
		this.documentManager.downloadFiles();
	}

	/**
	 * Upload file(s) and create documents after file(s) uploaded.
	 */
	public uploadAndCreateDocs(): void {
		this.documentManager.uploadAndCreateDocs();
	}

	/**
	 * Upload file for selected entity.
	 */
	public uploadForSelected(): void {
		const selected = this.getSelectedEntity();
		if (selected) {
			this.documentManager.uploadForSelected(selected);
		}
	}

	/**
	 * Check if it can download the file
	 * @return true: can download, false: cannot download.
	 */
	public canDownloadFiles(): boolean {
		return this.documentManager.canDownloadFiles();
	}

	/**
	 * Check if it can upload file and create documents.
	 * @return true if it can upload.
	 */
	public canUploadAndCreateDocs(): boolean {
		return true;
	}

	/**
	 * Check if it can upload file for selected entity.
	 * @return true if it can upload.
	 */
	public canUploadForSelected(): boolean {
		const selectedItem = this.getSelectedEntity();
		return !!(selectedItem && !selectedItem.FileArchiveDocFk);
	}

	/**
	 * download Pdf file about markup (only pdf type and need use ige viewer)
	 */
	public downloadPdf(): void {
		const entity = this.getSelection()[0] as IDocumentBaseEntity;
		if (entity && entity.FileArchiveDocFk) {
			const fileName = entity.OriginFileName as string;
			// TODO IDocumentBaseEntity no modelFk now
			this.documentManager.downloadPdf(null, entity.FileArchiveDocFk, fileName);
		}
	}

	/**
	 * Check whether it can download pdf file about markup
	 * @return true if it can download pdf.
	 */
	public canDownloadPdf(): boolean {
		return this.documentManager.canDownloadPdf();
	}

	/**
	 * Check whether it can online edit office document.
	 * @return return true if it can online edit office document.
	 */
	public canOnlineEditOfficeDocument(): boolean {
		return this.documentManager.canOnlineEditOfficeDocument();
	}

	/**
	 * Check whether it can synchronize the online edited office document back to 4.0.
	 * @return return true if it can synchronize online edited office document.
	 */
	public canSynchronizeDocument(): boolean {
		return this.documentManager.canSynchronizeDocument();
	}

	/**
	 * Online edit office document.
	 */
	public onlineEditOfficeDocument() {
		this.documentManager.onlineEditOfficeDocument();
	}

	/**
	 * Synchronize the online edited office document back to 4.0.
	 * @return
	 */
	public synchronizeOfficeDocument(): void {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity && selectedEntity.FileArchiveDocFk) {
			this.documentManager.synchronizeOfficeDocument(selectedEntity.FileArchiveDocFk).then((result) => {
				if (result && result.Success) {
					this.refreshSelectedParent();
				}
			});
		}
	}

	private refreshSelectedParent() {
		if (this.typedParent && this.typedParent.isRoot()) {
			const selectedEntity = this.typedParent.getSelectedEntity();
			if (selectedEntity) {
				const rootRole = this.typedParent as unknown as IRootRole<PT, PU>;
				rootRole.refreshOnlySelected([selectedEntity]).then();
			}
		}
	}

	protected async createDocumentsForUploadFilesWithDupCheck(postData: ICreateForUploadFileRequest) {
		//let roleService = dataService.parentEntityRoleService();  // whether still necessary for procurement?
		//roleService.updateAndExecute(function () {
		let endPoint = this.EndPointCheckDuplicateDefault;
		if (this.uploadOptions?.checkDuplicate?.checkServerSide && typeof this.uploadOptions?.checkDuplicate?.checkServerSide === 'object' && this.uploadOptions?.checkDuplicate?.checkServerSide?.endPoint) {
			endPoint = this.uploadOptions?.checkDuplicate?.checkServerSide?.endPoint;
		}
		const checkDuplicateUrl = this.options.apiUrl + '/' + endPoint;
		const resData = await this.httpService.post<IUploadedFileInfo[]>(checkDuplicateUrl, postData as ICheckDuplicateForUploadFileRequest);
		const duplicateFiles = resData.filter((fileData) => fileData.IsExist).map((fileData, index) => ({ Id: index, Info: fileData.FileName }));

		if (duplicateFiles.length === 0) {
			this.createDocumentsForUploadFiles(postData);
		} else {
			const result = await this.documentManager.showInfoFilesExist(duplicateFiles);
			if (result?.closingButtonId === StandardDialogButtonId.Ok) {
				this.createDocumentsForUploadFiles(postData);
			} else {
				if (postData.UploadedFileDataList.length >= 1) {
					const fileArchiveDocIds = postData.UploadedFileDataList.map((file) => file.FileArchiveDocId).filter((id) => !!id);
					await this.httpService.post('documents/projectdocument/deleteFiles', fileArchiveDocIds); // delete uploaded files.
				}
			}
		}
	}

	protected createDocumentsForUploadFiles(postData: ICreateForUploadFileRequest): void {
		this.httpService.post$<ICreateForUploadFileResponse<T>>(this.createForUploadFileUrl, postData).subscribe((res) => {
			if (res.InvalidFileList && res.InvalidFileList.length > 0) {
				this.documentManager.showInfoInvalidFiles(res.InvalidFileList);
			}
			// if parent entity is not saved, please set "IsParentNotSaved=true". e.g. BP Evaluation. Document parent is saved by default.
			if (res.Options?.IsParentNotSaved) {
				const newDocs = res.Documents;
				if (newDocs && newDocs.length > 0) {
					// parent is not saved. document entities are created but not saved.
					this.append(newDocs);
					this.setModified(newDocs);
					this.select(newDocs[0]).then();
				}
			} else {
				// document entities are created and saved. Just load again.
				this.load({ id: 0, pKey1: this.getParentForCreate()?.Id }).then();
			}
		});
	}
}
