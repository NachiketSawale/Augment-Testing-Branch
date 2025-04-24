/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IPpsFormulaEntity, PpsFormulaCompleteEntity } from '../model/models';

export const PPS_FORMULA_DATA_TOKEN = new InjectionToken<PpsFormulaDataService>('ppsFormulaDataToken');

@Injectable({
	providedIn: 'root'
})
export class PpsFormulaDataService extends DataServiceFlatRoot<IPpsFormulaEntity, PpsFormulaCompleteEntity> {

	public constructor() {
		const options: IDataServiceOptions<IPpsFormulaEntity> = {
			apiUrl: 'productionplanning/formulaconfiguration/formula',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsFormulaEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsFormula'
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsFormulaEntity | null): PpsFormulaCompleteEntity {
		const complete = new PpsFormulaCompleteEntity();

		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PpsFormula = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsFormulaCompleteEntity): IPpsFormulaEntity[] {
		if (complete.PpsFormula === null) {
			complete.PpsFormula = [];
		}

		return complete.PpsFormula!;
	}
}
