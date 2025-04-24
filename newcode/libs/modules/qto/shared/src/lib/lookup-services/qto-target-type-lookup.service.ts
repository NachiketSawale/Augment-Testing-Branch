import { Injectable } from '@angular/core';
import { UiCommonLookupSimpleDataService } from '@libs/ui/common';
import { QtoTargetTypeEntity } from './entities/qto-target-type-entity.class';

@Injectable({
	providedIn: 'root'
})
export class QtoTargetTypeLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<QtoTargetTypeEntity, TEntity> {
	public constructor() {
		super('basics.customize.qtopurposetype', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description'
		});
	}
}