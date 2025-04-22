/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

/**
 *
 */
export class PrcSharedPrcConfigEntity {
	public PrcConfigHeaderFk!: number;
	public RubricCategoryFk!: number;
	public IsMaterial?: boolean;
	public IsService?: boolean;
	public PaymentTermPaFk?: number;
	public PaymentTermFiFk?: number;
	public PaymentTermAdFk?: number;

	public constructor(public Id: number, public Description: string, RubricCategoryFk: number) {

	}
}

/**
 * Procurement configuration lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class PrcSharedPrcConfigLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<PrcSharedPrcConfigEntity, TEntity> {
	public constructor() {
		super('PrcConfiguration', {
			uuid: 'e8b3c27bee2a313f1955d03f7e598112',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}