/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ICompanyCostDataEntity } from '../model/entities/company-cost-data-entity.interface';
import { ControllingActualsCostHeaderDataService } from './controlling-actuals-cost-header-data.service';
import { ICompanyCostHeaderEntity } from '../model/entities/company-cost-header-entity.interface';
import { ControllingActualsCostHeaderComplete } from '../model/controlling-actuals-cost-header-complete.class';

export const CONTROLLING_ACTUALS_COST_DATA_DATA_TOKEN = new InjectionToken<ControllingActualsCostDataDataService>('controllingActualsCostDataDataToken');

@Injectable({
	providedIn: 'root',
})
export class ControllingActualsCostDataDataService extends DataServiceFlatLeaf<ICompanyCostDataEntity, ICompanyCostHeaderEntity, ControllingActualsCostHeaderComplete> {
	public constructor(controllingActualsCostHeaderDataService: ControllingActualsCostHeaderDataService) {
		const options: IDataServiceOptions<ICompanyCostDataEntity> = {
			apiUrl: 'controlling/actuals/costdata',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyCostDataEntity, ICompanyCostHeaderEntity, ControllingActualsCostHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'controllingActualsCostDataToSave',
				parent: controllingActualsCostHeaderDataService,
			},
		};

		super(options);
	}
	protected override onCreateSucceeded(loaded: object): ICompanyCostDataEntity {
		const parent = this.getSelectedParent();
		const entity = loaded as ICompanyCostDataEntity;
		if (entity && parent) {
			entity.CompanyCostHeaderFk = parent.Id;
		}
		return entity;
	}
	public override registerByMethod(): boolean {
		return true;
	}
	public override registerModificationsToParentUpdate(parentUpdate: ControllingActualsCostHeaderComplete, modified: ICompanyCostDataEntity[], deleted: ICompanyCostDataEntity[]): void {
		if (modified && modified.some(() => true)) {
			if (modified && modified.length > 0) {
				parentUpdate.controllingActualsCostDataToSave = modified;
				parentUpdate.EntitiesCoun = 1;
				parentUpdate.MainItemId = modified[0].CompanyCostHeaderFk;
			}
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.controllingActualsCostDataToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: ControllingActualsCostHeaderComplete): ICompanyCostDataEntity[] {
		if (complete && complete.controllingActualsCostDataToSave) {
			return complete.controllingActualsCostDataToSave;
		}
		return [];
	}

	public getParent(): ICompanyCostHeaderEntity | undefined {
		return this.getSelectedParent();
	}
}
