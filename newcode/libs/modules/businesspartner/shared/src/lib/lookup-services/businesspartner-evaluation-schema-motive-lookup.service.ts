import {Injectable} from '@angular/core';
import {
	LookupSimpleEntity,
	UiCommonLookupSimpleDataService
} from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

/**
 *
 */
export class BusinesspartnerSharedEvaluationSchemaMotiveLookupService<TEntity extends object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {

	/**
	 * constructor
	 */
	public constructor() {
		super('businesspartner.evaluation.motive', {
			displayMember: 'Description',
			uuid: 'ea324a5b5b2b45dfbe203597adf9ec04',
			valueMember: 'Id'
		});
	}
}
