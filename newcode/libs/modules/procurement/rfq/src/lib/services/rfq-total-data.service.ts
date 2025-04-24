/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IPrcCommonTotalEntity, IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqHeaderMainDataService } from './procurement-rfq-header-main-data.service';
import { ProcurementCommonTotalDataService } from '@libs/procurement/common';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { ProcurementInternalModule } from '@libs/procurement/shared';

/**
 * Represents the data service to handle rfq requisition field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqTotalDataService extends ProcurementCommonTotalDataService<IPrcCommonTotalEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {

	private readonly rfqHeaderDataService: ProcurementRfqHeaderMainDataService;
	protected internalModuleName = ProcurementInternalModule.Rfq;
	public constructor() {
		const rfqHeaderDataService = inject(ProcurementRfqHeaderMainDataService);

		super(rfqHeaderDataService, {
			apiUrl: 'procurement/rfq/total'
		});

		this.rfqHeaderDataService = rfqHeaderDataService;

		rfqHeaderDataService.RootDataCreated$.subscribe((resp) => {

		});
	}
	public getExchangeRate(): number {
		return 1;
	}
}
