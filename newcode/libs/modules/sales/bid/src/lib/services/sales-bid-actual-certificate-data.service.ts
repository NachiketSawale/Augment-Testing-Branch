/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BusinesspartnerSharedCertificateNodeDataService } from '@libs/businesspartner/shared';
import { ICertificateResponse } from '@libs/businesspartner/interfaces';
import { IBidHeaderEntity } from '@libs/sales/interfaces';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';

@Injectable({
	providedIn: 'root',
})
/**
 * Sales Bid Actual Certificate Data service
 */
export class SalesBidActualCertificateDataService extends BusinesspartnerSharedCertificateNodeDataService<IBidHeaderEntity, BidHeaderComplete> {
	public constructor(protected parentBidService: SalesBidBidsDataService) {
		const options = {
			readInfo: {
				endPoint: 'listtosalesbid',
			},
			roleInfo: {
				parent: parentBidService,
			},
		};
		super('businesspartner.main.certificate', options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return { bidHeaderId: parentSelection.Id };
		}
		return { bidHeaderId: -1 };
	}

	protected override onLoadSucceeded(loaded: ICertificateResponse) {
		const data = loaded.dtos;
		return data;
	}

	public override canCreate() {
		return false;
	}

	public override canDelete() {
		return  false;
	}
}