/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupContext, ILookupServerSideFilter, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { PrcSharedPrcConfigLookupService } from './prc-config-lookup.service';
import { IPrcTotalTypeEntity } from '@libs/basics/procurementconfiguration';

/**
 * Total type lookup service
 */
@Injectable({
	providedIn: 'root',
})
export class PrcSharedTotalTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPrcTotalTypeEntity, TEntity> {
	public constructor() {
		super('PrcTotalType', {
			uuid: 'b5c072562f52476bb597d159c91c3e2b',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 120
					},
					{
						id: 'description',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true,
						readonly: true,
						width: 150
					},
				],
			},
		});
	}
}

/**
 * Respective data filter
 */
export class PrcSharedTotalTypeLookupFilter<TEntity extends object> implements ILookupServerSideFilter<IPrcTotalTypeEntity, TEntity> {
	private prcConfigLookup = inject(PrcSharedPrcConfigLookupService);

	public key = 'procurement-common-total-type-filter';

	public execute(context: ILookupContext<IPrcTotalTypeEntity, TEntity>): Promise<string> {
		return new Promise((resolve) => {
			this.prcConfigLookup
				.getItemByKey({
					id: this.providePrcConfigurationFk(context),
				})
				.subscribe((e) => {
					resolve('PrcConfigHeaderFk=' + e.PrcConfigHeaderFk);
				});
		});
	}

	/**
	 * Provide PrcConfigurationFk from selected header entity
	 * @param context
	 * @protected
	 */
	protected providePrcConfigurationFk(context: ILookupContext<IPrcTotalTypeEntity, TEntity>): number {
		return 0;
	}
}
