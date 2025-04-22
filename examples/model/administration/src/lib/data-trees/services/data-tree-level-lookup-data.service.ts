/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDataTreeLevelEntity } from '../model/entities/data-tree-level-entity.interface';

/**
 * A lookup data service for model data tree levels.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTreeLevelLookupDataService<T extends object> extends UiCommonLookupEndpointDataService<IDataTreeLevelEntity, T> {

	public constructor() {
		super({
			httpRead: {
				route: 'model/administration/datatreelevel',
				endPointRead: 'listenriched'
			},
			filterParam: 'mainItemId'
		}, {
			uuid: '8ba423bc95404d26aad5ff761aa7d924',
			valueMember: 'Id',
			displayMember: 'LevelIndex',
			gridConfig: {
				columns: [{
					id: 'index',
					model: 'LevelIndex',
					type: FieldType.Integer,
					width: 120,
					label: {key: 'model.administration.levelIndex'},
					sortable: true
				}, {
					id: 'propName',
					model: 'PropertyKeyEntity.PropertyName',
					type: FieldType.Description,
					width: 150,
					label: {key: 'model.administration.levelPropertyKeyName'},
					sortable: true
				}]
			}
		});
	}
}
