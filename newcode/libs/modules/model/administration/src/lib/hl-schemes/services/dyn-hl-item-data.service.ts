/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IHighlightingSchemeEntity } from '../model/entities/highlighting-scheme-entity.interface';
import { IStaticHlSchemeCompleteEntity } from '../model/entities/static-hl-scheme-complete-entity.interface';
import { IHighlightingItemEntity } from '../model/entities/highlighting-item-entity.interface';
import { ModelAdministrationDynHlSchemeDataService } from './dyn-hl-scheme-data.service';
import { IDynHlSchemeCompleteEntity } from '../model/entities/dyn-hl-scheme-complete-entity.interface';

/**
 * The data service for the dynamic highlighting items entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDynHlItemDataService
	extends DataServiceFlatLeaf<IHighlightingItemEntity, IHighlightingSchemeEntity, IStaticHlSchemeCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor(parentService: ModelAdministrationDynHlSchemeDataService) {
		super({
			apiUrl: 'model/administration/dynhlitem',
			readInfo: {
				endPoint: 'listbyscheme',
				prepareParam: () => {
					const selected = parentService.getSelection()[0];
					return {
						schemeFk: selected?.Id ?? 0
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IHighlightingItemEntity, IHighlightingSchemeEntity, IDynHlSchemeCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'DynHlItems',
				parent: parentService
			}
		});
	}
}