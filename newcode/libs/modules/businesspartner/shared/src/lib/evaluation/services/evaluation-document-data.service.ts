import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {EvaluationDetailService} from './evaluation-detail.service';
import {find, forEach, each, isArray} from 'lodash';
import {
	BasicsSharedFileUploadService,
	BasicsUploadAction,
	BasicsUploadSectionType,
	IFileInfo
} from '@libs/basics/shared';
import {PlatformHttpService} from '@libs/platform/common';
import {EvaluationCommonService} from './evaluation-common.service';
import { EvaluationSchemaChangedType, ICreateDocsForUploadFileResult, IEvaluationDateSetResponseEntity, IEvaluationDocumentDataResponseEntity, IEvaluationDocumentEntity, IEvaluationGroupCreateParam, IEvaluationGroupLoadParam, TEvaluationSchemaChangedParam } from '@libs/businesspartner/interfaces';


@Injectable({
	providedIn: 'root',
})
export class EvaluationDocumentDataService extends DataServiceFlatNode<IEvaluationDocumentEntity, IEvaluationDocumentDataResponseEntity, IEvaluationDateSetResponseEntity, IEvaluationDateSetResponseEntity> {
	private param!: IEvaluationGroupCreateParam | IEvaluationGroupLoadParam;
	private _hasWrite = true;
	private readonly evaluationDetailService: EvaluationDetailService = inject(EvaluationDetailService);
	private readonly evaluationCommonService = inject(EvaluationCommonService);
	private readonly http = inject(PlatformHttpService);
	private _selected: IEvaluationDocumentEntity | null = null;
	private readonly uploadOptions = {
		uploadServiceKey: this.evaluationDetailService.getServiceName() + '.common.document',
		configs: {
			sectionType: BasicsUploadSectionType.Evaluation,
			action: BasicsUploadAction.UploadWithCompress,
			createForUploadFileRoute: 'businesspartner/main/evaluationdocument/createforuploadfile',
		},

		canPreview: true
	};

	private readonly uploadService = inject(BasicsSharedFileUploadService);

	public extractZipOrNot = false;

