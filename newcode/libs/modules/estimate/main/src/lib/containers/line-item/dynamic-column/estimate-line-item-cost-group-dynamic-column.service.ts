/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldValidationInfo } from '@libs/ui/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { BasicSharedCostGroupDynamicColumnService, IBasicMainItem2CostGroup, ICostGroupCatEntity } from '@libs/basics/shared';
import { find } from 'lodash';
import { ValidationResult } from '@libs/platform/data-access';
import { Injectable } from '@angular/core';
import { IEstLineItemResponseEntity, LineItemBaseComplete } from '@libs/estimate/shared';
@Injectable({
	providedIn: 'root'
})
export class EstimateLineItemCostGroupDynamicColumnService<T extends IEstLineItemEntity> extends BasicSharedCostGroupDynamicColumnService<T> {

	public initialData(readData: object): void {
		const read = readData as IEstLineItemResponseEntity;
		this.costGroupCat = read.CostGroupCats;
		this.mainItem2CostGroups = read.LineItem2CostGroups;
	}

	public provideUpdateData(updateObj: object): void {
		const updateData = updateObj as LineItemBaseComplete;
		updateData.CostGroupToDelete = this.deletedEntities;
		updateData.CostGroupToSave = this.modifiedEntities;
	}

	public validateColumn(info: FieldValidationInfo<T>, item: ICostGroupCatEntity): ValidationResult {
		const entity = info.entity;
		const lineItem2costGroup = find(this.mainItem2CostGroups, {
			CostGroupCatFk: item.Id,
			MainItemId: entity.Id,
			RootItemId: entity.EstHeaderFk
		});
		if (lineItem2costGroup) {
			if (info.value) {
				lineItem2costGroup.CostGroupFk = info.value as number;
				if (!find(this.modifiedEntities, {Id: lineItem2costGroup.Id})) {
					this.modifiedEntities.push(lineItem2costGroup);
				}
			} else {
				if (!find(this.deletedEntities, {Id: lineItem2costGroup.Id})) {
					this.deletedEntities.push(lineItem2costGroup);
				}
			}
		} else {
			if (info.value) {
				const newItem = {
					CostGroupCatFk: item.Id,
					CostGroupFk: info.value as number,
					Id: --this.idx,
					MainItemId: entity.Id,
					RootItemId: entity.EstHeaderFk,
					Version: 0,
					Code: ''
				};
				this.modifiedEntities.push(newItem);
			}
		}
		return new ValidationResult();
	}

	public getMatchedEntity(entities: T[], item2CostGroup: IBasicMainItem2CostGroup): T | null {
		const entity = find(entities, {Id: item2CostGroup.MainItemId, EstHeaderFk: item2CostGroup.RootItemId});
		if (entity) {
			return entity as T;
		}
		return null;
	}
}