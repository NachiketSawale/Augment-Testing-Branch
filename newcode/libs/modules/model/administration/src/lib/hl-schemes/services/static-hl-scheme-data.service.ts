/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IHighlightingSchemeEntity } from '../model/entities/highlighting-scheme-entity.interface';
import { IModelAdministrationRootEntity } from '../../model/entities/model-administration-root-entity.interface';
import {
	IModelAdministrationCompleteEntity
} from '../../model/entities/model-administration-complete-entity.interface';
import { IStaticHlSchemeCompleteEntity } from '../model/entities/static-hl-scheme-complete-entity.interface';
import { ModelAdministrationRootDataService } from '../../services/model-administration-root-data.service';

/**
 * The data service for the static highlighting schemes entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationStaticHlSchemeDataService
	extends DataServiceFlatNode<IHighlightingSchemeEntity, IStaticHlSchemeCompleteEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/statichlscheme',
			readInfo: {
				endPoint: 'listschemes'
			},
			roleInfo: <IDataServiceChildRoleOptions<IHighlightingSchemeEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'StaticHlSchemes',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	public override createUpdateEntity(modified: IHighlightingSchemeEntity | null): IStaticHlSchemeCompleteEntity {
		return {
			StaticHlSchemes: modified,
			StaticHlItemsToSave: null,
			StaticHlItemsToDelete: null
		};
	}
}