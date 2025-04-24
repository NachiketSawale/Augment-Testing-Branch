import { EventEmitter, inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { EvaluationGroupDataService } from './evaluation-group-data.service';
import { EvaluationDetailService } from './evaluation-detail.service';

import { find, get, set, forEach, escape, isArray } from 'lodash';
import { EvaluationCommonService } from './evaluation-common.service';
import { IEvaluationGroupDataEntity, IEvaluationGroupDataToSaveEntity, IEvaluationItemDataEntity, IEvaluationItemDataGetListResponseEntity, ScreenEvaluationCompleteEntity, TPoints } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class EvaluationItemDataService extends DataServiceFlatLeaf<IEvaluationItemDataGetListResponseEntity, IEvaluationItemDataGetListResponseEntity, IEvaluationItemDataGetListResponseEntity> {
	private readonly evaluationDetailService: EvaluationDetailService = inject(EvaluationDetailService);
	private _selected: IEvaluationItemDataEntity | null = null;

	public pointsChangedMessage: EventEmitter<TPoints> = new EventEmitter<TPoints>();
	public commonService: EvaluationCommonService = inject(EvaluationCommonService);

	public _hasWrite: boolean = true;
	public _hasRead: boolean = true;

	public constructor(public groupDataService: EvaluationGroupDataService) {
		const options: IDataServiceOptions<IEvaluationItemDataGetListResponseEntity> = {
			apiUrl: 'businesspartner/main/evaluationitemdata',
			readInfo: {
				endPoint: 'listitemdata',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IEvaluationItemDataGetListResponseEntity, IEvaluationItemDataGetListResponseEntity, IEvaluationItemDataGetListResponseEntity>>{
				role: ServiceRole.Leaf,
				// TODO: Check whether this typecast is really safe  
				parent: groupDataService as unknown as IEvaluationItemDataGetListResponseEntity,
				itemName: 'EvaluationItemData',
			},
		};

		super(options);

		this.pointsChangedMessage.subscribe((info) => {
			this.groupDataService.changePointHandler(info);
		});
	}

	public set selected(value: IEvaluationItemDataEntity | null) {
		this._selected = value;
	}

	public get selected(): IEvaluationItemDataEntity | null {
		return this._selected;
	}

	protected override provideLoadPayload(): object {
		const groupItem = this.groupDataService.selected;
		const result = {
			EvaluationSubGroupDataId: 0,
			EvaluationSubGroupId: 0,
		};
		if (groupItem?.IsEvaluationSubGroupData) {
			result.EvaluationSubGroupDataId = groupItem.Id;
			result.EvaluationSubGroupId = groupItem.EvaluationGroupFk;
			return result;
		}

		return result;
	}

	protected override onLoadSucceeded(loaded: object): IEvaluationItemDataGetListResponseEntity[] {
		if (!loaded) {
			return [];
		}
		this.incorporateDataRead(loaded as IEvaluationItemDataGetListResponseEntity);
		return loaded as IEvaluationItemDataGetListResponseEntity[];
	}

	public get hasWrite() {
		return this._hasWrite;
	}

	public set hasWrite(value: boolean) {
		this._hasWrite = value;
	}

	public get hasRead() {
		return this._hasRead;
	}

	public set hasRead(value: boolean) {
		this._hasRead = value;
	}

	// function initCreationData(creationData, data) {
	// 	var currentParentItem = data.currentParentItem;
	// 	if (currentParentItem) {
	// 		creationData.EvaluationSubGroupDataId = currentParentItem.Id;
	// 		/** @namespace currentParentItem.EvaluationSubGroupFk */
	// 		creationData.EvaluationSubGroupId = currentParentItem.EvaluationSubGroupFk;
	// 	}
	// }

	private incorporateDataRead(readItems: IEvaluationItemDataGetListResponseEntity) {
		// data.itemList = [];
		// var dataRead;
		//
		if (readItems !== null && readItems.EvaluationItem !== null) {
			forEach(readItems.EvaluationItem, function (item) {
				// format the string
				item.Description = escape(item.Description);
			});
		}

		readItems = readItems || {};
		// var localEvaluationData;
		const localEvaluationData: Partial<ScreenEvaluationCompleteEntity> = {};
		if (this.evaluationDetailService.updateOptions?.getDataFromLocal) {
			this.commonService.onCollectLocalEvaluationDataScreen.emit(localEvaluationData);
			if (localEvaluationData?.EvaluationGroupDataToSave) {
				const parentItem = this.groupDataService.selected;
				if (parentItem) {
					const temp = find(localEvaluationData.EvaluationGroupDataToSave, { MainItemId: parentItem.Id });
					/** @namespace temp.EvaluationItemDataToSave */
					if (temp && isArray(temp.EvaluationItemDataToSave) && temp.EvaluationItemDataToSave.length > 0) {
						forEach(readItems.dtos, function (item) {
							const existed = find(temp.EvaluationItemDataToSave, { Id: item.Id });
							if (existed) {
								Object.assign(item, existed);
							}
						});
					}
				}
			}
		}

		if (readItems && Object.prototype.hasOwnProperty.call(readItems, 'dtos')) {
			forEach(readItems.dtos, (item) => {
				this.processItemReadonly(item);
			});
			// $timeout(function () {
			// 	basicsLookupdataLookupDescriptorService.attachData(readItems);
			// }, 50);
			// } else {
			// 	_.forEach(readItems, function (item) {
			// 		processItemReadonly(item, data);
			// 	});
			// 	dataRead = data.handleReadSucceeded(readItems || [], data);
		}
		// return dataRead;
	}

	private processItemReadonly(newItem: IEvaluationItemDataEntity) {
		this.setEntityReadOnly(newItem as IEvaluationItemDataGetListResponseEntity, !this._hasWrite);

		if (!this._hasWrite) {
			return;
		}

		let fields = [];
		const parentService = this.groupDataService ? this.groupDataService.getParentService() : null;
		const parentSelected = parentService ? parentService.currentSelectItem : null;
		if (parentSelected) {
			const evaluationStatus = this.evaluationDetailService.getEvaluationStatus();
			const status = find(evaluationStatus, { Id: parentSelected.EvalStatusFk });
			fields = [
				{
					field: 'IsTicked',
					readOnly: true,
				},
				{
					field: 'Remark',
					readOnly: true,
				},
			];
			if (status?.Readonly) {
				this.setEntityReadOnlyFields(newItem as IEvaluationItemDataGetListResponseEntity, fields);
				return;
			}

			// set readonly by Evaluation IsReadonly
			if (parentSelected.IsReadonly) {
				this.setEntityReadOnlyFields(newItem as IEvaluationItemDataGetListResponseEntity, fields);
				return;
			}
		}
	}

	public markItemAsModified(item: IEvaluationItemDataEntity) {
		const modifiedDataCache = this.evaluationDetailService.getModifiedDataCache();
		const parentItem = this.groupDataService.selected;
		if (parentItem) {
			const propName = this.groupDataService.itemName + 'ToSave';
			let groupDataToSave: IEvaluationGroupDataToSaveEntity[] = get(modifiedDataCache, propName);
			if (groupDataToSave) {
				const parentExisted = find(groupDataToSave, { MainItemId: parentItem.Id });
				if (parentExisted) {
					let itemDataToSave: IEvaluationItemDataEntity[] = get(parentExisted, this.itemName + 'ToSave');
					if (itemDataToSave) {
						const itemExisted = find(itemDataToSave, { Id: item.Id });
						if (!itemExisted) {
							itemDataToSave.push(item);
							modifiedDataCache.EntitiesCount += 1;
						}
					} else {
						itemDataToSave = [item];
						modifiedDataCache.EntitiesCount += 1;
					}
				} else {
					const p = {
						MainItemId: parentItem.Id,
						IsEvaluationSubGroupData: true,
					};
					set(p, this.itemName + 'ToSave', [item]);
					groupDataToSave.push(p);
					modifiedDataCache.EntitiesCount += 1;
				}
			} else {
				const toAdd = {
					MainItemId: parentItem.Id,
					IsEvaluationSubGroupData: true,
				};
				set(toAdd, this.itemName + 'ToSave', [item]);
				groupDataToSave = [toAdd];
				modifiedDataCache.EntitiesCount += 1;
			}

			// check the subGroupData and GroupData
			const parentExistedEntity = find(groupDataToSave, { MainItemId: parentItem.Id });
			if (parentExistedEntity && (item.EvaluationSubGroupDataFk < 0 || this.groupDataService.isCreate)) {
				const evaluationGroupData = get(parentExistedEntity, this.groupDataService.itemName) as IEvaluationGroupDataEntity;
				if (!evaluationGroupData) {
					set(parentExistedEntity, this.groupDataService.itemName, parentItem);
					modifiedDataCache.EntitiesCount += 1;
				}
				if (parentItem.PId! < 0 || this.groupDataService.isCreate) {
					const parentParentExisted = find(groupDataToSave, { MainItemId: parentItem.PId });
					if (!parentParentExisted) {
						const parentParentTree = this.groupDataService.getGroupList();
						const parentParent = find(parentParentTree, { Id: parentItem.PId });
						groupDataToSave.push({
							MainItemId: parentItem.PId!,
							EvaluationGroupData: parentParent,
							IsEvaluationSubGroupData: true,
						});
						modifiedDataCache.EntitiesCount += 1;
					}
				}
			}
		}
		this.commonService.onItemViewGridRefreshEvent.emit(this.getItemList());
	}

	public markCurrentItemAsModified() {
		if (this._selected) {
			this.markItemAsModified(this._selected);
		}
	}

	public getItemList() {
		return this.getList() as IEvaluationItemDataGetListResponseEntity;
	}
}
