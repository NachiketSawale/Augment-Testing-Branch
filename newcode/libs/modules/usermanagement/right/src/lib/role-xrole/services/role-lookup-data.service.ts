import { UiCommonLookupTypeDataService } from '@libs/ui/common';
import { ILookupEntity } from '../model/entities/role-xrole-lookup-entity.interface';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UsermanagementRoleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<ILookupEntity, TEntity> {
	public constructor() {
		super('accessrole', {
			uuid: '3e81897650174fc7b320c0265c6c4dac',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Name'
		});
	}
}
