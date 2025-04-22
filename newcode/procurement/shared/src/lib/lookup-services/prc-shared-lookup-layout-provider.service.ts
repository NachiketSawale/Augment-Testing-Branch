/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupLayoutService, ILookupLayoutConfig } from '@libs/basics/shared';
import { ProcurementPackageLookupService } from './package-lookup.service';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';

/**
 * A shared lookup layout service to deal with lookup fields in container layout.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementSharedLookupLayoutProvider {
	private readonly lookupLayoutService = inject(BasicsSharedLookupLayoutService);

	public providePackageLookupFields<T extends object>(containerLayout: ILayoutConfiguration<T>, config: ILookupLayoutConfig<T>) {
		this.lookupLayoutService.appendLookupFieldsIntoLayout<T, IProcurementPackageLookupEntity>(containerLayout, {
			...config,
			lookupService: ProcurementPackageLookupService,
			lookupFields: [
				{
					id: 'TextInfo',
					lookupModel: 'TextInfo',
					label: {
						key: 'procurement.common.entityPackageTextInfo',
						text: 'Package Text Info',
					},
					type: FieldType.Description,
				},
			],
		});
	}
}
