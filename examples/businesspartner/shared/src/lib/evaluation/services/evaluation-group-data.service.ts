/*
 * Copyright(c) RIB Software GmbH
*/

import {inject, Injectable} from '@angular/core';
import {
	DataServiceHierarchicalNode,
	IDataServiceOptions,
	IDataServiceRoleOptions, IReadOnlyField,
	ServiceRole, ValidationResult
} from '@libs/platform/data-access';
import {IGridConfiguration} from '@libs/ui/common';
import {EvaluationCommonService} from './evaluation-common.service';
import {find, get, forEach, map, filter, extend} from 'lodash';
import {PlatformHttpService} from '@libs/platform/common';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { IEvaluationGroupIconEntity, EvaluationSchemaChangedType, IEvaluationEntity, IEvaluationGroupCalculateEntity, IEvaluationGroupCreateParam, IEvaluationGroupDataEntity, IEvaluationGroupDataResponseEntity, IEvaluationGroupDataToSaveEntity, IEvaluationGroupLoadParam, IEventEmitterParam, IRecalculateAllResponse, ScreenEvaluationCompleteEntity, TEvaluationSchemaChangedParam, TPoints } from '@libs/businesspartner/interfaces';
import { EvaluationDetailService } from './evaluation-detail.service';

@Injectable({
	providedIn: 'root',
})
export class EvaluationGroupDataService extends DataServiceHierarchicalNode<IEvaluationGroupDataResponseEntity, IEvaluationGroupDataResponseEntity, IEvaluationEntity, IEvaluationEntity> {
	private param!: IEvaluationGroupCreateParam | IEvaluationGroupLoadParam;
	private _selected: IEvaluationGroupDataEntity | null = null;
	private recalculateError: string | null = null;
	private groupIcons: IEvaluationGroupIconEntity[] = [];
	private readonly http = inject(PlatformHttpService);
	private readonly basicsValidation = inject(BasicsSharedDataValidationService);

	public gridConfig!: IGridConfiguration<IEvaluationGroupDataEntity>;
	public commonService: EvaluationCommonService = inject(EvaluationCommonService);
	public serviceDescriptor: string = '';

	public hasWrite = true;
	public isCreate = true;

	public constructor(public evaluationDetailService: EvaluationDetailService) {
		const options: IDataServiceOptions<IEvaluationGroupDataResponseEntity> = {
			apiUrl: 'businesspartner/main/evaluationgroupdata',
			createInfo: {
				endPoint: 'creategroup',
				usePost: true,
			},
			readInfo: {
				endPoint: 'tree',
			},
			roleInfo: <IDataServiceRoleOptions<IEvaluationGroupDataEntity>>{
				role: ServiceRole.Node,
				itemName: 'EvaluationGroupData',
				parent: evaluationDetailService,
			},
			entityActions: {
				createSupported: true,
				deleteSupported: false,
			},
		};

		super(options);

		this.commonService.evaluationGroupValidationdMessenger.subscribe(value => {
			this.evaluationGroupValidationdHandler(value);
		});
	}

	// override createP

	protected override provideCreatePayload(): object {
		return {...this.param};
	}

	public override onCreateSucceeded(created: IEvaluationGroupDataResponseEntity): IEvaluationGroupDataResponseEntity {
		created.Id = 0;
		this.groupIcons = created.GroupIcons ?? [];
		created.dtos = created.dtos ?? [];

		// platformDataServiceDataProcessorExtension.doProcessData(newItems.dtos, data);
		// data.itemTree = newItems.dtos;

		this.setList(created.dtos);
		if (created.dtos.length > 0) {
			// 	data.listLoaded.fire(null, newItems.dtos[0]);
			// 	platformDataServiceActionExtension.fireEntityCreated(data, newItems.dtos[0]);
		}
		// data.itemList = getTreeAllList(newItems.dtos);
		// data.itemList.forEach(function (item) {
		// 	processItemReadonly(item, data);
		// });
		// data.itemTree = newItems.dtos;
		//
		const modifiedDataCache = this.evaluationDetailService.getModifiedDataCache();
		const parent = this.evaluationDetailService.getSelectedEntity();
		modifiedDataCache.EntitiesCount = 1;
		modifiedDataCache.CreateEntities = {
			MainItemId: parent!.Id,
			CreateEntities: created.dtos,
		};

		// // recalculate by Formula
		// recalculateAll();

		return created;
	}

