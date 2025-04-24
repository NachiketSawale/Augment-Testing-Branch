import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { QtoTypeEntity } from './entities/qto-type-entity.class';

@Injectable({
	providedIn: 'root'
})
export class QtoTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<QtoTypeEntity, TEntity> {
	public constructor() {
		super('qtotype', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}