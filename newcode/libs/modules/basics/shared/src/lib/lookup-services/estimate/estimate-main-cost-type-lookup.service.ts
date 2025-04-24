/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { UiCommonLookupSimpleDataService } from '@libs/ui/common';
import { IEstCostTypeEntity } from '../entities/estimate/est-costtype-entity.interface';



@Injectable({
	providedIn: 'root',
})

/**
 * @requires export class EstimateMainCostTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<IEstimateProjectEstType, TEntity> {

 * @description Service for looking up estimate main cost types.
 */
export class EstimateMainCostTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<IEstCostTypeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('estimate.lookup.esttype', {
			uuid: 'c359050664f340a2830bf45d7238ccd9',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description', 
		});
	}
}
