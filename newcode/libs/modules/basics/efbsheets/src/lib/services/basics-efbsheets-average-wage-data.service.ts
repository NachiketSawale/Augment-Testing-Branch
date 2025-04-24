/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, Injector } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { IIdentificationData } from '@libs/platform/common';
import { BasicsEfbsheetsDataService } from './basics-efbsheets-data.service';
import { IBasicsEfbsheetsComplete } from '../model/entities/basics-efbsheets-complete.interface';
import { IBasicsEfbsheetsAverageWageComplete } from '../model/entities/basics-efbsheets-average-wage-complete.interface';
import { childType, IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsEntity } from '@libs/basics/interfaces';
import { BasicsEfbsheetsCommonService } from './basics-efbsheets-common.service';

export const BASICS_EFBSHEETS_AVERAGE_WAGE_DATA_TOKEN = new InjectionToken<BasicsEfbsheetsAverageWageDataService>('basicsEfbsheetsAverageWageDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsEfbsheetsAverageWageDataService extends DataServiceFlatNode<IBasicsEfbsheetsAverageWageEntity,IBasicsEfbsheetsAverageWageComplete, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete> {
	private parentService: BasicsEfbsheetsDataService;
	public constructor(basicsEfbsheetsDataService: BasicsEfbsheetsDataService, private injector: Injector) {
		const options: IDataServiceOptions<IBasicsEfbsheetsAverageWageEntity> = {
			apiUrl: 'basics/efbsheets/averagewages',

			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: (ident: IIdentificationData) => {
					return { EstCrewMixFk: ident.pKey1 };
				},
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsEfbsheetsAverageWageEntity, IBasicsEfbsheetsEntity, IBasicsEfbsheetsComplete>>{
				role: ServiceRole.Node,
				itemName: 'EstAverageWage',
				parent: basicsEfbsheetsDataService
			},
		};

		super(options);
		this.parentService = basicsEfbsheetsDataService;
	}

	public canAverageWage() {
		const selectedCrewMix = this.parentService.getSelection();
		if (selectedCrewMix) {
			return true;
		} else {
			return false;
		}
	}

	public hasToLoadOnSelectionChange(crewmix: IBasicsEfbsheetsEntity) {
		if (crewmix) {
			//data.doNotLoadOnSelectionChange = false;
		}
	}

	/**
	 * Determines if the given entity is a child of the specified parent entity
	 * @param parentKey
	 * @param entity
	 * @returns
	 */
	public override isParentFn(parentKey: IBasicsEfbsheetsEntity, entity: IBasicsEfbsheetsAverageWageEntity): boolean {
		return entity.EstCrewMixFk === parentKey.Id;
	}

	/**
	 * This method registers the modofication and delete of Average Wages entity to provied update
	 * @param parentUpdate
	 * @param modified
	 * @param deleted
	 */
	public override registerNodeModificationsToParentUpdate(parentUpdate: IBasicsEfbsheetsComplete, modified: IBasicsEfbsheetsAverageWageComplete[], deleted: IBasicsEfbsheetsAverageWageEntity[]): void {
		if (modified && modified.length > 0) {
			parentUpdate.EstAverageWageToSave = modified;
		}
		const selectedCreMix = this.parentService.getSelection()[0];
		if (deleted && deleted.length > 0) {
			parentUpdate.EstAverageWageToDelete = deleted;
			const basicsEfbsheetsCommonService = this.injector.get(BasicsEfbsheetsCommonService);
			basicsEfbsheetsCommonService.calculateCrewmixesAndChilds(selectedCreMix, childType.AverageWage);
			parentUpdate.EstCrewMix = selectedCreMix ?? null;
		}
	}

	/**
	 * This method created IBasicsEfbsheetsAverageWageComplete object
	 * @param modified
	 * @returns
	 */
	public override createUpdateEntity(modified: IBasicsEfbsheetsAverageWageEntity): IBasicsEfbsheetsAverageWageComplete {
		return  {
			Id : modified?.Id,
			EstAverageWage: modified
		} as unknown as IBasicsEfbsheetsAverageWageComplete;
	}

	/**
	 * This method always returns `true`, indicating that registration by method is enable
	 * @returns
	 */
	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * Gets the saved entity
	 * @param parentUpdate
	 * @returns
	 */
	public override getSavedEntitiesFromUpdate(parentUpdate: IBasicsEfbsheetsComplete): IBasicsEfbsheetsAverageWageEntity[] {
		 if (parentUpdate && parentUpdate.EstAverageWageToSave) {
			return parentUpdate.EstAverageWageToSave ?? [];
		 }
		 return [];
	}

	/**
	 * Handles the successful creation of an entity by casting and returning it.
	 * @param created
	 * @returns
	 */
	public override onCreateSucceeded(created: object): IBasicsEfbsheetsAverageWageEntity {
		 return created as unknown as IBasicsEfbsheetsAverageWageEntity;
	}
}
