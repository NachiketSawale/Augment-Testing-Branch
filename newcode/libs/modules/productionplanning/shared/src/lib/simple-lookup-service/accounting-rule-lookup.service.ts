import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IPpsAccountingRuleLookupEntity } from '../model/accounting';

@Injectable({
	providedIn: 'root'
})
export class ProductionplanningSharedAccountingRuleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPpsAccountingRuleLookupEntity, TEntity> {

	public constructor() {
		super('PpsAccountingRule', {
			valueMember: 'Id',
			displayMember: 'MatchPattern',
			uuid: '1d8f484f62fb49929ce392f82f91cb7d',
			gridConfig: {
				columns: [
					{
						id: 'matchPattern',
						model: 'MatchPattern',
						type: FieldType.Description,
						label: { text: 'MatchPattern', key: 'productionplanning.rule.matchPattern' },
						width: 150,
						sortable: true,
						visible: true
					}
				],
			}
		});
	}
}