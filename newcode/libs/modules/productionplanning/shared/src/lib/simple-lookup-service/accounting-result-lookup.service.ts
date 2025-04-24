import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsAccountingResultLookupEntity } from '../model/accounting';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedAccountingResultLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsAccountingResultLookupEntity, TEntity> {

	public constructor() {
		super('PpsAccountingRulesetResult', {
			valueMember: 'Id',
			displayMember: 'Description',
			uuid: 'ace6b5e9d5614fv9b954a9c7ebb59ff2',
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