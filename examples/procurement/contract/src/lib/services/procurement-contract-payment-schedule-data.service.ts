/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '../model/entities';
import { ProcurementModule } from '@libs/procurement/shared';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { IPrcPaymentScheduleEntity, ProcurementCommonPaymentScheduleDataService } from '@libs/procurement/common';

/**
 * Procurement contract payment schedule data service token
 */
export const PROCUREMENT_CONTRACT_PAYMENT_SCHEDULE_DATA_TOKEN = new InjectionToken<ProcurementContractPaymentScheduleDataService>('ProcurementContractPaymentScheduleDataService');

/**
 * Procurement contract payment schedule data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPaymentScheduleDataService extends ProcurementCommonPaymentScheduleDataService<IPrcPaymentScheduleEntity, IConHeaderEntity, ContractComplete> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementContractHeaderDataService);
		const totalSourceUrl = 'procurement/contract/total';
		super(ProcurementModule.Contract, totalSourceUrl, parentService, parentService);
	}

	public override isParentMainEntity(parent?: IConHeaderEntity): boolean {
		const parentSelected = parent ?? this.parentService.getSelectedEntity();
		return !!(parentSelected?.ConHeaderFk);
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcPaymentScheduleEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}