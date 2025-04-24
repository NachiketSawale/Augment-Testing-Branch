/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root',
})
export class QtoMainExportFormatLookupDataService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const items: LookupSimpleEntity[] = [new LookupSimpleEntity(1, 'DA11'), new LookupSimpleEntity(2, 'X31'), new LookupSimpleEntity(3, 'CRBX'), new LookupSimpleEntity(4, 'XML')];
		super(items, { uuid: 'BD8E79AE77B84D98B48F328416CCB28A', displayMember: 'description', valueMember: 'id' });
	}
}
