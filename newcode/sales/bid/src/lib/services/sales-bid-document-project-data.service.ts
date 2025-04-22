/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DocumentProjectDataRootService, IDocumentFilterForeignKeyEntity, IDocumentProjectEntity } from '@libs/documents/shared';
import { IBidHeaderEntity } from '@libs/sales/interfaces';
import { isNull } from 'lodash';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Sales Bid Document Project data service
 */
export class SalesBidDocumentProjectDataService extends DocumentProjectDataRootService<IBidHeaderEntity> {
	protected readonly parentService: SalesBidBidsDataService;

	public constructor() {
		const parentDataService = inject(SalesBidBidsDataService);
		super(parentDataService);
		this.parentService = parentDataService;
	}

	protected override getFilterCriteria(): IDocumentFilterForeignKeyEntity {
		const selectedSalesBidHeader = this.parentService.getSelectedEntity();
		return isNull(selectedSalesBidHeader) ? {} : { BidHeaderFk: selectedSalesBidHeader.Id };
	}

	public override onDocumentCreated(created: IDocumentProjectEntity): IDocumentProjectEntity {
		const selectedSalesBidHeader = this.parentService.getSelectedEntity();
		if (selectedSalesBidHeader) {
			created.BidHeaderFk = selectedSalesBidHeader.Id;
		}
		return created;
	}
}
