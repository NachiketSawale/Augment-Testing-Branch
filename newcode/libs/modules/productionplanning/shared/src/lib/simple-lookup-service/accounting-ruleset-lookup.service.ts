import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsAccountingRulesetLookupEntity } from '../model/accounting';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedAccountingRulesetLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsAccountingRulesetLookupEntity, TEntity> {

	public constructor() {
		super('ruleset', {
			valueMember: 'Id',
			displayMember: 'Description',
			uuid: 'bce6b5e9d5615fv9b954a9c7ecc59ff2',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 150,
						sortable: true,
						visible: true
					}
				],
			}
		});
	}
}