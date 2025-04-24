/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ProcurementStructureTypeEntity } from './entities/procurement-structure-type-entity';

/*
 * Procurement Structure
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedProcurementStructureTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ProcurementStructureTypeEntity, TEntity> {
	public constructor() {
		super('PrcStructureType', {
			uuid: '4445d9ca5a864b7db2a6dc0e708107eb',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}