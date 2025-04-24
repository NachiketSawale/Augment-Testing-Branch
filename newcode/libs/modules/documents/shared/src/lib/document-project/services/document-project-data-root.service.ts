/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntitySelection, ServiceRole } from '@libs/platform/data-access';
import { DocumentComplete } from '../../model/document-complete.class';
import { IDocumentProjectEntity } from '../../model/entities/document-project-entity.interface';
import { IDocumentService } from '../../base-document/services/interface/document-service.interface';
import { DocumentOperationTypeEnum, IDatengutFile, IDownloadIdentificationData, IFileInfo, MainDataDto } from '@libs/basics/shared';
import { DocumentProjectRelationReadonlyProcessorService } from './document-project-shared-relation-readonly-processor.service';
import { IDocumentFilterForeignKeyEntity } from '../../model/interfaces/document-filter-foreign-key-entity.interface';
import { HttpClient } from '@angular/common/http';
import { DocumentProjectFileUploadService } from './document-project-file-upload.service';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IDocumentParentEntity } from '../../model/interfaces/document-parent-entity.interface';
import { DocumentProjectFileDownloadService } from './document-project-file-download.service';
import { DocumentProjectManagerService } from './document-project-manager.service';
import { DocumentsFileSizeProcessorService } from '../../service/document-file-size-processor.service';
export class DocumentProjectDataRootService<T extends object> extends DataServiceFlatRoot<IDocumentProjectEntity, DocumentComplete> implements IDocumentService<IDocumentProjectEntity> {
	public cancelUploadFilesBtVisible: boolean = true;
	public downloadFilesBtVisible: boolean = true;
	public onlineEditBtVisible: boolean = true;
	public previewBtVisible: boolean = true;
	public uploadAndCreateDocsBtVisible: boolean = true;
	public uploadForSelectedBtVisible: boolean = true;

	public readonly uploadService = inject(DocumentProjectFileUploadService);
	public readonly createDocUrl = 'documents/projectdocument/createDocumentProjectAndDocumentRevisionForUploadFileNew';
	protected readonly http = inject(HttpClient);
	public createBtVisible: boolean = true;
	private readonly readonlyProcessor: DocumentProjectRelationReadonlyProcessorService<T>;
	protected readonly configService = inject(PlatformConfigurationService);
	private readonly documentProjectFileDownloadService = inject(DocumentProjectFileDownloadService);
	public readonly readonlyFileSizeProcessor = new DocumentsFileSizeProcessorService();

	public documentProjectManager = new DocumentProjectManagerService<IDocumentProjectEntity>(this, this.uploadService);

	public constructor(
		protected parentDataService?: IEntitySelection<T>,
		options?: IDataServiceOptions<IDocumentProjectEntity>,
	) {
		if (options === null || options === undefined) {
			options = {
				apiUrl: 'documents/projectdocument/final',
				createInfo: {
					endPoint: 'createDocument',
					usePost: true,
					prepareParam: (ident) => {
						const params = {};
						return params;
					},
				},
				readInfo: <IDataServiceEndPointOptions>{
					endPoint: 'listDocuments',
					usePost: true,
				},
				deleteInfo: <IDataServiceEndPointOptions>{
					endPoint: 'deleteComplete',
				},
				roleInfo: <IDataServiceRoleOptions<IDocumentProjectEntity>>{
					role: ServiceRole.Root,
					itemName: 'Document',
				},
			};
		}

		super(options);
		this.parentDataService = parentDataService;
		if (this.parentDataService && this.parentDataService !== undefined) {
			this.parentDataService.selectionChanged$.subscribe((selection) => {
				const parent = this.parentDataService!.getSelection()[0];
				if (parent) {
					this.refreshByParentChange();
				}
			});
		}
		if(this.documentProjectFileDownloadService !== undefined){
			this.documentProjectFileDownloadService.historyChanged$.subscribe(()=>{
				this.refreshSelected();//todo-refreshSelected doesn't work
			});
		}
		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor([this.readonlyProcessor, this.readonlyFileSizeProcessor]);

		this.documentProjectManager.enableOnlineEdit().then((result) => {
			this.onlineEditBtVisible = result;
		});

		this.registerUploadCompletion();
	}

