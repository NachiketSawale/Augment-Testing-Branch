/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

/*
 * Controlling Unit lookup service
 * Todo - currently the backend lookup service is implemented in the basics.masterdata module due to history reason, should move to controlling module
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingSharedControllingUnitLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IControllingUnitLookupEntity, TEntity> {
	public constructor() {
		super('controllingunit', {
			uuid: '47783c48d2834cada2b45f5d8b176701',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			treeConfig: {
				parentMember: 'ControllingunitFk',
				childMember: 'ChildItems',
			},
		});

		this.paging.enabled = true;
		this.paging.pageCount = 10;
	}
}