	public override isParentFn(parentKey: object, entity: IEvaluationGroupDataResponseEntity): boolean {
		return true;
	}

	public override createUpdateEntity(modified: IEvaluationGroupDataResponseEntity | null): IEvaluationGroupDataResponseEntity {
		if (modified) {
			return modified;
		}
		return {};
	}

	public clearAllData() {
		this.setList([]);
		this.select(null);
		this._selected = null;

		this.hasWrite = true;
		this.recalculateError = null;
	}

	private processGroupDataIcon(newItem: IEvaluationGroupDataEntity) {
		newItem.Icon = -1;
		newItem.IconCommentText = undefined;
		for (const groupIcon of this.groupIcons){
			if (groupIcon.EvaluationGroupFk === newItem.EvaluationGroupFk && !newItem.PId && groupIcon.PointsFrom <= newItem.Evaluation && groupIcon.PointsTo >= newItem.Evaluation /* && newItem.Evaluation !== 0 */) {
				newItem.Icon = groupIcon.Icon;
				newItem.IconCommentText = groupIcon.CommentText;
				break;
			}
		}
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

	protected override provideLoadPayload(): object {
		return {
			mainItemId: this.param?.MainItemId,
		};
	}

	protected override onLoadSucceeded(loaded: object): IEvaluationGroupDataResponseEntity[] {
		if (!loaded) {
			return [];
		}

		let readItems = loaded as IEvaluationGroupDataResponseEntity;
		const localEvaluationData: Partial<ScreenEvaluationCompleteEntity> = {};
		this.commonService.onCollectLocalEvaluationDataScreen.emit(localEvaluationData);

		if (!readItems) {
			readItems = {};
			readItems.dtos = localEvaluationData.CreateEntities?.CreateEntities;
			this.isCreate = true;
		}
		readItems = readItems || {};
		if (this.evaluationDetailService.updateOptions?.getDataFromLocal) {
			if (localEvaluationData?.EvaluationGroupDataToSave) {
				const evaluationGroupDtos = map(localEvaluationData.EvaluationGroupDataToSave, 'EvaluationGroupData');
				forEach(evaluationGroupDtos, function (item) {
					if (!item) {
						return;
					}
					let isChange = false;
					if (readItems.dtos) {
						for (let i = 0; i < readItems.dtos.length; i++) {
							if (readItems.dtos[i].EvaluationGroupFk === item.EvaluationGroupFk && readItems.dtos[i].IsEvaluationSubGroupData === item.IsEvaluationSubGroupData) {
								item.Id = readItems.dtos[i].Id;
								readItems.dtos[i] = item;
								isChange = true;
								break;
							}
						}
					}

					if (!isChange && item.PId) {
						const readItemsParentDto = find(readItems.dtos, {Id: item.PId});
						const children = readItemsParentDto ? readItemsParentDto.ChildrenItem : [];
						if (children) {
							for (let j = 0; j < children.length; j++) {
								if (children[j].EvaluationGroupFk === item.EvaluationGroupFk && children[j].IsEvaluationSubGroupData === item.IsEvaluationSubGroupData) {
									item.Id = children[j].Id;
									children[j] = item;
									break;
								}
							}
						}
					}
				});
			}
		}

		if (readItems && !readItems.dtos) {
			readItems = {
				dtos: [],
				GroupIcons: [],
			};
		}
		this.groupIcons = readItems.GroupIcons || [];

		this.setList(readItems.dtos || []);
		const result = loaded as IEvaluationGroupDataResponseEntity[];

		return result;
	}

	public set selected(value: IEvaluationGroupDataEntity | null) {
		this._selected = value;
	}

	public get selected() {
		return this._selected;
	}

	private evaluationGroupValidationdHandler(value: IEventEmitterParam<boolean>) {
		this.commonService.onEvalClerkValidationMessenger.emit(value);
		let result = value.result;
		const list = this.getList();
		if (result && Array.isArray(list) && list.length > 0) {
			// _.forEach(list, function (item) {
			// 	if (item.__rt$data && item.__rt$data.errors) {
			// 		for (var property in item.__rt$data.errors) {
			// 			if (Object.prototype.hasOwnProperty.call(item.__rt$data.errors, property) && item.__rt$data.errors[property]) {
			// 				result = false;
			// 				break;
			// 			}
			// 		}
			// 	}
			// });
		}

		if (result && this.recalculateError) {
			result = false;
		}
		return result;
	}

	public itemPointsChangedHandler(entity: IEvaluationGroupDataEntity, args: TPoints, fromRecal: boolean) {
		const currentItem = entity;
		const tree = this.getGroupList();
		//
		const newEvaluation = (args.points * currentItem.Weighting) / 100;
		if (currentItem.Points !== args.points || currentItem.Evaluation !== newEvaluation) {
			currentItem.Points = args.points;
			currentItem.Evaluation = newEvaluation;
			this.setIsCreateByUserModified(currentItem);
			this.markItemAsModified(currentItem);
		}

		const parentItem = find(tree, {Id: currentItem.PId});

		if (parentItem) {
			const groupData = this.getGroupFlatList();
			const subGroupData = filter(groupData, (item) => {
				return item.EvaluationFk === parentItem.Id && item.IsEvaluationSubGroupData;
			});
			const request = {
				SubGroupData: subGroupData,
				GroupData: parentItem,
			};
			this.http.post$<IEvaluationGroupDataEntity>('businesspartner/main/evaluationgroupdata/updateparentcalculationresult', request).subscribe((response) => {
				if (response) {
					const data = get(response, 'data') as unknown as IEvaluationGroupDataEntity;
					if (!data) {
						return;
					}
					const parentItemModified = data;
					if (parentItemModified && (parentItemModified.Points !== parentItem.Points || parentItemModified.Evaluation !== parentItem.Evaluation || parentItemModified.Total !== parentItem.Total)) {
						parentItem.Points = parentItemModified.Points;
						parentItem.Evaluation = parentItemModified.Evaluation;
						parentItem.Total = parentItemModified.Total;
						this.setIsCreateByUserModified(parentItem);
						this.markItemAsModified(parentItem);
						this.processGroupDataIcon(parentItem);
						this.commonService.onGroupViewGridRefreshEvent.emit(tree);
						this.evaluationDetailService.pointsChangeHanler(tree);

						if (!fromRecal) {
							// var groupValidateService = serviceCache.getService(serviceCache.serviceTypes.GROUP_VALIDATION, serviceDescriptor);
							// recalculateService.setPlaceHolderPoint(entity, entity.Points);
							// recalculateService.recalculateData(groupValidateService, groupData, entity);
							// service.gridRefresh();
						}
					}
				}
			});
		}
	}

	// public calculationEvaluation(notFormulaEvalList) {
	// 	var groupData = service.getList();
	// 	var parentGroup = _.filter(notFormulaEvalList, {'HasChildren': true});
	// 	var childrenGroup = _.filter(notFormulaEvalList, {'HasChildren': false});
	// 	_.forEach(childrenGroup, function (item) {
	// 		var newEvaluation = item.Points * item.Weighting / 100;
	// 		if (item.Evaluation !== newEvaluation) {
	// 			item.Evaluation = newEvaluation;
	// 			setIsCreateByUserModified(item);
	// 			serviceContainer.data.markItemAsModified(item, serviceContainer.data);
	// 		}
	// 	});
	// 	$http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/updatecalculationEvaluation', parentGroup)
	// 		.then(function (response) {
	// 			if (response && response.data) {
	// 				_.forEach(response.data.groupTree, function (item) {
	// 					var currData = _.find(groupData, {Id: item.Id});
	// 					if (currData && (currData.Points !== item.Points ||
	// 						currData.Evaluation !== item.Evaluation || currData.Total !== item.Total)) {
	// 						currData.Points = item.Points;
	// 						currData.Evaluation = item.Evaluation;
	// 						currData.Total = item.Total;
	// 						setIsCreateByUserModified(currData);
	// 						serviceContainer.data.markItemAsModified(currData, serviceContainer.data);
	// 						processGroupDataIcon(currData);
	// 					}
	// 				});
	// 				serviceContainer.service.gridRefresh();
	// 				evaluationDetailService.pointsChangeHanler(serviceContainer.service.getTree());
	// 			}
	// 		});
	// }

	public changePointHandler(points: TPoints) {
		if (this._selected) {
			this.itemPointsChangedHandler(this._selected, points, false);
		}
	}

	public recalculateAll(formulaSqlField: string) {
		this.recalculateError = '';
		const list = this.getList()[0].dtos ?? [];
		const request: IEvaluationGroupCalculateEntity = {
			Evaluation: this.evaluationDetailService.getSelectedEntity()?.dtos as unknown as IEvaluationEntity,
			Groups: list,
			FormulaSQLField: formulaSqlField,
		};
		const paras = extend({}, request);
		if (!paras.Evaluation!.Code || !paras.Evaluation!.Code.trim()) {
			paras.Evaluation!.Code = '-';
		}
		return this.http.post$<IRecalculateAllResponse>('businesspartner/main/evaluationgroupdata/recalculateall', paras).subscribe((data) => {
			if (!data) {
				return null;
			}

			const evaluation = data.Evaluation;
			const groups = data.Groups || [];
			const results = data.Results;

			let IsAnyModified = false;

			forEach(groups, (item) => {
				const found = find(list, {Id: item.Id});
				if (found && results) {
					const result = results.get(item.Id);

					if (result?.IsModified) {
						IsAnyModified = true;
						this.setIsCreateByUserModified(found);
						this.markItemAsModified(found);
						found.Points = item.Points;
						found.Evaluation = item.Evaluation;
						if (!found.IsEvaluationSubGroupData) {
							found.Total = item.Total;
							this.processGroupDataIcon(found);
						}
					}
				}
			});

			if (evaluation?.Points) {
				this.evaluationDetailService.setEvaluationDetailPoint(evaluation.Points);
			}

			if (IsAnyModified) {
				forEach(list, (item) => {
					if (item.isCreateByModified && results) {
						const res = results.get(item.Id);
						const result: ValidationResult = {valid: true, apply: true};
						if (res?.HasError) {
							result.valid = false;
							if (res.ErrorCode === 1) {
								result.error = this.commonService.getTranslateText('businesspartner.main.amongValueErrorMessage', {
									min: res.Arg1,
									max: res.Arg2,
									value: res.Arg3,
								});
							} else if (res.ErrorCode === 2) {
								result.error = this.commonService.getTranslateText('businesspartner.main.failToExecuteFormula', {
									formulaParsed: res.Arg1,
									formula: res.Arg2,
								});
							} else if (res.ErrorCode === 3) {
								result.error = this.commonService.getTranslateText('businesspartner.main.failToExecuteSql', {
									formula: res.Arg1,
									message: res.Arg2,
								});
							}
						}
						this.basicsValidation.applyValidationResult(this, {
							entity: item,
							result: result,
							field: 'Points'
						});
					}
				});
			}
			// 		evaluationDetailService.evaluationValidationMessenger.fire();
			this.gridRefreshAndBackToActiveCell();
			return results;
			// 	}, function (error) {
			// 		if (error && error.data && error.data.ErrorMessage) {
			// 			recalculateError = error.data.ErrorMessage;
			// 		}
			// 		return {error: true};
		});
	}

	public clearRecalcuteError() {
		this.recalculateError = null;
	}

	private processItemReadonly(newItem: IEvaluationGroupDataEntity) {
		this.setEntityReadOnly(newItem, !this.hasWrite);
		// if (!newItem.__rt$data || !newItem.__rt$data.readonly) {
		// 	newItem.__rt$data = newItem.__rt$data || {};
		// 	newItem.__rt$data.readonly = [];
		// } else {
		// 	newItem.__rt$data.readonly = [];
		// }
		if (!this.hasWrite) {
			return;
		}

		if (!(newItem.IsEvaluationSubGroupData && newItem.IsEditable)) {
			const pointFields = [
				{
					field: 'Points',
					readOnly: true,
				},
			] as IReadOnlyField<IEvaluationGroupDataResponseEntity>[];
			this.setEntityReadOnlyFields(newItem, pointFields);
		}

		let fields = [];
		const parentSelected = this.typedParent ? this.typedParent.getSelectedEntity() : null;
		if (parentSelected) {
			const evaluationStatus = this.evaluationDetailService.getEvaluationStatus();
			const status = find(evaluationStatus, {Id: parentSelected.EvalStatusFk});
			fields = [
				{
					field: 'Points',
					readOnly: true,
				},
				{
					field: 'IsTicked',
					readOnly: true,
				},
				{
					field: 'Remark',
					readOnly: true,
				},
			];
			if ((status?.Readonly) || parentSelected.IsReadonly) {
				this.setEntityReadOnlyFields(newItem, fields);
				return;
			}
		}
	}

	public markItemAsModified(item: IEvaluationGroupDataEntity) {
		const modifiedDataCache = this.evaluationDetailService.getModifiedDataCache();
		let toSave: IEvaluationGroupDataToSaveEntity[] = get(modifiedDataCache, this.itemName + 'ToSave');

		if (!toSave) {
			toSave = [
				{
					MainItemId: item.Id,
					EvaluationGroupData: item,
					IsEvaluationSubGroupData: true,
				},
			];
			modifiedDataCache.EntitiesCount += 1;
		} else {
			const existed = find(toSave, function (itemData) {
				return itemData.MainItemId === item.Id && itemData.EvaluationGroupData;
			}) as IEvaluationGroupDataToSaveEntity;
			if (!existed) {
				toSave.push({
					MainItemId: item.Id,
					EvaluationGroupData: item,
					IsEvaluationSubGroupData: true,
				});
				modifiedDataCache.EntitiesCount += 1;
			} else if (!existed.EvaluationGroupData) {
				existed.EvaluationGroupData = item;
			}
		}
		// data.itemModified.fire(null, item);
	}

	public markCurrentItemAsModified() {
		const item = this.getSelectedEntity();
		if (item?.dtos) {
			this.markItemAsModified(item.dtos[0]);
		}
	}

	public getModifiedDataCache() {
		return this.getParent().getModifiedDataCache();
	}

	public setIsCreateByUserModified(entity: IEvaluationGroupDataEntity) {
		entity.isCreateByModified = true;
	}

	public updateListReadonly() {
		this.getGroupFlatList().forEach((item) => {
			this.processItemReadonly(item);
		});
	}

	private gridRefreshAndBackToActiveCell() {
		const list = this.getGroupList();
		this.commonService.onGroupViewGridRefreshEvent.emit(list);

		// if (gridId) {
		// 	var grid = platformGridAPI.grids.element('id', gridId).instance;
		// 	var cell = grid.getActiveCell();
		// 	service.gridRefresh();
		// 	if (cell) {
		// 		grid.setCellFocus(cell.row, cell.cell, true);
		// 	}
		// }
	}

	private getParent() {
		return this.typedParent as unknown as EvaluationDetailService;
	}

	public getGroupList() {
		return this.getList() as IEvaluationGroupDataEntity[];
	}

	public getGroupFlatList() {
		return this.flatList() as IEvaluationGroupDataEntity[];
	}

	public getParentService(){
		return this.evaluationDetailService;
	}
}

