/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	LookupSimpleEntity,
	UiCommonLookupSimpleDataService
} from '@libs/ui/common';


/**
 *
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerEvaluationSchemaRubricCategoryLookupService<TEntity extends object = object> extends UiCommonLookupSimpleDataService<LookupSimpleEntity, TEntity> {
	public constructor() {
		super('basics.lookup.rubriccategory', {
			uuid: '9c0b33f0bf704cb88527fd160ce55a50',
			valueMember: 'id',
			displayMember: 'description',
			showCustomInputContent: true,
			clientSideFilter: {
				execute(item, context): boolean {
					return true;
				}
			}
		}, {
			customIntegerProperty: 'BAS_RUBRIC_FK', field: 'RubricFk'
		});
	}
}