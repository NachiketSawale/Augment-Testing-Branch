import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupSimpleDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class ProcurementSharedItemEvaluationLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('prc.item.evaluation', {
			displayMember: 'Description',
			uuid: '3e9b73bc382b42599003d862c6cc30fd',
			valueMember: 'Id'
		});
	}
}