	public constructor(evaluationDetailService: EvaluationDetailService) {
		const options: IDataServiceOptions<IEvaluationDocumentEntity> = {
			apiUrl: 'businesspartner/main/evaluationdocument',
			readInfo: {
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: {
				prepareParam: ident => {
					const evaluationEntity = evaluationDetailService.currentSelectItem;
					return {
						PKey1: evaluationEntity ? evaluationEntity.Id : 0,
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationDocumentEntity, IEvaluationDateSetResponseEntity, IEvaluationDateSetResponseEntity>>{
				role: ServiceRole.Node,
				itemName: 'EvaluationDocument',
				// TODO: Check whether this typecast is really safe
				parent: evaluationDetailService as unknown as IEvaluationDateSetResponseEntity,
			},
		};

		super(options);

		this.registerUploadCompletion();
	}

	public set hasWrite(value: boolean) {
		this._hasWrite = value;
	}

	public get hasWrite() {
		return this._hasWrite;
	}

	public override provideLoadPayload(): object {
		const evaluationEntity = this.evaluationDetailService.currentSelectItem;
		return {
			PKey1: evaluationEntity ? evaluationEntity.Id : 0,
		};
	}


	protected override onLoadSucceeded(loaded: object): IEvaluationDocumentEntity[] {
		if (loaded) {
			return loaded as IEvaluationDocumentEntity[];
		}
		return [];
	}


	// public  updateFieldReadonly(item, model) {
	// 	var editable = !service.getCellEditable || service.getCellEditable(item, model);
	// 	platformRuntimeDataService.readonly(item, [{field: model, readonly: !editable}]);
	// }
	//
	// public updateReadOnly(item) {
	// 	updateFieldReadonly(item, 'DocumentTypeFk');
	// }

	// service.getCellEditable = function (item, model) {
	// 	var editable = true;
	// 	if (model === 'DocumentTypeFk') {
	// 		editable = !item.FileArchiveDocFk;
	// 	}
	// 	return editable;
	// };


	public set selected(value: IEvaluationDocumentEntity | null) {
		this._selected = value;
	}

	public get selected(): IEvaluationDocumentEntity | null {
		return this._selected;
	}

	public evaluationSchemaChangedHandler(param: TEvaluationSchemaChangedParam) {
		this.param = param;
		switch (param.changedType) {
			case EvaluationSchemaChangedType.create:
				return this.create();
			case EvaluationSchemaChangedType.view:
				return this.load({id: 0});
			default:
				return Promise.resolve(null);
		}
	}

	public incorporateDataRead(readItems: IEvaluationDocumentDataResponseEntity) {
		this.setList([]);
		const items = readItems.Main;
		if (this.param.changedType === EvaluationSchemaChangedType.view) {
			// var localEvaluationData = this.evaluationDetailService.collectLocalEvaluationDataScreen.fire();
			// if (localEvaluationData && localEvaluationData.EvaluationDocumentToSave) {
			// 	forEach(localEvaluationData.EvaluationDocumentToSave, function (item) {
			// 		var saveData = _.find(items, {Id: item.MainItemId});
			// 		if (!saveData) {
			// 			items.push(item.EvaluationDocument);
			// 		}
			// 	});
			// }
		}
		const isCreate = !items || items.length <= 0;
		this.updateItemsSource(isCreate);
		each(items, item => {
			this.getList().push(item);
		});
		forEach(items, item => {
			this.processItemReadonly(item);
		});
		//platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
		// data.listLoaded.fire(items);
		return this.getList();
	}

	private updateItemsSource(isCreate: boolean) {
		// var uploadServiceKey = uploadOptions.uploadServiceKey;
		// var uploadService = basicsCommonFileUploadServiceLocator.getService(uploadServiceKey);
		// if (!isCreate) {
		// 	var newValue = uploadService.getAllItemsSource();
		// 	var evaluationSelected = evaluationDetailService.getSelected();
		// 	if (evaluationSelected && evaluationSelected.Id) { // about the business partner evaluation dialog document upload
		// 		var filterByEvaluationId = _.filter(newValue, function (item) {
		// 			return item.entity.EvaluationFk === evaluationSelected.Id;
		// 		});
		// 		uploadService.setItemsSource(filterByEvaluationId);
		// 	}
		// } else {
		// 	uploadService.setItemsSource([]);
		// }
	}

	public uploadAndCreateDocs(): void {
		this.uploadService.uploadFiles(this.uploadOptions.configs);
	}

	public addNewDocumentsToGrid(documents: IEvaluationDocumentEntity[]) {
		// platformDataServiceDataProcessorExtension.doProcessData(documents, data);
		const docList = this.getDocList();
		forEach(documents, document => {
			docList.push(document);
			// serviceContainer.data.listLoaded.fire();
			this.markItemAsModified(document);
		});
		this.evaluationCommonService.onDocumentViewGridRefreshEvent.emit(docList);
	}

	public addEntitiesToDeleted(entities: IEvaluationDocumentEntity[]) {
		this.delete(entities);
	}

	public markItemAsModified(item: IEvaluationDocumentEntity) {
		const modifiedDataCache = this.evaluationDetailService.getModifiedDataCache();
		let docToSaves = modifiedDataCache.EvaluationDocumentToSave;

		if (!docToSaves) {
			docToSaves = [
				{
					MainItemId: item.Id,
					EvaluationDocument: item
				}
			];
			modifiedDataCache.EntitiesCount += 1;
		} else {
			const existed = find(docToSaves, {MainItemId: item.Id});
			if (!existed) {
				docToSaves.push(
					{
						MainItemId: item.Id,
						EvaluationDocument: item
					}
				);
				modifiedDataCache.EntitiesCount += 1;
			}
		}
		// data.itemModified.fire(null, item);
	}

	private processItemReadonly(newItem: IEvaluationDocumentEntity) {
		this.setEntityReadOnly(newItem, !this._hasWrite);
		if (!this._hasWrite) {
			return;
		}

		if (newItem.FileArchiveDocFk) {
			const fields = [{
				field: 'DocumentTypeFk',
				readOnly: true
			}];
			this.setEntityReadOnlyFields(newItem, fields);
		}

		const parentSelected = this.evaluationDetailService ? this.evaluationDetailService.currentSelectItem : null;
		if (parentSelected) {
			const evaluationStatus = this.evaluationDetailService.getEvaluationStatus();
			const status = find(evaluationStatus, {'Id': parentSelected.EvalStatusFk});
			const allfields = [
				{
					field: 'DocumentTypeFk',
					readOnly: true
				},
				{
					field: 'Description',
					readOnly: true
				},
				{
					field: 'DocumentDate',
					readOnly: true
				},
				{
					field: 'OriginFileName',
					readOnly: true
				}];
			if (status?.Readonly) {
				this.setEntityReadOnlyFields(newItem, allfields);
			}

			// set readonly by Evaluation IsReadonly
			if (parentSelected.IsReadonly) {
				this.setEntityReadOnlyFields(newItem, allfields);
			}
		}
	}

	private checkReadOnly() {
		const headerSelectedItem = this.evaluationDetailService.currentSelectItem;
		const evaluationStatus = this.evaluationDetailService.getEvaluationStatus();
		const status = find(evaluationStatus, {'Id': headerSelectedItem!.EvalStatusFk});
		let isReadonly = false;

		// set readonly by Evaluation IsReadonly
		if (headerSelectedItem?.IsReadonly) {
			isReadonly = true;
		}
		return !(status?.Readonly || isReadonly);
	}

	public clearAllData() {
		this.setList([]);
		this._selected = null;
	}

	public getDocList() {
		const list = this.getList();
		if (isArray(list)) {
			return list;
		} else {
			return (this.getList() as unknown as IEvaluationDocumentDataResponseEntity).Main;
		}
	}

	private registerUploadCompletion() {
		this.uploadService.uploadFilesComplete$.subscribe((result) => {
			const {FileInfoArray} = result;
			if (FileInfoArray && FileInfoArray.length > 0) {
				this.createDocumentsForUploadFiles(FileInfoArray);
			}
		});
	}

	private createDocumentsForUploadFiles(uploadedFileDataArray: IFileInfo[]) {
		const requestData = {
			identData: {
				PKey1: this.evaluationDetailService.currentSelectItem!.Id
			},
			UploadedFileDataList: uploadedFileDataArray,
			ExtractZipOrNot: this.extractZipOrNot,
			SectionType: this.uploadOptions.configs.sectionType
		};

		this.http.post$<ICreateDocsForUploadFileResult>(this.uploadOptions.configs.createForUploadFileRoute, requestData).subscribe(response => {
			this.addNewDocumentsToGrid(response.Documents);
		});
	}
}
