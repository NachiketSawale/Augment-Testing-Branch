/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {ProcurementContractHeaderDataService} from './procurement-contract-header-data.service';

import {IConHeaderEntity} from '../model/entities';
import {ContractComplete} from '../model/contract-complete.class';
import { ProcurementCommonTotalDataService} from '@libs/procurement/common';
import {ProcurementInternalModule} from '@libs/procurement/shared';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

export const PROCUREMENT_CONTRACTTOTAL_DATA_TOKEN = new InjectionToken<ProcurementContractTotalDataService>('procurementContractTotalDataToken');


/**
 * Contract total data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractTotalDataService extends ProcurementCommonTotalDataService<IPrcCommonTotalEntity, IConHeaderEntity, ContractComplete> {
	private contractDataService: ProcurementContractHeaderDataService;

	protected internalModuleName = ProcurementInternalModule.Contract;

	public constructor() {
		const contractDataService = inject(ProcurementContractHeaderDataService);

		super(contractDataService, {
			apiUrl: 'procurement/contract/total',
		});

		this.contractDataService = contractDataService;

		contractDataService.RootDataCreated$.subscribe((resp) => {
			if (resp.PrcTotalsDto) {
				this.createdTotals = resp.PrcTotalsDto;
			}
		});
	}

	public getExchangeRate(): number {
		return this.parentService.getSelectedEntity()!.ExchangeRate;
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcCommonTotalEntity): boolean {
		return entity.HeaderFk === parentKey.Id;
	}

}