	public getParentService() {
		return this.parentDataService;
	}

	/**
	 * subscribe the files upload finished and create documents
	 */
	private registerUploadCompletion() {
		this.uploadService.uploadFilesComplete$.subscribe((result) => {
			const { FileInfoArray } = result;
			if (FileInfoArray && FileInfoArray.length > 0) {
				if (result.SelectedEntityId) {
					this.createUploadFileRevision(FileInfoArray);
				} else {
					this.createDocumentsForUploadFile(FileInfoArray);
				}
			}
		});
	}

	//create new documents and revisions
	public createDocumentsForUploadFile(files: IFileInfo[]): void {
		const postDocumentData = {
			ExtractZipOrNot: false,
			UploadedFileDataList: files,
			ParentEntityInfo: this.getDocumentParentInfo(),
			ColumnConfig: this.getColumnConfig(),
			ModuleName: '',
		};
		this.http.post(this.configService.webApiBaseUrl + this.createDocUrl, postDocumentData).subscribe((res) => {
			const resDto = new MainDataDto<IDocumentProjectEntity>(res);
			const dtos = resDto.getValueAs<IDocumentProjectEntity[]>('dtos') || ([] as IDocumentProjectEntity[]);
			this.append(dtos);
			this.setModified(dtos);
			this.select(dtos[0]);
		});
	}

	//create revision for exist document
	public createUploadFileRevision(files: IFileInfo[]): void {
		const postDocumentData = {
			ExtractZipOrNot: false,
			UploadedFileDataList: files,
			DocumentDto: this.getSelectedEntity(),
		};

		this.http.post(this.configService.webApiBaseUrl + 'documents/projectdocument/createDocument', [postDocumentData]).subscribe((res) => {
			this.refreshSelected();
		});
	}

	public override createUpdateEntity(modified: IDocumentProjectEntity | null): DocumentComplete {
		const complete = new DocumentComplete();
		if (modified !== null) {
			complete.Document = [modified];
		}

		if (modified === null && this.hasSelection()) {
			const selected = this.getSelectedEntity();
			if (selected) {
				modified = selected;
			}
		}
		if (modified !== null) {
			complete.Document = [modified];
		}

		return complete;
	}

	protected override onCreateSucceeded(created: IDocumentProjectEntity): IDocumentProjectEntity {
		if (this.parentDataService && this.parentDataService !== undefined) {
			const parent = this.parentDataService.getSelection()[0];
			if (parent) {
				this.onDocumentCreated(created);
			}
		}
		return created;
	}

	public override canDelete(): boolean {
		if (!super.canDelete() || !this.getSelectedEntity()) {
			return false;
		}
		return true;
	}

