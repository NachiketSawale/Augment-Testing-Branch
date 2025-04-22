/*
 * Copyright(c) RIB Software GmbH
*/

import {inject, Injectable} from '@angular/core';
import {
	DataServiceFlatRoot,
	IChildRoleBase,
	IDataServiceOptions,
	IReadOnlyField,
	ServiceRole
} from '@libs/platform/data-access';
import {PlatformConfigurationService, PlatformHttpService, PlatformLazyInjectorService} from '@libs/platform/common';
import {EvaluationCommonService} from './evaluation-common.service';
import {extend} from 'lodash';
import {IBasicsCustomizeEvaluationStatusEntity} from '@libs/basics/interfaces';
import {
	CallbackFun,
	EvaluationSaveType,
	IEvaluationSchemaIconEntity,
	IEvaluationEntity,
	IEvaluationGroupDataEntity,
	IEventEmitterParam,
	IExtendCreateOptions,
	IExtendUpdateOptions,
	NUMBER_GENERATION_PROVIDER,
	ScreenEvaluationCompleteEntity,
	IEvaluationDateSetResponseEntity,
	IEvaluationCreateDateSetResponseEntity,
	IEvaluationGetListResponseEntity,
	BusinessPartnerEvaluationSchemaIconLookupService,
	IBusinessPartnerEvaluationSchemaIconData
} from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class EvaluationDetailService extends DataServiceFlatRoot<IEvaluationGetListResponseEntity, IEvaluationCreateDateSetResponseEntity> {
	private modifiedDataCache: ScreenEvaluationCompleteEntity = {
		EntitiesCount: 0,
	};
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	private readonly commonService = inject(EvaluationCommonService);
	private readonly lazyInjectorService = inject(PlatformLazyInjectorService);
	private schemaIcons: IEvaluationSchemaIconEntity[] = [];
	private evaluationStatus?: IBasicsCustomizeEvaluationStatusEntity[] | null = [];
	private readonly evaluationSchemaIconLookupService: BusinessPartnerEvaluationSchemaIconLookupService<IBusinessPartnerEvaluationSchemaIconData> = inject(BusinessPartnerEvaluationSchemaIconLookupService);
	private _currentItem: IEvaluationEntity | null = null;

	private _hasWrite = true;

	public createOptions!: IExtendCreateOptions;
	public updateOptions!: IExtendUpdateOptions;
	public UpdateDoneCallBackArray: Array<CallbackFun<ScreenEvaluationCompleteEntity>> = [];

	public constructor() {
		const options: IDataServiceOptions<IEvaluationGetListResponseEntity> = {
			apiUrl: 'businesspartner/main/evaluation',
			createInfo: {
				endPoint: 'createevaluation',
				usePost: true,
			},
			readInfo: {
				endPoint: 'listevaluation',
				usePost: true,
				prepareParam: (ident) => {
					return {
						value: this.updateOptions.evaluationId!,
					};
				},
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'Evaluation',
			},
		};

		super(options);

		this.onInit();
	}

	public override registerChildService(childService: IChildRoleBase<IEvaluationGetListResponseEntity, IEvaluationCreateDateSetResponseEntity>) {
		super.registerChildService(childService);
	}

	public override createUpdateEntity(modified: IEvaluationGetListResponseEntity | null): IEvaluationCreateDateSetResponseEntity {
		if (modified) {
			// TODO: Check whether this typecast is really safe
			return modified as unknown as IEvaluationCreateDateSetResponseEntity;
		}
		return {};
	}

	public override getModificationsFromUpdate(complete: IEvaluationCreateDateSetResponseEntity): IEvaluationGetListResponseEntity[] {
		if (complete){
			// TODO: Check whether this typecast is really safe
			return [complete as unknown as IEvaluationGetListResponseEntity];
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		return { ...this.createOptions };
	}

	public override onCreateSucceeded(value: object): IEvaluationGetListResponseEntity {
		const result = value as IEvaluationGetListResponseEntity;
		result.Id = 0;
		return result;
	}

	public override isParentFn(parentKey: object, entity: IEvaluationGetListResponseEntity): boolean {
		return true;
	}

	private onInit() {
		this.commonService.onEvaluationSchemaChanged.subscribe(next => {
			this.schemaChangedHandler();
		});
	}

	public set currentSelectItem(value: IEvaluationEntity | null) {
		this._currentItem = value;
	}

	public get currentSelectItem(): IEvaluationEntity | null {
		if (this._currentItem) {
			return this._currentItem;
		}

		let currentItem: IEvaluationEntity | null = null;
		const entity = this.getSelectedEntity();
		if (entity) {
			const dtos = entity.dtos;
			if (dtos && dtos.length > 0) {
				currentItem = dtos[0];
			}
		}
		return currentItem;
	}

	public set hasWrite(value: boolean) {
		this._hasWrite = value;
	}

	public get hasWrite() {
		return this._hasWrite;
	}

	public loadItem(updateOption: IExtendUpdateOptions) {
		this.updateOptions = updateOption;
		this.UpdateDoneCallBackArray.push((data) => this.saveCallbackFun(data!, EvaluationSaveType.ISUPDATE));
		return this.provider.load({ id: 0 });
	}

	private saveCallbackFun(data: ScreenEvaluationCompleteEntity, evaluationSaveType: EvaluationSaveType) {
		data.Evaluation = this.currentSelectItem;
		this.commonService.onEvaluationDataMergeDataEvent.emit({
			entity: data,
			saveType: evaluationSaveType,
		});
	}

	private setReadOnly(newItem: IEvaluationEntity) {
		// platformRuntimeDataService.readonly(newItem, !hasWrite);
		// if (!hasWrite) {
		// 	return;
		// }
		//
		// var readonlyFields = [],
		// 	evaluationColumns = _.map(createOptions.columns, function (column) {
		// 		return column.field;
		// 	}),
		// 	businessParters = basicsLookupdataLookupDescriptorService.getData('businesspartner.evluation');
		// var canEditReferences = (service.create && service.create.canEditReferences) || (service.view && service.view.canEditReferences);
		//
		// if (service.view) {
		// 	readonlyFields = readonlyFields.concat([{
		// 		'field': 'EvaluationSchemaFk',
		// 		'readonly': true
		// 	}]);
		// }
		// if (!canEditReferences) {
		// 	readonlyFields = readonlyFields.concat([
		// 		{
		// 			'field': 'ProjectFk',
		// 			'readonly': true
		// 		}, {
		// 			'field': 'QtnHeaderFk',
		// 			'readonly': true
		// 		}, {
		// 			'field': 'ConHeaderFk',
		// 			'readonly': true
		// 		}, {
		// 			'field': 'InvHeaderFk',
		// 			'readonly': true
		// 		}
		// 	]);
		// }
		//
		// if (newItem.Version === 0 && newItem.RubricCategoryId && businessPartnerEvaluationNumberGenerationSettingsService.hasToGenerateForRubricCategory(newItem.RubricCategoryId)) {
		// 	readonlyFields = readonlyFields.concat([{field: 'Code', readonly: true}]);
		// }
		// else {
		// 	let codeReadOnly=false;
		// 	if(service.view)
		// 	{
		// 		codeReadOnly = true;
		// 	}
		// 	readonlyFields = readonlyFields.concat([{field: 'Code', readonly: codeReadOnly}]);
		// }
		//
		// // when businessparter fk2 not null
		// if (2 === _.values(businessParters).length) {
		// 	readonlyFields = readonlyFields.concat([{field: 'BusinessPartnerFk', readonly: false}]);
		// } else {
		// 	readonlyFields = readonlyFields.concat([{field: 'BusinessPartnerFk', readonly: true}]);
		// }
		//
		// // set readonly by Evaluation IsReadonly
		// if (newItem.IsReadonly) {
		// 	readonlyFields = readonlyFields.concat(getReadonlyFields(evaluationColumns));
		// } else if (newItem.EvalStatusFk) {
		// 	basicsLookupdataLookupDescriptorService.getItemByKey('EvaluationStatus', newItem.EvalStatusFk).then(function (evalStatus) {
		// 		if (evalStatus && evalStatus.Readonly) {
		// 			// readonlyFields = readonlyFields.concat(getReadonlyFields(evaluationColumns));
		// 			platformRuntimeDataService.readonly(newItem, getReadonlyFields(evaluationColumns));
		// 		}
		// 	});
		// }
		//
		// readonlyFields = createOptions.extendReadonlyFields(readonlyFields);
		//
		// platformRuntimeDataService.readonly(newItem, readonlyFields);
	}

	// private getReadonlyFields(fields) {
	// 	const readonlyFields = [];
	// 	forEach(fields, function (field) {
	// 		readonlyFields.push({field: field, readonly: true});
	// 	});
	// 	return readonlyFields;
	// }

	// function updateItem(newItem) {
	// 	if (newItem.EvaluationSchemaFk === 0) {
	// 		newItem.EvaluationSchemaFk = null;
	// 	}
	// }

	public getEvaluationStatus() {
		return this.evaluationStatus;
	}

	private handleUpdateDone(response: ScreenEvaluationCompleteEntity) {
		while (this.UpdateDoneCallBackArray.length > 0) {
			const callBackFun = this.UpdateDoneCallBackArray.shift();
			if (callBackFun) {
				callBackFun(response);
			}
		}
	}

	public pointsChangeHanler(groupDataList: IEvaluationGroupDataEntity[]) {
		this.http.post<number>('businesspartner/main/evaluation/updateevaluationtotal', groupDataList).then((response) => {
			if (response) {
				this.setEvaluationDetailPoint(response);
			}
		});
	}

	public setEvaluationDetailPoint(points: number) {
		const currentItem = this.currentSelectItem;
		if (currentItem) {
			const oldPoints = currentItem.Points;
			currentItem.Points = Math.round(points * 100) / 100;
			if (oldPoints !== currentItem.Points) {
				this.setPointsIcon();
				// markCurrentItemAsModified();
			}
		}
	}

	private setPointsIcon() {
		const currentItem = this.currentSelectItem;
		if (currentItem) {
			let flag = false;

			for (const schemaIcon of this.schemaIcons){
				if (currentItem.Points && schemaIcon.PointsFrom <= currentItem.Points && schemaIcon.PointsTo >= currentItem.Points /* && currentItem.Points !== 0 */) {
					flag = true;
					const value = this.evaluationSchemaIconLookupService.getListSync();
					const icon = 'ico-' + value[schemaIcon.Icon! - 1].Name;
					currentItem.Icon = schemaIcon.Icon;
					currentItem.IconSrc = 'cloud.style/content/images/control-icons.svg#' + icon;
					break;
				}
			}
			if (!flag) {
				currentItem.Icon = null;
				currentItem.IconSrc = '';
			}
		}
	}

	public clearAllData() {
		this.UpdateDoneCallBackArray.length = 0;
		this.modifiedDataCache = { EntitiesCount: 0 };

		// service.create = null;
		// service.view = null;
		// service.UpdateDoneCallBackArray.length = 0;
		// data.modifiedDataCache = {EntitiesCount: 0};
	}

	private incorporateDataRead(readItems: IEvaluationDateSetResponseEntity) {
		// jshint ignore:line
		// this.setList([]);
		// this.select(null);

		// 	var localEvaluationData;
		this.evaluationStatus = readItems ? readItems.EvaluationStatus : [];
		if (this.updateOptions?.getDataFromLocal) {
			// 		readItems = readItems || {};
			// 		localEvaluationData = service.collectLocalEvaluationDataScreen.fire();
			// 		if (localEvaluationData && localEvaluationData.Evaluation) {
			// 			if (_.isArray(readItems.dtos) && readItems.dtos.length > 0) {
			// 				if (readItems.dtos[0].Version > localEvaluationData.Evaluation.Version) {
			// 					var pid = localEvaluationData.Evaluation.PId;
			// 					Object.assign(localEvaluationData.Evaluation, readItems.dtos[0]);
			// 					localEvaluationData.Evaluation.PId = pid;
			// 				}
			//
			// 				if (localEvaluationData.Evaluation.__rt$data && localEvaluationData.Evaluation.__rt$data.errors &&
			// 					localEvaluationData.Evaluation.__rt$data.errors.Code) {
			// 					localEvaluationData.Evaluation.Code = readItems.dtos[0].Code;
			// 					localEvaluationData.Evaluation.__rt$data.errors.Code = undefined;
			// 				}
			// 			}
			// 			readItems.dtos = [localEvaluationData.Evaluation];
			// 			service.markItemAsModified(localEvaluationData.Evaluation);
			// 		}
		}
		// 	else {
		// 		basicsLookupdataLookupDescriptorService.attachData(readItems);
		// 	}
		//
		// 	data.itemList.length = 0;
		// 	for (var i = 0; i < readItems.dtos.length; ++i) {
		// 		data.itemList.push(readItems.dtos[i]);
		// 		service.markItemAsModified(readItems.dtos[i]); // this step is necessary to sync data to other data service
		// 	}
		//
		// 	platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
		//
		// 	data.listLoaded.fire(readItems.dtos);
		//
		// 	if (readItems.dtos.length > 0) {
		// 		data.selectedItem = readItems.dtos[0];
		// 	}
		//
		// 	data.selectionChanged.fire(null, readItems.dtos[0]);
		//
		// 	this.commonService.evaluationSchemaChanged.fire(readItems.dtos[0] ? readItems.dtos[0].EvaluationSchemaFk : null);
		//
		this.setPointsIcon();
		//
		// 	return data.itemList;
	}

	//
	// function handleCreateSucceeded(creationData) {
	// 	data.itemList.length = 0;
	// 	data.selectedItem = null;
	// 	evaluationStatus = creationData ? creationData.EvaluationStatus : [];
	// 	schemaIcons = creationData.SchemaIcons;
	// 	basicsLookupdataLookupDescriptorService.attachData(creationData);
	// 	basicsLookupdataLookupDescriptorService.removeData('businesspartner.evluation');
	// 	var businessParters = creationData.BusinessPartner;
	// 	basicsLookupdataLookupDescriptorService.attachData({'businesspartner.evluation': businessParters});
	// 	creationData = creationData.dtos;
	// 	let hasToGenerateCode = creationData.RubricCategoryId && businessPartnerEvaluationNumberGenerationSettingsService.hasToGenerateForRubricCategory(creationData.RubricCategoryId);
	// 	creationData.Code = hasToGenerateCode ? $translate.instant('cloud.common.isGenerated') : '';
	// 	creationData.HasToGenerateCode = hasToGenerateCode;
	// 	return creationData;
	// }

	// function handleValidation(result, item, model) {
	// 	if (result.valid) {
	// 		if (item.__rt$data && item.__rt$data.errors) {
	// 			delete item.__rt$data.errors[model];
	// 		}
	// 	} else {
	// 		if (!item.__rt$data) {
	// 			item.__rt$data = {errors: {}};
	// 		} else if (!item.__rt$data.errors) {
	// 			item.__rt$data.errors = {};
	// 		}
	// 		item.__rt$data.errors[model] = result;
	// 	}
	// }

	private schemaChangedHandler() {
		const selectedItem = this.currentSelectItem;
		if (!selectedItem) {
			return;
		}

		selectedItem.IconSrc = '';
		selectedItem.Icon = null;

		if (Array.isArray(this.schemaIcons)) {
			this.schemaIcons.length = 0;
		}
		//
		// data.modifiedDataCache = {EntitiesCount: 0}; // clear the local cache
		// service.markCurrentItemAsModified();
		//
		this.http.post<IEvaluationSchemaIconEntity[]>('businesspartner/main/evaluation/getschemaicon', { value: selectedItem.EvaluationSchemaFk }).then((response) => {
			if (response) {
				this.schemaIcons = response;
				this.setPointsIcon();
			}
		});
	}

	public isValidatedForUpdateData() {
		const list = this.getList();
		if (!list || list.length == 0) {
			return false;
		}

		const data = list[0].dtos;
		const emitResult: IEventEmitterParam<boolean> = {
			result: true,
		};
		this.commonService.evaluationGroupValidationdMessenger.emit(emitResult);
		if (emitResult.result) {
			this.commonService.onEvalClerkValidationMessenger.emit(emitResult);
		}
		let result = emitResult.result;

		if (Array.isArray(data) && data.length > 0) {
			// if (data[0].__rt$data && data[0].__rt$data.errors) {
			// 	for (var property in data[0].__rt$data.errors) {
			// 		if (Object.prototype.hasOwnProperty.call(data[0].__rt$data.errors, property) && data[0].__rt$data.errors[property]) {
			// 			result = false;
			// 			break;
			// 		}
			// 	}
			// }
			result = true;
		}

		return result;
	}

	// function getValidationError() {
	// 	var errors = serviceContainer.service.getList()[0].__rt$data.errors,
	// 		errorString = '';
	// 	for (var property in errors) {
	// 		if (Object.prototype.hasOwnProperty.call(errors, property) && errors[property]) {
	// 			errorString += errors[property].error;
	// 		}
	// 	}
	// 	errorString += service.evaluationGroupValidationErrorMessenger.fire();
	// 	errorString += service.evalClerkValidationErrorMessenger.fire();
	// 	return errorString;
	// }
	//
	// function markItemAsModified(item, data) {
	// 	if (!data.modifiedDataCache[data.itemName]) {
	// 		data.modifiedDataCache[data.itemName] = item;
	// 		data.modifiedDataCache.EntitiesCount += 1;
	// 		data.itemModified.fire(null, item);
	// 	}
	// }
	//
	// function markCurrentItemAsModified() {
	// 	var item = service.getSelected();
	// 	if (item) {
	// 		markItemAsModified(item, data);
	// 	}
	// }

	public getModifiedDataCache() {
		return this.modifiedDataCache;
	}

	public updateDetail() {
		if (this.commonService.adaptorService.getModuleName() == 'procurement.pricecomparison') {
			this.updateForPriceComparison();
			return;
		}

		if ((this.createOptions?.saveImmediately) || (this.updateOptions?.saveImmediately)) {
			const mainItem = this.currentSelectItem;
			if (mainItem) {
				this.modifiedDataCache.MainItemId = mainItem.Id;
			}
			this.http.post<ScreenEvaluationCompleteEntity>('businesspartner/main/evaluation/update', this.modifiedDataCache).then((response) => {
				this.handleUpdateDone(response);
				this.modifiedDataCache = { EntitiesCount: 0 };
			});
		} else {
			const result = extend({}, this.modifiedDataCache);
			this.modifiedDataCache = {
				EntitiesCount: 0,
			};
			this.handleUpdateDone(result);
		}
	}

	public updateForPriceComparison() {
		const mainItem = this.currentSelectItem;
		if (mainItem) {
			this.modifiedDataCache.MainItemId = mainItem.Id;
		}
		this.handleUpdateDone(this.modifiedDataCache);
		this.http.post<ScreenEvaluationCompleteEntity>('businesspartner/main/evaluation/update', this.modifiedDataCache).then((response) => {
			this.modifiedDataCache = { EntitiesCount: 0 };
		});
	}

	public createItem(createOption: IExtendCreateOptions) {
		this.createOptions = createOption;
		this.UpdateDoneCallBackArray.push((data) => this.saveCallbackFun(data!, EvaluationSaveType.ISCREATE));
		return this.create();
	}



	public async resetCode(evaluationGetListResponseEntity: IEvaluationGetListResponseEntity | null) {
		const dtos = evaluationGetListResponseEntity?.dtos;

		if (!dtos || dtos.length == 0) {
			return;
		}
		const item = dtos[0];
		if (item.Version === 0) {
			const numberGenerationService = await this.getGenerationService();
			const hasToGenerateCode: boolean = (item.RubricCategoryId && numberGenerationService.hasToGenerateForRubricCategory(item.RubricCategoryId)) as boolean;
			item.Code = hasToGenerateCode ? this.commonService.getTranslateText('cloud.common.isGenerated') : '';
			item.HasToGenerateCode = hasToGenerateCode;
			const readonlyFields: IReadOnlyField<IEvaluationEntity>[] = [];
			if (item.RubricCategoryId && item.Code) {
				readonlyFields.push({ field: 'Code', readOnly: true });
			} else {
				readonlyFields.push({ field: 'Code', readOnly: false });
			}
			this.setEntityReadOnlyFields(evaluationGetListResponseEntity, readonlyFields);
		}
	}

	private async getGenerationService() {
		return await this.lazyInjectorService.inject(NUMBER_GENERATION_PROVIDER);
	}
}
