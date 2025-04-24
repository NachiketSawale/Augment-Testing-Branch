/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsCurrencyConversionEntity } from '../model/basics-currency-conversion-entity.class';
import { BasicsCurrencyConversionComplete } from '../model/basics-currency-conversion-complete.class';

import { BasicsCurrencyEntity } from '../model/basics-currency-entity.class';
import { BasicsCurrencyComplete } from '../model/basics-currency-complete.class';
import { BasicsCurrencyDataService } from './basics-currency-data.service';
import { IIdentificationData } from '@libs/platform/common';


export const BASICS_CURRENCY_CONVERSION_DATA_TOKEN = new InjectionToken<BasicsCurrencyConversionDataService>('basicsCurrencyConversionDataToken');

@Injectable({
	providedIn: 'root'
})



export class BasicsCurrencyConversionDataService extends DataServiceFlatNode<BasicsCurrencyConversionEntity, BasicsCurrencyConversionComplete,BasicsCurrencyEntity, BasicsCurrencyComplete >{

	public constructor( basicscurrencyDataService: BasicsCurrencyDataService) {
		const options: IDataServiceOptions<BasicsCurrencyConversionEntity>  = {
			apiUrl: 'basics/currency/conversion',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
							mainItemId : ident.pKey1
					};
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						mainItemId: ident.pKey1,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<BasicsCurrencyConversionEntity,BasicsCurrencyEntity, BasicsCurrencyComplete>>{
				role: ServiceRole.Node,
				itemName: 'CurrencyConversion',
				parent: basicscurrencyDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: BasicsCurrencyConversionEntity | null): BasicsCurrencyConversionComplete {
		const complete = new BasicsCurrencyConversionComplete();
		if (modified !== null) {
			complete.CurrencyConversion = modified;
		}

		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: BasicsCurrencyComplete, modified: BasicsCurrencyConversionComplete[], deleted: BasicsCurrencyConversionEntity[]) {
		if (modified && modified.length > 0) {
			complete.CurrencyConversionToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.CurrencyConversionToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCurrencyComplete): BasicsCurrencyConversionEntity[] {
		if (complete && complete.CurrencyConversionToSave) {
			return complete.CurrencyConversionToSave.flatMap(e => e.CurrencyConversion ? e.CurrencyConversion : []);
		} else {
			return [];
		}
	}

	public override getModificationsFromUpdate(complete: BasicsCurrencyConversionComplete): BasicsCurrencyConversionEntity[] {
		if (complete.CurrencyConversion === null) {
			return [];
		}

		return [complete.CurrencyConversion];
	}

	public override isParentFn(parent: BasicsCurrencyEntity, entity: BasicsCurrencyConversionEntity): boolean {
		return parent.Id === entity.CurrencyHomeFk;
	}

}



