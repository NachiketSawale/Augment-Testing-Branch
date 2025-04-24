/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import {
	DataServiceFlatRoot,
	ServiceRole,
	IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';
import { QtoFormulaRubricCategoryGridComplete } from '../model/qto-formula-rubric-category-grid-complete.class';
import {IRubricCategoryEntity} from '../model/entities/rubric-category-entity.interface';

import {ISearchResult} from '@libs/platform/common';
import {get} from 'lodash';

export const QTO_FORMULA_RUBRIC_CATEGORY_GRID_DATA_TOKEN = new InjectionToken<QtoFormulaRubricCategoryGridDataService>('qtoFormulaRubricCategoryGridDataToken');

@Injectable({
	providedIn: 'root'
})

export class QtoFormulaRubricCategoryGridDataService extends DataServiceFlatRoot<IRubricCategoryEntity, QtoFormulaRubricCategoryGridComplete> {

	public constructor() {
		const options: IDataServiceOptions<IRubricCategoryEntity> = {
			apiUrl: 'qto/formula/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IRubricCategoryEntity>>{
				role: ServiceRole.Root,
				itemName: 'RubricCategory',
			}
		};

		super(options);
	}
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IRubricCategoryEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: loaded as IRubricCategoryEntity[]
		};
	}

	public override createUpdateEntity(modified: IRubricCategoryEntity | null): QtoFormulaRubricCategoryGridComplete {
		return new QtoFormulaRubricCategoryGridComplete();
	}
}





		
			





