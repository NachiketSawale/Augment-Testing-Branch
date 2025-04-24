import {
	DataServiceHierarchicalNode,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	IReadOnlyField,
	ServiceRole
} from '@libs/platform/data-access';

import {
	concat,
	each,
	extend,
	filter,
	find,
	forEach,
	get,
	groupBy,
	indexOf,
	isArray,
	isFunction,
	isNumber,
	isObject,
	map as lodashMap,
	remove,
	set,
	some,
	sumBy,
	isEmpty,
	meanBy,
	differenceBy
} from 'lodash';
import {CompleteIdentification, PlatformConfigurationService} from '@libs/platform/common';
import {inject} from '@angular/core';
import {EvaluationCommonService} from './evaluation-common.service';
import {ColumnDef} from '@libs/ui/common';
import {BasicsSharedEvaluationStatusLookupService} from '@libs/basics/shared';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IBasicsCustomizeEvaluationStatusEntity} from '@libs/basics/interfaces';
import {
	EvaluationSaveType,
	IEvaluationSchemaEntity,
	IEvaluationSchemaIconEntity,
	IBusinessPartnerEntity,
	IEvaluationChangedParam,
	IEvaluationChangedParamData,
	IEvaluationDocumentToSaveEntity,
	IEvaluationEntity,
	IEvaluationGetChartDataDateSetResponseEntity,
	IEvaluationGetChartDataLabelResponseEntity,
	IEvaluationGetChartDataResponseEntity,
	IEvaluationGroupDataToSaveEntity,
	IEvaluationModification,
	IExtendDataReadParams,
	ScreenEvaluationCompleteEntity,
	IEvaluationGetTreeResponse,
	IEvaluationGroupDataEntity,
	BusinessPartnerEvaluationSchemaIconLookupService,
	IBusinessPartnerEvaluationSchemaIconData
} from '@libs/businesspartner/interfaces';

import {IEvaluationDataServiceInitializeOptions} from '../model/evaluation-data-entity-info-options.interface';

export type localGroupDataType = {
	evaluationId: number;
	groupData: IEvaluationGroupDataEntity[];
};

export type grouDataType = Map<number, IEvaluationGetChartDataDateSetResponseEntity[]>;
export type createOptionType = {
	itemName: string;
	moduleName: string;
	incorporateDataRead: (readItems: IEvaluationGetTreeResponse) => void;
	deleteImmediately: () => boolean;
	onEvaluationChanged: (param: IEvaluationChangedParam) => void;
	columns?: ColumnDef<IEvaluationEntity>[];
	initReadData: (readData: IExtendDataReadParams) => void;
};

export class BusinesspartnerSharedEvaluationDataService<PT extends object, PU extends CompleteIdentification<PT>> extends DataServiceHierarchicalNode<IEvaluationEntity, ScreenEvaluationCompleteEntity, PT, PU> {
	private readonly commonService = inject(EvaluationCommonService);
	private _columns?: ColumnDef<IEvaluationEntity>[];
	private schemaId2DiffEvalPoints: Map<number, number> | null = null;
	private schemaId2DiffEvalCount: Map<number, number> | null = null;
	private readonly evaluationStatusLookupService = inject(BasicsSharedEvaluationStatusLookupService);
	private readonly configService = inject(PlatformConfigurationService);
	private chartDataCache: {
		schemaId: number;
		schema?: IEvaluationGetChartDataLabelResponseEntity[];
		group: grouDataType;
	}[] = [];
	private readonly http = inject(HttpClient);
	private readonly parentProp: string = 'PId';
	private readonly childProp: string = 'ChildrenItem';
	private readonly schemaIconLookupService = inject(BusinessPartnerEvaluationSchemaIconLookupService);
	private canDeleteFlag = false;
	private readonly lookupCache: Map<string, object | undefined> = new Map<string, object | undefined>();
	private readonly modifications: IEvaluationModification | null = null;
	private createOptions!: createOptionType;

	public constructor(private readonly svrOptions?: IEvaluationDataServiceInitializeOptions<PT, object>) {
		const options: IDataServiceOptions<IEvaluationEntity> = {
			apiUrl: 'businesspartner/main/evaluation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IEvaluationGetTreeResponse>>{
				itemName: 'BusinessPartnerEvaluation',
				role: ServiceRole.Root,
				parent: svrOptions?.parentService,
			},
			processors: [
				{
					process: (toProcess: IEvaluationEntity) => {
						this.processItem(toProcess);
					},
					revertProcess: (toProcess: IEvaluationEntity) => {
						this.processItem(toProcess);
					},
				},
			],
			entityActions: {
				deleteSupported: true,
				createSupported: true,
			},
		};

		super(options);

