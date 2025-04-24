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
import { ModelAdministrationRootDataService } from '../../services/model-administration-root-data.service';
import { IDynHlSchemeCompleteEntity } from '../model/entities/dyn-hl-scheme-complete-entity.interface';

/**
 * The data service for the static highlighting schemes entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDynHlSchemeDataService
	extends DataServiceFlatNode<IHighlightingSchemeEntity, IDynHlSchemeCompleteEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/dynhlscheme',
			readInfo: {
				endPoint: 'listschemes'
			},
			roleInfo: <IDataServiceChildRoleOptions<IHighlightingSchemeEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'DynHlSchemes',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	public override createUpdateEntity(modified: IHighlightingSchemeEntity | null): IDynHlSchemeCompleteEntity {
		return {
			DynHlSchemes: modified,
			DynHlItemsToSave: null,
			DynHlItemsToDelete: null
		};
	}
}