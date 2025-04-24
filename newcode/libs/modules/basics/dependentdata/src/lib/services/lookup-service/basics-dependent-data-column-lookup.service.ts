/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDependentDataColumnEntity } from '../../model/entities/dependent-data-column-entity.interface';
import { BasicsDependentDataDataService } from '../../dependent-data/basics-dependent-data-data.service';

/**
 * Dependent Data Column Lookup Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsDependentDataColumnLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IDependentDataColumnEntity, TEntity> {
	private readonly parentService = inject(BasicsDependentDataDataService);

	/**
	 * constructor
	 */
	public constructor() {
		super({
			httpRead: {route: 'basics/dependentdata/column', endPointRead: 'list', usePostForRead: false},
			filterParam: true,
			prepareListFilter: (context) => {
				const parentItem = this.parentService.getSelectedEntity();
				let dependentDataId = parentItem?.Id;
				if (!dependentDataId) {
					const entity = context?.entity as IDependentDataColumnEntity;
					dependentDataId = entity?.DependentDataFk;
				}
				return `mainItemId=${dependentDataId}`;
			}
		}, {
			uuid: 'fb0c4ce4e65749568f1e29dbb293dc31',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DatabaseColumn'
		});
	}
}