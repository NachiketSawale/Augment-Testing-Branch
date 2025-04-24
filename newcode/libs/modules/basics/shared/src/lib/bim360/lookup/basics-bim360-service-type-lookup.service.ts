/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupItemsDataService } from '@libs/ui/common';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBim360SyncProjectParamsService } from '../services/sync-project-params.service';
import { IBasicsBim360ParamSelectItem } from './entities/basics-bim360-param-select-item.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360ServiceTypeLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<IBasicsBim360ParamSelectItem, TEntity> {
	public constructor() {
		const items = ServiceLocator.injector.get(BasicsSharedBim360SyncProjectParamsService).getServiceTypes();
		super(items, {
			uuid: 'b3743a84e2514cf2bcd6accdea8e5701',
			idProperty: 'Id',
			valueMember: 'id',
			displayMember: 'translatedText',
			showGrid: false,
			disableDataCaching: true,
		});
	}
}
