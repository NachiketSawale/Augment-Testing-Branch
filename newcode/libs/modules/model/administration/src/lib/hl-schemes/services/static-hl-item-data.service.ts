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
import { ModelAdministrationStaticHlSchemeDataService } from './static-hl-scheme-data.service';

/**
 * The data service for the static highlighting items entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationStaticHlItemDataService
	extends DataServiceFlatLeaf<IHighlightingItemEntity, IHighlightingSchemeEntity, IStaticHlSchemeCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor(parentService: ModelAdministrationStaticHlSchemeDataService) {
		super({
			apiUrl: 'model/administration/statichlitem',
			readInfo: {
				endPoint: 'listbyscheme',
				prepareParam: () => {
					const selected = parentService.getSelection()[0];
					return {
						schemeFk: selected?.Id ?? 0
					};
				}
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IHighlightingItemEntity, IHighlightingSchemeEntity, IStaticHlSchemeCompleteEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'StaticHlItems',
				parent: parentService
			}
		});
	}
}