		this.onInit();
	}

	public onInit() {
		this.commonService.onEvaluationDataMergeDataEvent.subscribe((info) => {
			const entity = get(info, 'entity') as unknown as ScreenEvaluationCompleteEntity;
			const saveType = get(info, 'saveType') as unknown as EvaluationSaveType;
			this.mergeData(entity, saveType);
		});

		this.commonService.onCollectLocalEvaluationDataScreen.subscribe((info) => {
			info = this.collectLocalEvaluationData();
		});
	}

	public setCreateOptions() {
		this.createOptions = {
			itemName: this.commonService.adaptorService.getEvaluationDataItemName(),
			moduleName: this.commonService.adaptorService.getModuleName(),
			deleteImmediately: () => {
				if (this.commonService.adaptorService.getModuleName() === 'procurement.pricecomparison') {
					return true;
				}
				return false;
			},
			onEvaluationChanged: (param: IEvaluationChangedParam) => {
				this.commonService.adaptorService.onEvaluationChanged(param);
			},
			columns: this._columns,
			incorporateDataRead: (readItems: IEvaluationGetTreeResponse) => {
				// const option = this.svrOptions as unknown as IEvaluationDataServiceInitializeOptions<IEvaluationEntity>;
				// const service = new BusinesspartnerSharedEvaluationDataService<IEvaluationEntity, IEvaluationGetTreeResponse>(option);
				this.commonService.adaptorService.onDataReadComplete(readItems, this.commonService.adaptorService.getParentService(), this);
			},
			initReadData: (readData: IExtendDataReadParams) => {
				this.commonService.adaptorService.extendDataReadParams(readData);
			},
		};
	}

	protected override provideLoadPayload(): object {
		const adapterService = this.svrOptions?.adaptorService;
		return adapterService ? adapterService.provideLoadPayload() : {mainItemId: -1};
	}

	public override parentOf(element: IEvaluationEntity): IEvaluationEntity | null {
		const parentId = element.EvaluationSchemaFk;
		if (!parentId) {
			return null;
		}

		const parent = this.flatList().find((item) => item.Id === parentId);
		return parent ?? null;
	}

	public override childrenOf(element: IEvaluationEntity): IEvaluationEntity[] {
		return element.ChildrenItem ?? [];
	}

	public getParent() {
		return this.typedParent;
	}

	public evaluationStatusChanged() {
		this.clearContent();

		this.load({id: -1}).then((response) => {
			this.commonService.onEvaluationDataGridRefreshEvent.emit(response || []);
		});

		//service.refresh();
	}

	public deleteEntities(entity: IEvaluationEntity[]) {
		if (this.createOptions.deleteImmediately()) {
			return this.deleteChildEntitiesImmediately(entity);
		} else {
			return this.deleteChildEntities(entity);
		}
	}

	private deleteChildEntitiesImmediately(entity: IEvaluationEntity[]) {
		// platformDialogService.showYesNoDialog('businesspartner.main.evaluationDeleteMessage', 'businesspartner.main.evaluationDeleteTitle', 'no').then(function (result) {
		// 	if (result.yes) {
		// 		let deleteEntity = {
		// 			BusinessPartnerEvaluationToDelete: entity
		// 		};
		// 		return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluation/deleteevaluations', deleteEntity).then(function (response) {
		// 			if (response.data['DeleteSuccess'] === true) {
		// 				deleteChildEntities(entity, data);
		// 			}
		// 		});
		// 	}
		// });
	}

	private deleteChildEntities(entity: IEvaluationEntity[]) {
		if (isEmpty(entity)) {
			return;
		}

		// when selected Multi entities. filter the entity with deny delete status and its parent
		const evaluationStatus = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];

		const removeEntities = remove(entity, (item) => {
			const status = find(evaluationStatus, {Id: item.EvalStatusFk});
			return status?.DenyDelete;
		});
		forEach(removeEntities, (item) => {
			remove(entity, {Id: item.PId!});
		});
		//
		// let modState = platformModuleStateService.state(service.getModule());
		// let elemState = modState.modifications[data.itemName + 'ToSave'];
		// if (elemState) {
		// 	for (let l = 0; l < entity.length; l++) {
		// 		let existed = _.find(elemState, {MainItemId: entity[l].Id});
		// 		let foundCache = _.find(chartDataCache, {schemaId: entity[l].EvaluationSchemaFk});
		// 		if (existed) {
		// 			_.remove(elemState, {MainItemId: entity[l].Id});
		// 			modState.modifications.EntitiesCount -= 1;
		// 			// remove the create cache
		// 			_.remove(modState.modifications.CreateEntities, {MainItemId: entity[l].Id});
		// 		}
		// 		if (foundCache) {
		// 			let found = foundCache.group[entity[l].Id];
		// 			if (found) {
		// 				delete foundCache.group[entity[l].Id];
		// 			}
		// 		}
		// 		entity[l].Checked = false;
		// 		service.dataDeleted.fire(entity[l]);
		// 	}
		// }
		const resetEvaluation: IEvaluationEntity[] = [];
		forEach(entity, (item) => {
			const parentEntity = find(this.flatList(), {Id: item.PId}) as IEvaluationEntity;
			if (parentEntity && !find(entity, {Id: parentEntity.Id!}) && parentEntity.ChildrenItem!.length) {
				const children = filter(entity, {PId: parentEntity.Id});
				if (children && children.length === parentEntity.ChildrenItem!.length) {
					entity.push(parentEntity);
				} else if (!find(resetEvaluation, {Id: parentEntity.Id})) {
					// recalculate the parent data points
					let points = meanBy(differenceBy(parentEntity.ChildrenItem, children, 'Id'), 'Points');
					points = Math.round(points * 100) / 100;
					if (parentEntity.Points !== points) {
						parentEntity.Points = points;
						resetEvaluation.push(parentEntity);
					}
				}
			}
		});

		return this.deleteSubEntities(entity, resetEvaluation);
	}

	public collectLocalEvaluationData() {
		const localData: ScreenEvaluationCompleteEntity = {
			EntitiesCount: 1,
		};
		localData.Evaluation = this.getSelectedEntity();

		// let modState = platformModuleStateService.state(service.getModule());
		// let evaluationComplete = _.find(modState.modifications[data.itemName + 'ToSave'], {MainItemId: localData.Evaluation.Id});
		const evaluationComplete = find(get(this.modifications, this.itemName + 'ToSave'), {MainItemId: localData.Evaluation!.Id}) as ScreenEvaluationCompleteEntity;
		if (evaluationComplete) {
			if (isArray(evaluationComplete.EvaluationGroupDataToSave) && evaluationComplete.EvaluationGroupDataToSave.length > 0) {
				localData.EvaluationGroupDataToSave = evaluationComplete.EvaluationGroupDataToSave;
			}
			if (isArray(evaluationComplete.EvaluationDocumentToSave) && evaluationComplete.EvaluationDocumentToSave.length > 0) {
				localData.EvaluationDocumentToSave = evaluationComplete.EvaluationDocumentToSave;
			}
			if (isArray(evaluationComplete.Evaluation2ClerkToSave) && evaluationComplete.Evaluation2ClerkToSave.length > 0) {
				localData.Evaluation2ClerkToSave = evaluationComplete.Evaluation2ClerkToSave;
			}
			if (isArray(evaluationComplete.Evaluation2ClerkToDelete) && evaluationComplete.Evaluation2ClerkToDelete.length > 0) {
				localData.Evaluation2ClerkToDelete = evaluationComplete.Evaluation2ClerkToDelete;
			}
		}
		const evaluationDocumentComplete: IEvaluationDocumentToSaveEntity[] = [];
		if (this.modifications?.EvaluationDocumentToSave) {
			const documentToSave = this.modifications.EvaluationDocumentToSave;
			forEach(documentToSave, (item) => {
				if (item?.EvaluationDocument && item.EvaluationDocument.EvaluationFk === localData.Evaluation!.Id) {
					evaluationDocumentComplete.push(item);
				}
			});
			if (evaluationDocumentComplete.length) {
				localData.EvaluationDocumentToSave = evaluationDocumentComplete;
			}
		}

		// const createEntities = find(this.modifications!.CreateEntities, {MainItemId: localData.Evaluation!.Id});
		// if (createEntities) {
		// 	localData.CreateEntities = createEntities;
		// }
		return localData;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IEvaluationEntity | null): ScreenEvaluationCompleteEntity {
		const complete = new ScreenEvaluationCompleteEntity();
		if (modified) {
			complete.MainItemId = modified.Id;
			complete.Evaluation = modified;
		}
		return complete;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: ScreenEvaluationCompleteEntity[], deleted: IEvaluationEntity[]) {
		if (!parentUpdate) {
			return;
		}

		if (modified && modified.length > 0) {
			set(parentUpdate, this.itemName + 'ToSave', modified);
		}

		if (deleted && deleted.length > 0) {
			set(parentUpdate, this.itemName + 'ToDelete', deleted);
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: PU): IEvaluationEntity[] {
		const complete = get(parentUpdate, this.itemName + 'ToSave') as unknown as ScreenEvaluationCompleteEntity;
		if (complete?.Evaluation) {
			return [complete.Evaluation];
		}
		return [];
	}

	private deleteSubEntities(entities: IEvaluationEntity[], resetEvaluation: IEvaluationEntity[]) {
		const parentEntities: IEvaluationEntity[] = [];
		const childEntities: IEvaluationEntity[] = [];
		const deleteEntities: IEvaluationEntity[] = [];
		const flatList = this.flatList();

		forEach(entities, (entity) => {
			if (entity.Id < 0) {
				forEach(entity.ChildrenItem, (item) => {
					if (!find(childEntities, {Id: item.Id})) {
						childEntities.push(item);
						deleteEntities.push(item);
					}
				});
				parentEntities.push(entity);
			} else {
				if (!find(childEntities, {Id: entity.Id})) {
					childEntities.push(entity);
					deleteEntities.push(entity);
				}
			}
		});
		this.prepareMultiDelete(deleteEntities);

		let entity: IEvaluationEntity | null = null;
		if (!entity && deleteEntities && deleteEntities.length > 0) {
			entity = deleteEntities[0];
		}
		// const entityIndex = entity ? flatList.indexOf(entity) : -1;

		// platformDataServiceModificationTrackingExtension.markEntitiesAsDeleted(service, deleteParams.entities, data);
		//
		// if (data.usesCache && data.currentParentItem && data.currentParentItem.Id) {
		// 	let cache = data.provideCacheFor(data.currentParentItem.Id, data);
		// 	if (cache) {
		// 		let loadedItems = _.filter(cache.loadedItems, function (item) {
		// 			return !_.find(parentEntities, function (entity) {
		// 				return entity.Id === item.Id;
		// 			});
		// 		});
		// 		data.__dataCache.update(_searchFilter, loadedItems);
		// 	}
		// }
		//
		let removeChildOffsetIndex = null,
			removeParentOffsetIndex = null;
		const removeParentOffsetItem = parentEntities && parentEntities.length > 0 ? parentEntities[0] : null,
			removeChildOffsetItem = childEntities && childEntities.length > 0 ? childEntities[0] : null;
		if (removeParentOffsetItem) {
			removeParentOffsetIndex = indexOf(flatList, removeParentOffsetItem);
		}
		if (removeChildOffsetItem) {
			removeChildOffsetIndex = indexOf(flatList, removeChildOffsetItem);
		}

		if (childEntities && childEntities.length > 0) {
			this.onDeleteDone(childEntities, removeChildOffsetIndex);
		}
		if (parentEntities && parentEntities.length > 0) {
			this.onDeleteDone(parentEntities, removeParentOffsetIndex);
		}

		this.commonService.adaptorService.onEvaluationChanged({
			eventName: 'DELETE',
			data: {
				entities: concat(parentEntities, childEntities),
				resetEvaluation: resetEvaluation,
			},
			sender: this,
		});

		this.reappraise(true, null);

		return true;
	}

	private onDeleteDone(entities: IEvaluationEntity[], index: number | null) {
		const list = this.getList();
		forEach(list, (item) => {
			if (item.ChildrenItem && item.ChildrenItem.length > 0) {
				this.onDeepRemove(item.ChildrenItem, entities);
			}
		});

		this.onDeepRemove(list, entities);

		this.setList(list);
	}

	private onDeepRemove(items: IEvaluationEntity[], toDelete: IEvaluationEntity[]) {
		forEach(toDelete, (item) => {
			remove(items, {Id: item.Id});
		});
	}

	private prepareMultiDelete(entities: IEvaluationEntity[]) {
		const toDelete = filter(entities, (entity) => {
			return !this.commonService.isBeingDeleted(entity);
		});
		if (!toDelete || toDelete.length === 0) {
			return true;
		}
		this.commonService.markListAsBeingDeleted(toDelete);

		return groupBy(entities, (entity) => {
			if (entity.Version === 0) {
				return 'N';
			}
			return 'O';
		});
	}

	public getChartData(evaluationSchemaId: number, evaluationIds: number[]) {
		const dataCache = filter(this.chartDataCache, (item) => {
			return item.schemaId === evaluationSchemaId;
		});

		// Get the local evaluation group data
		const groupDatas = this.getLocalEvaluationGroupData();

		if (dataCache.length > 0) {
			this.mergeGroupData(groupDatas, dataCache[0].group);
			return new Observable<IEvaluationGetChartDataResponseEntity>((observer) => {
				const result: IEvaluationGetChartDataResponseEntity = {
					Labels: dataCache[0].schema,
					DataSets: dataCache[0].group,
				};
				observer.next(result);
				observer.complete();
			});
		} else {
			const httpRoute = this.configService.webApiBaseUrl + 'businesspartner/main/evaluation/getchartdata';
			evaluationIds.unshift(evaluationSchemaId);
			return this.http.post<IEvaluationGetChartDataResponseEntity>(httpRoute, evaluationIds).pipe(
				map((data) => {
					this.mergeGroupData(groupDatas, data['DataSets'] as grouDataType);
					this.chartDataCache.push({
						schemaId: evaluationSchemaId,
						schema: data['Labels'] ?? [],
						group: data['DataSets'] as grouDataType,
					});
					return data;
				}),
			);
		}
	}

	private getLocalEvaluationGroupData() {
		// let modState = platformModuleStateService.state(service.getModule());
		// let elemState = modState.modifications[data.itemName + 'ToSave'];

		const groupDataList: localGroupDataType[] = [];

		if (!this.modifications) {
			return groupDataList;
		}
		const elemState = this.modifications.BusinessPartnerEvaluationToSave;

		if (elemState) {
			forEach(elemState, (evaItem) => {
				if (evaItem.EvaluationGroupDataToSave) {
					const groups = filter(evaItem.EvaluationGroupDataToSave, function (g) {
						return g.MainItemId > 0;
					}).map(function (gd) {
						return gd.EvaluationGroupData;
					});

					groupDataList.push({
						evaluationId: evaItem.Evaluation!.Id,
						groupData: groups as IEvaluationGroupDataEntity[],
					});
				}
			});
		}
		return groupDataList;
	}

	private mergeGroupData(localGroupData: localGroupDataType[], groupData: grouDataType) {
		forEach(localGroupData, (lgData) => {
			const groupByEvalId = groupData.get(lgData.evaluationId);
			if (groupByEvalId && groupByEvalId[0].Id > 0) {
				forEach(groupByEvalId, (item) => {
					const gd = find(lgData.groupData, {Id: item.Id});
					if (gd) {
						item.Total = gd.Evaluation;
					}
				});
			} else {
				const data = lodashMap(groupByEvalId, function (item) {
					const gd = find(lgData.groupData, {
						EvaluationFk: item.EvaluationFk,
						EvaluationGroupFk: item.EvaluationGroupFk,
					});

					let total = 0;
					if (gd) {
						total = gd.Evaluation;
					}

					return {
						EvaluationFk: item.EvaluationFk,
						EvaluationGroupFk: item.EvaluationGroupFk,
						Id: item.Id,
						Total: total,
					};
				});

				groupData.set(lgData.evaluationId, data);
			}
		});
	}

	protected override onLoadSucceeded(loaded: IEvaluationGetTreeResponse): IEvaluationEntity[] {
		this.lookupCache.clear();
		if (loaded) {
			return this.incorporateDataRead(loaded);
		}
		return [];
	}

	private incorporateDataRead(readItems: IEvaluationGetTreeResponse) {
		this.setList(readItems.Dtos ?? []);

		// const items = isArray(readItems) ? readItems : readItems.Dtos || get(readItems, 'Main') || [];
		if (isObject(readItems)) {
			this.lookupCache.set('SchemaIcons', readItems.SchemaIcons ?? []);
			this.lookupCache.set('Schemas', readItems.Schemas ?? []);
			this.lookupCache.set('EvaluationStatus', readItems.EvaluationStatus ?? []);
		}

		this.clearDataCache();

		if (isFunction(this.createOptions.incorporateDataRead)) {
			this.createOptions.incorporateDataRead(readItems);
		}

		this.schemaId2DiffEvalPoints = this.schemaId2DiffEvalPoints || readItems.SchemaId2DiffEvalPoints || null;
		this.schemaId2DiffEvalCount = this.schemaId2DiffEvalCount || readItems.SchemaId2DiffEvalCount || null;
		const itemTree = readItems.Dtos || [];

		this.commonService.adaptorService.onHandleReadSucceeded();

		const itemList = this.flatList();
		if (itemList && itemList.length >= 2) {
			this.select(itemList[1]);
		}

		this.commonService.onDataChangeMessenger.emit();

		// data.__dataCache.update(_searchFilter, items);
		return itemTree;
	}

	private setReadOnlyFieldsByStatus(newItem: IEvaluationEntity) {
		const readonlyFieldsByStatus: string[] = [];
		const evaluationStatus = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];
		const evalStatus = find(evaluationStatus, {Id: newItem.EvalStatusFk});
		if (evalStatus) {
			forEach(this.createOptions.columns, (column) => {
				if (column.model !== 'Checked') {
					readonlyFieldsByStatus.push(column.model as string);
				}
			});
			if (evalStatus.Readonly) {
				this.setEntityReadOnlyFields(newItem, this.getReadonlyFields(readonlyFieldsByStatus));
			}
		}

		// set readonly by Evaluation IsReadonly
		if (newItem.IsReadonly) {
			this.setEntityReadOnlyFields(newItem, this.getReadonlyFields(readonlyFieldsByStatus));
		}
	}

	private getReadonlyFields(fields: string[]) {
		const allReadonlyFields: IReadOnlyField<IEvaluationEntity>[] = [];
		forEach(fields, (field) => {
			allReadonlyFields.push({field: field, readOnly: true});
		});
		return allReadonlyFields;
	}

	public disableDelete(flag: boolean) {
		this.canDeleteFlag = flag;
		this.canDelete();
	}

	public override canDelete(): boolean {
		const evaluationStatus = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];
		const flag = this.canDeleteFlag;
		const selected = this.getSelectedEntity();
		if (selected?.PId) {
			const status = find(evaluationStatus, {Id: selected.EvalStatusFk});
			if (status) {
				return !!(flag && !status.DenyDelete);
			}
		} else if (selected && !selected.PId) {
			const children = filter(selected.ChildrenItem, (item) => {
				const status = find(evaluationStatus, {Id: item.EvalStatusFk});
				return status ? status.DenyDelete : false;
			});
			return flag && !(children?.length);
		}
		return !!(flag && selected);
	}

	public clearContent() {
		// data.__dataCache.clear();

		this.setList([]);
	}

	public reappraise(isRefreshGrid: boolean, tree: IEvaluationEntity[] | null) {
		const evaluationTree = filter(tree || this.getList(), (item) => {
			return this.commonService.isDefined(item.PId) || item.PId === null;
		});
		each(evaluationTree, (root) => {
			each(root.ChildrenItem, (child) => {
				this.reappraiseIcon(child);
			});
			this.reappraiseParentPoint(root);
			this.reappraiseIcon(root);
		});

		forEach(this.flatList(), (item) => {
			this.processItem(item);
		});
		// platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

		if (isRefreshGrid) {
			this.commonService.onEvaluationDataGridRefreshEvent.emit([]);
		}
	}

	// service.syncCreate = function (evaluation, isRefreshGrid, isReappraise) {
	// 	let result;
	// 	let hasCreated = !!_.find(service.getList(), function (item) {
	// 		return evaluation.Id === item.Id;
	// 	});
	// 	if (!hasCreated) {
	// 		let evaluationTree = service.getTree(),
	// 			createEvaluation = angular.copy(evaluation),
	// 			schema = _.find(basicsLookupdataLookupDescriptorService.getData('Schemas'), {Id: createEvaluation.EvaluationSchemaFk});
	// 		let parent = _.find(evaluationTree, {EvaluationSchemaFk: createEvaluation.EvaluationSchemaFk});
	//
	// 		let lockedRt$dataProperties = {
	// 			readonly: []
	// 		};
	// 		Object.assign(createEvaluation.__rt$data, lockedRt$dataProperties);
	//
	// 		if (!parent) {
	// 			parent = {
	// 				Id: -service.getTree().length - 1,
	// 				PId: null,
	// 				Code: ' ',
	// 				EvaluationDate: createEvaluation.EvaluationDate,
	// 				EvaluationSchemaFk: createEvaluation.EvaluationSchemaFk,
	// 				EvaluationSchemaDescription: schema.DescriptionInfo.Translated,
	// 				Points: createEvaluation.Points,
	// 				Icon: createEvaluation.Icon,
	// 				ChildrenItem: [createEvaluation],
	// 				HasChildren: true
	// 			};
	// 			createEvaluation.PId = parent.Id;
	// 			evaluationTree.push(parent);
	// 		} else {
	// 			parent.ChildrenItem.push(createEvaluation);
	// 		}
	//
	// 		syncDataItemList();
	//
	// 		if (isReappraise) {
	// 			service.reappraise(false, [parent]);
	// 		}
	// 		if (isRefreshGrid) {
	// 			service.gridRefresh();
	// 		}
	// 		result = true;
	// 	} else {
	// 		result = true;
	// 	}
	// 	return result;
	// };
	//
	// service.syncUpdate = function (evaluation, isRefreshGrid, isReappraise) {
	// 	let result = false;
	// 	let updateEvaluation = _.find(service.getList(), function (item) {
	// 		return item.Id === evaluation.Id;
	// 	});
	// 	let parent = _.find(service.getTree(), {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
	// 	if (updateEvaluation && parent) {
	// 		let lockedProperties = {
	// 			Checked: updateEvaluation.Checked,
	// 			__rt$data: updateEvaluation.__rt$data,
	// 			nodeInfo: updateEvaluation.nodeInfo
	// 		};
	// 		Object.assign(updateEvaluation, evaluation);
	// 		Object.assign(updateEvaluation, lockedProperties);
	// 		if (isReappraise) {
	// 			service.reappraise(false, [parent]);
	// 		}
	// 		if (isRefreshGrid) {
	// 			service.gridRefresh();
	// 		}
	// 		result = true;
	// 	}
	//
	// 	return result;
	// };
	//
	// service.syncDelete = function (removeEntities, isRefreshGrid, isReappraise) {
	//
	// 	let result = false,
	// 		evaluationTree = service.getTree(),
	// 		flatList = service.getList(),
	// 		selectedIndex = _.indexOf(flatList, service.getSelected()),
	// 		removeItems = [];
	//
	// 	_.each(evaluationTree, function (root) {
	// 		let children = root.ChildrenItem;
	// 		_.each(removeEntities, function (item) {
	// 			let matchItem = _.find(children, {Id: item.Id});
	// 			if (matchItem) {
	// 				removeItems.push(_.indexOf(flatList, matchItem));
	// 				_.remove(children, function (child) {
	// 					return child === matchItem;
	// 				});
	// 				result = true;
	// 			}
	// 		});
	// 	});
	//
	// 	if (result) {
	//
	// 		_.remove(evaluationTree, function (root) {
	// 			return root.ChildrenItem.length === 0;
	// 		});
	//
	// 		syncDataItemList();
	//
	// 		if (selectedIndex >= 0 && removeItems.length > 0 && _.includes(removeItems, selectedIndex)) {
	// 			platformDataServiceSelectionExtension.doSelectCloseTo(_.minBy(removeItems), data);
	// 		}
	//
	// 		if (isReappraise) {
	// 			service.reappraise(false);
	// 		}
	// 		if (isRefreshGrid) {
	// 			service.gridRefresh();
	// 		}
	// 	}
	//
	// 	return result;
	// };

	// private syncDataItemList() {
	// 	let flatList = this.flatList();
	// 	data.itemList.length = 0;
	// 	each(flatList, function (item) {
	// 		data.itemList.push(item);
	// 	});
	// }

	private processItem(newItem: IEvaluationEntity) {
		this.setReadOnlyFieldsByStatus(newItem);
		const nodeInfo = {
			collapsed: false,
			lastElement: false,
			level: 0,
		};
		if (newItem?.ChildrenItem && newItem.ChildrenItem.length > 0) {
			nodeInfo.level = 0;
		} else {
			nodeInfo.lastElement = true;
			nodeInfo.level = 1;
		}
		newItem = extend({nodeInfo: nodeInfo}, newItem);

		if (isNumber(newItem.Icon)) {
			const value = this.lookupCache.get('SchemaIcons') as IBusinessPartnerEvaluationSchemaIconData[];
			newItem.image = 'ico-' + value[newItem.Icon - 1].Name;
		}
		if (newItem.Icon === null) {
			newItem.IconSrc = '';
		}
		if (!newItem.PId) {
			this.setEntityReadOnlyFields(newItem, [
				{
					field: 'ProjectFk',
					readOnly: true,
				},
				{
					field: 'ConHeaderFk',
					readOnly: true,
				},
				{
					field: 'InvHeaderFk',
					readOnly: true,
				},
				{
					field: 'QtnHeaderFk',
					readOnly: true,
				},
				{
					field: 'UserDefined1',
					readOnly: true,
				},
				{
					field: 'UserDefined2',
					readOnly: true,
				},
				{
					field: 'UserDefined3',
					readOnly: true,
				},
				{
					field: 'UserDefined4',
					readOnly: true,
				},
				{
					field: 'UserDefined15',
					readOnly: true,
				},
			]);
		}
		const evalStatuses = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];
		const evalStatus = evalStatuses[newItem.EvalStatusFk];
		if (evalStatus) {
			if (evalStatus.NotToCount) {
				this.setEntityReadOnlyFields(newItem, [
					{
						field: 'Checked',
						readOnly: true,
					},
				]);
			}
		}
	}

	public clearDataCache() {
		this.chartDataCache = [];
	}

	private async reappraiseIcon(item: IEvaluationEntity) {
		const schemaIcons = this.lookupCache.get('SchemaIcons') as IEvaluationSchemaIconEntity[];
		const icons = filter(schemaIcons, (e) => {
			return e.EvaluationSchemaFk === item.EvaluationSchemaFk;
		});
		let flag = false;
		forEach(icons, (icon) => {
			if (item.Points && item.Points >= icon.PointsFrom && item.Points <= icon.PointsTo) {
				flag = true;
				item.Icon = icon.Icon;
			}
		});
		if (!flag) {
			item.Icon = null;
			item.image = 'ico-folder-empty';
		}
	}

	private reappraiseParentPoint(parentItem?: IEvaluationEntity) {
		if (parentItem?.ChildrenItem && parentItem.ChildrenItem.length > 0) {
			// need to set zero first be used to first create
			parentItem.Points = 0;
			let sumItems = filter(parentItem.ChildrenItem, (child) => {
				return this.commonService.isDefined(child.Points);
			});
			let length = parentItem.ChildrenItem.length;
			let diffPoints = this.schemaId2DiffEvalPoints ? get(this.schemaId2DiffEvalPoints, parentItem.Id) : 0;
			let diffCount = this.schemaId2DiffEvalCount ? get(this.schemaId2DiffEvalCount, parentItem.Id) : 0;
			diffPoints = diffPoints || 0;
			diffCount = diffCount || 0;
			const evaluationStatus = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];
			const canCountStatusIds: number[] = [];
			const countSumItems: IEvaluationEntity[] = [];
			if (evaluationStatus) {
				forEach(evaluationStatus, (item) => {
					if (!item.NotToCount) {
						canCountStatusIds.push(item.Id);
					}
				});
			}
			if (canCountStatusIds && canCountStatusIds.length > 0) {
				forEach(sumItems, sumItem => {
					forEach(canCountStatusIds, (canCountStatusId) => {
						if (sumItem.EvalStatusFk === canCountStatusId) {
							countSumItems.push(sumItem);
						}
					});
				});

				sumItems = countSumItems;
				length = countSumItems.length;
			}
			if (sumItems.length > 0) {
				parentItem.Points = (sumBy(sumItems, 'Points') + diffPoints) / (length + diffCount);
			} else if (diffCount > 0) {
				parentItem.Points = diffPoints / diffCount;
			}
		}
	}

	public mergeData(result: ScreenEvaluationCompleteEntity, saveType: EvaluationSaveType) {
		// add the result to modState
		// for result, see ScreenEvaluationCompleteDto
		if (!result.Evaluation) {
			return;
		}
		let evaluation: IEvaluationEntity, parent: IEvaluationEntity | undefined | null;
		const tree = this.getList(),
			list = this.flatList();

		let eventName = '',
			eventData!: IEvaluationChangedParamData;

		if (saveType == EvaluationSaveType.ISCREATE) {
			// create mode
			//
			const schema = find(this.lookupCache.get('Schemas') as IEvaluationSchemaEntity[], {Id: result.Evaluation.EvaluationSchemaFk});
			evaluation = result.Evaluation;
			evaluation.HasChildren = false;
			evaluation.ChildrenItem = [];
			evaluation.EvaluationSchemaDescription = evaluation.Description;

			parent = find(tree, {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
			if (parent) {
				evaluation.PId = parent.Id;
				if (isArray(parent.ChildrenItem)) {
					parent.ChildrenItem.push(evaluation);
				} else {
					parent.ChildrenItem = [evaluation];
				}
				list.push(evaluation);

				parent.EvaluationDate = evaluation.EvaluationDate;
			} else {
				const evalStatus = this.lookupCache.get('EvaluationStatus') as IBasicsCustomizeEvaluationStatusEntity[];

				parent = {
					Id: -tree.length - 1,
					PId: null,
					Code: ' ',
					EvaluationDate: evaluation.EvaluationDate,
					EvaluationSchemaFk: schema!.Id,
					EvaluationSchemaDescription: schema?.DescriptionInfo?.Translated,
					Points: evaluation.Points,
					Icon: evaluation.Icon,
					ChildrenItem: [evaluation],
					HasChildren: true,
					EvalStatusFk: find(evalStatus, {IsDefault: true})!.Id,
					CompanyFk: evaluation.CompanyFk,
					Checked: false,
					BusinessPartnerFk: evaluation.BusinessPartnerFk,
					OldEvaluationMotiveId: evaluation.OldEvaluationMotiveId || 1,
					EvaluationMotiveFk: evaluation.EvaluationMotiveFk,
					IsReadonly: evaluation.IsReadonly,
					image: evaluation.image,
					IconSrc: evaluation.IconSrc,
				};

				evaluation.PId = parent!.Id;

				tree.push(parent);
				list.push(parent);
				list.push(evaluation);
			}
			eventName = 'CREATE';
			eventData = {
				parent: parent,
				evaluation: evaluation,
			};
		} else {
			// view mode
			evaluation = this.getSelectedEntity()!;
			if (result.Evaluation) {
				result.Evaluation.PId = evaluation.PId;
				evaluation.EvaluationSchemaDescription = evaluation.Description;
				Object.assign(evaluation, result.Evaluation);

				parent = find(tree, {EvaluationSchemaFk: evaluation.EvaluationSchemaFk});
				eventName = 'UPDATE';
				eventData = {
					parent: parent,
					evaluation: evaluation,
				};
			}
		}

		this.reappraise(false, parent ? [parent] : []);
		//
		// 	platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
		// 	platformDataServiceActionExtension.fireEntityCreated(data, result.Evaluation);

		// this.registerModificationsToParentUpdate(this.typedParent?.getSelectedEntity() as unknown as PU, [evaluation], []);
		this.setModified(evaluation);

		// 	addGroupDataToModified(result, evaluation);
		//
		// 	data.__dataCache.update(_searchFilter, service.getTree());
		//
		// 	service.gridRefresh();
		this.commonService.onEvaluationDataGridRefreshEvent.emit([]);

		//
		// 	service.dataChangeMessenger.fire();
		//
		if (eventName && eventData && isFunction(this.createOptions.onEvaluationChanged)) {
			this.createOptions.onEvaluationChanged({
				eventName: eventName,
				sender: this,
				data: eventData,
			});
		}
		//
		// 	function addGroupDataToModified(result, evaluation) {
		// 		let modState = platformModuleStateService.state(service.getModule());
		// 		let elemState = modState.modifications[data.itemName + 'ToSave'];
		// 		let existed = _.find(elemState, {MainItemId: evaluation.Id});
		//
		// 		if (result.EvaluationDocumentToSave && result.EvaluationDocumentToSave.length >= 0) {
		// 			let saveState = modState.modifications.EvaluationDocumentToSave;
		// 			if (!saveState) {
		// 				saveState = modState.modifications.EvaluationDocumentToSave = [];
		// 			}
		// 			if (saveState && saveState.length <= 0) {
		// 				modState.modifications.EvaluationDocumentToSave = result.EvaluationDocumentToSave;
		// 			} else {
		// 				_.forEach(result.EvaluationDocumentToSave, function (documentItem) {
		// 					let documentData = _.find(modState.modifications.EvaluationDocumentToSave, {MainItemId: documentItem.MainItemId});
		// 					if (!documentData) {
		// 						modState.modifications.EvaluationDocumentToSave.push(documentItem);
		// 					}
		// 				});
		// 			}
		// 		}
		//
		// 		if (result.CreateEntities && result.CreateEntities.length >= 0) {
		// 			// if have created entity before, put the new one in modifications
		// 			let modifiedCreateEntities = modState.modifications.CreateEntities;
		// 			if (!modifiedCreateEntities) {
		// 				modifiedCreateEntities = [];
		// 			}
		// 			modState.modifications.CreateEntities = modifiedCreateEntities.concat(angular.copy(result.CreateEntities));
		// 		}
		//
		// 		if (existed) {
		// 			if (!existed.EvaluationGroupDataToSave) {
		// 				existed.EvaluationGroupDataToSave = result.EvaluationGroupDataToSave;
		// 			} else {
		// 				_.forEach(result.EvaluationGroupDataToSave, function (group) {
		// 					let groupData = _.find(existed.EvaluationGroupDataToSave, {MainItemId: group.MainItemId});
		// 					if (groupData) {
		// 						if (group.EvaluationGroupData && group.EvaluationGroupData.IsMultiSelect) {
		// 							if (_.isArray(group.EvaluationItemDataToSave) && group.EvaluationItemDataToSave.length > 0) {
		// 								let evaItems = [];
		// 								_.forEach(group.EvaluationItemDataToSave, function (evaItem) {
		// 									let temp = _.find(groupData.EvaluationItemDataToSave, {Id: evaItem.Id});
		// 									if (temp) {
		// 										Object.assign(temp, evaItem);
		// 										evaItems.push(temp);
		// 									} else {
		// 										evaItems.push(evaItem);
		// 									}
		// 								});
		// 								groupData.EvaluationItemDataToSave = evaItems;
		// 							}
		// 						} else {
		// 							if (_.isArray(group.EvaluationItemDataToSave) && group.EvaluationItemDataToSave.length > 0) {
		// 								groupData.EvaluationItemDataToSave = group.EvaluationItemDataToSave;
		// 							}
		//
		// 							mergeClerkData(group, groupData, 'EvalGroupData2ClerkToSave', 'EvalGroupData2ClerkToDelete');
		// 						}
		// 					} else {
		// 						groupData = group;
		// 						existed.EvaluationGroupDataToSave.push(group);
		// 					}
		//
		// 					if (groupData.EvaluationGroupData.IsEvaluationSubGroupData && isGroupDataModifiedDataEmpty(groupData)) {
		// 						let mainItemId = groupData.EvaluationGroupData.EvaluationFk;
		// 						groupData.EvaluationGroupData = null;
		// 						let parentGroupData = _.find(existed.EvaluationGroupDataToSave, {MainItemId: mainItemId});
		// 						if (isGroupDataModifiedDataEmpty(parentGroupData)) {
		// 							parentGroupData.EvaluationGroupData = null;
		// 						}
		// 					}
		// 				});
		// 			}
		//
		// 			mergeClerkData(result, existed, 'Evaluation2ClerkToSave', 'Evaluation2ClerkToDelete');
		//
		// 			// modState.modifications.EntitiesCount = result.EntitiesCount - 1;
		// 		}
		//
		// 		if (result.EvaluationDocumentToDelete && result.EvaluationDocumentToDelete.length >= 0) {
		//
		// 			let deleteState = modState.modifications.EvaluationDocumentToDelete;
		// 			if (!deleteState) {
		// 				deleteState = modState.modifications.EvaluationDocumentToDelete = [];
		// 			}
		// 			if (deleteState && deleteState.length <= 0) {
		// 				modState.modifications.EvaluationDocumentToDelete = result.EvaluationDocumentToDelete;
		// 			} else {
		// 				_.forEach(result.EvaluationDocumentToDelete, function (documentItem) {
		// 					let documentData = _.find(modState.modifications.EvaluationDocumentToDelete, {Id: documentItem.Id});
		// 					if (!documentData) {
		// 						modState.modifications.EvaluationDocumentToDelete.push(documentItem);
		// 					}
		// 				});
		// 			}
		// 		}
		// 	}
	}

	private isGroupDataModifiedDataEmpty(groupData: IEvaluationGroupDataToSaveEntity) {
		return (
			groupData?.EvaluationGroupData &&
			!groupData.EvaluationGroupData.isCreateByModified &&
			(!groupData['EvalGroupData2ClerkToSave'] || groupData['EvalGroupData2ClerkToSave'].length === 0) &&
			(!groupData['EvalGroupData2ClerkToDelete'] || groupData['EvalGroupData2ClerkToDelete'].length === 0) &&
			(!groupData.EvaluationItemDataToSave || groupData.EvaluationItemDataToSave.length === 0)
		);
	}

	public mergeClerkData(source: ScreenEvaluationCompleteEntity, target: ScreenEvaluationCompleteEntity, toSaveProp: string, toDeleteProp: string) {
		let targetSaveValue = get(target, toSaveProp);
		let targetDeleteValue = get(target, toDeleteProp);
		const sourceSaveValue = get(source, toSaveProp);
		const sourceDeleteValue = get(source, toDeleteProp);
		if (!targetSaveValue) {
			targetSaveValue = sourceSaveValue;
		} else {
			if (isArray(sourceSaveValue) && sourceSaveValue.length > 0) {
				let clerkState = targetSaveValue;
				if (!clerkState) {
					clerkState = targetSaveValue = [];
				}
				if (clerkState && clerkState.length <= 0) {
					targetSaveValue = sourceSaveValue;
				} else {
					forEach(sourceSaveValue, function (clerkItem) {
						const clerkData = find(targetSaveValue, {Id: clerkItem.MainItemId});
						if (!clerkData) {
							targetSaveValue.push(clerkItem);
						}
					});
					const itemsRemoved = sourceDeleteValue || [];
					if (itemsRemoved.length > 0) {
						targetSaveValue = filter(targetSaveValue, function (toSave) {
							return !some(itemsRemoved, {Id: toSave.Id});
						});
					}
				}
			} else {
				const itemsRemoved2 = sourceDeleteValue || [];
				if (itemsRemoved2.length > 0) {
					targetSaveValue = filter(targetSaveValue, function (toSave) {
						return !some(itemsRemoved2, {Id: toSave.Id});
					});
				}
			}
		}

		if (!targetDeleteValue) {
			targetDeleteValue = sourceDeleteValue;
		} else {
			if (isArray(sourceDeleteValue)) {
				let clerkDelState = targetDeleteValue;
				if (!clerkDelState) {
					clerkDelState = targetDeleteValue = [];
				}
				if (clerkDelState && clerkDelState.length <= 0) {
					targetDeleteValue = sourceDeleteValue;
				} else {
					forEach(sourceDeleteValue, function (clerkItem) {
						if (clerkItem.Version > 0) {
							const clerkDelData = find(targetDeleteValue, {Id: clerkItem.Id});
							if (!clerkDelData) {
								targetDeleteValue.push(clerkItem);
							}
						}
					});
				}
			}
		}
	}

	public provideUpdateData(updateData: PU) {
		// the parent node is for tree view presenting, no need to save it
		const toSave = get(updateData, this.createOptions.itemName + 'ToSave');
		if (isArray(toSave) && toSave.length > 0) {
			remove(toSave, function (e) {
				return !e.Evaluation.PId;
			});
		}
	}

	public mergeInLeafUpdateData(updateData: PU) {
		const toSave = get(updateData, this.itemName + 'ToSave');
		forEach(toSave, (item: ScreenEvaluationCompleteEntity) => {
			const oldItem = this.findItemToMerge(item);
			if (oldItem) {
				//data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem.Evaluation, true, data);
			}
		});
	}

	public findItemToMerge(item2Merge: ScreenEvaluationCompleteEntity) {
		const flagList = this.flatList();
		return !item2Merge || !item2Merge.MainItemId ? undefined : find(flagList, {Id: item2Merge.MainItemId});
	}

	public setColumns(columns?: ColumnDef<IEvaluationEntity>[]) {
		this._columns = columns;
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IEvaluationEntity): boolean {
		return entity.BusinessPartnerFk == parentKey.Id;
	}
}
