/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	ServiceRole,
	IDataServiceChildRoleOptions,
	DataServiceFlatLeaf
} from '@libs/platform/data-access';

import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementPricecomparisonRfqHeaderDataService } from './rfq-header-data.service';
import { IBusinessPartnerEntity, IBusinessPartnerResponse } from '@libs/businesspartner/interfaces';
import { PriceComparisonBusinessPartnerReadonlyProcessorService } from './business-partner-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPriceComparisonBusinessPartnerDataService extends DataServiceFlatLeaf<IBusinessPartnerEntity, IRfqHeaderEntity, RfqHeaderEntityComplete> {
	public readonly readonlyProcessor: PriceComparisonBusinessPartnerReadonlyProcessorService;
	/**
	 * @param parentService
	 */
	public constructor(
		private parentService: ProcurementPricecomparisonRfqHeaderDataService,
	) {
		super({
			apiUrl: 'businesspartner/main/businesspartner',
			readInfo: {
				endPoint: 'getbpbyrfqheaderfk',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IBusinessPartnerEntity, IRfqHeaderEntity, RfqHeaderEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartner',
				parent: parentService,
			}
		});

		this.readonlyProcessor = new PriceComparisonBusinessPartnerReadonlyProcessorService(this);
	}

	protected override onLoadSucceeded(loaded: IBusinessPartnerResponse): IBusinessPartnerEntity[] {
		return loaded.Main ?? [];
	}

	protected override provideLoadPayload(): object {
		const rfq = this.parentService.getSelectedEntity();
		let mainItemId = -1;
		if (rfq) {
			mainItemId = rfq.Id;
		}
		return {
			mainItemId: mainItemId
		};
	}

	public override canCreate(): boolean {
		return false;
	}

	public override canDelete(): boolean {
		return false;
	}
}