	protected onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		return created;
	}

	public override getModificationsFromUpdate(complete: DocumentComplete): IDocumentProjectEntity[] {
		return complete.Document ?? [];
	}

	protected refreshByParentChange() {
		const searchPayload = {
			executionHints: false,
			filter: '',
			includeNonActiveItems: false,
			isReadingDueToRefresh: false,
			pageNumber: 0,
			pageSize: 0,
			pattern: '',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: true,
			ModuleName: '',
			FilterKeyName: '',
			FilterKeys: [],
		};
		const filters = this.getFilterCriteria();
		if (filters) {
			searchPayload.pattern = Object.entries(filters)
				.filter(([key, value]) => value !== undefined && value !== null)
				.map(([key, value]) => `${key}=${value}`)
				.join('; ');
		}
		this.refresh(searchPayload);
	}

	protected getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		return {};
	}

	protected getDocumentParentInfo(): IDocumentParentEntity {
		return {};
	}

	public downloadFiles(): void {
		const selectedItems = this.getSelection();
		const datengutFiles: IDatengutFile[] = [];
		//get the ArchiveElementIds for datengut files
		selectedItems.map((item: IDocumentProjectEntity) => {
			const archiveId = item.ArchiveElementId ? item.ArchiveElementId : '';
			datengutFiles.push({ ArchiveElementId: archiveId, FileName: '' });
		});
		//get FileArchiveDocFk for normal files
		const docIdArray: number[] = selectedItems.filter((item) => item.FileArchiveDocFk != null).map((item) => item.FileArchiveDocFk!);

		const downloadIdentificationData:IDownloadIdentificationData={
			DatengutFiles:datengutFiles,
			projectDocIds : selectedItems.map(e=>e.Id),
			operationType:DocumentOperationTypeEnum.Download
		};
		this.documentProjectManager.downloadDocByIds(docIdArray, downloadIdentificationData);
	}

	public uploadAndCreateDocs(): void {
		this.documentProjectManager.uploadAndCreateDocs();
	}

	public uploadForSelected(): void {
		const selected = this.getSelectedEntity();
		if(selected){
			this.documentProjectManager.uploadForSelected(selected);
		}
	}

	public canDownloadFiles(): boolean {
		const selectedItems = this.getSelection();
		if (selectedItems.length < 1) {
			return false;
		}
		//get the ArchiveElementIds for datengut files
		const datengutFiles = selectedItems.filter((item) => item.ArchiveElementId && item.ArchiveElementId !== '').map((item) => ({ ArchiveElementId: item.ArchiveElementId, FileName: '' }));

		//get FileArchiveDocFk for normal files
		const docIdArray = selectedItems.filter((item) => item.FileArchiveDocFk != null).map((item) => item.FileArchiveDocFk!);

		return datengutFiles.length > 0 || docIdArray.length > 0;
	}

	public canUploadAndCreateDocs(): boolean {
		return true;
	}

	public canUploadForSelected(): boolean {
		const selectedItem = this.getSelection()[0];
		return selectedItem && !selectedItem.FileArchiveDocFk;
	}

	protected createReadonlyProcessor() {
		return new DocumentProjectRelationReadonlyProcessorService(this);
	}

	//column config fields override this function
	public getColumnConfig() {
		return [
			{ documentField: 'PrjProjectFk', readOnly: false },
			{ documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false },
			{ documentField: 'ConHeaderFk', readOnly: false },
			{ documentField: 'MdcControllingUnitFk', readOnly: false },
			{ documentField: 'MdcMaterialCatalogFk', readOnly: false },
			{ documentField: 'PrcPackageFk', readOnly: false },
			{ documentField: 'InvHeaderFk', readOnly: false },
			{ documentField: 'PrcStructureFk', readOnly: false },
			{ documentField: 'PesHeaderFk', readOnly: false },
			{ documentField: 'BpdCertificateFk', readOnly: false },
			{ documentField: 'EstHeaderFk', readOnly: false },
			{ documentField: 'PrjLocationFk', readOnly: false },
			{ documentField: 'PsdActivityFk', readOnly: false },
			{ documentField: 'PsdScheduleFk', readOnly: false },
			{ documentField: 'QtnHeaderFk', readOnly: false },
			{ documentField: 'RfqHeaderFk', readOnly: false },
			{ documentField: 'ReqHeaderFk', readOnly: false },
			{ documentField: 'BilHeaderFk', readOnly: false },
			{ documentField: 'WipHeaderFk', readOnly: false },
		];
	}

	public downloadPdf(): void {
		const entity = this.getSelection()[0];
		if (entity && entity.FileArchiveDocFk) {
			const fileName = entity.OriginFileName as string;
			this.documentProjectManager.downloadPdf(entity.ModelFk, entity.FileArchiveDocFk, fileName);
		}
	}

	public canDownloadPdf(): boolean {
		return this.documentProjectManager.canDownloadPdf();
	}

	public canOnlineEditOfficeDocument(): boolean {
		return this.documentProjectManager.canOnlineEditOfficeDocument();
	}

	public canSynchronizeDocument(): boolean {
		return this.documentProjectManager.canSynchronizeDocument();
	}

	public onlineEditOfficeDocument() {
		this.documentProjectManager.onlineEditOfficeDocument();
	}

	public synchronizeOfficeDocument(): void {
		const selectedEntity = this.getSelectedEntity();
		if (selectedEntity && selectedEntity.FileArchiveDocFk) {
			this.documentProjectManager.synchronizeOfficeDocument(selectedEntity.FileArchiveDocFk).then((result) => {
				if (result && result.Success) {
					const selectedEntities: IDocumentProjectEntity[] = [selectedEntity];
					this.refreshOnlySelected(selectedEntities).then(); //this refresh seems doesn't work currently.
				}
			});
		}
	}
}
