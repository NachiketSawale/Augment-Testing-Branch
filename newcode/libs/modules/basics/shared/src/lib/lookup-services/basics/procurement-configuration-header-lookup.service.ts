/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ProcurementConfigurationHeaderEntity } from '../entities/procurement-configuration-header-entity';

/**
 * ProcurementConfiguration lookup service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSharedProcurementConfigurationHeaderLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ProcurementConfigurationHeaderEntity, TEntity> {
	public constructor() {
		super('prcconfigheader', {
			uuid: '4e908f28c785469285de3f78edda8414',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}