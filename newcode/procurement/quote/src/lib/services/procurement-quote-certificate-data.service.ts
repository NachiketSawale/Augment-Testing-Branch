/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementCommonCertificateDataService } from '@libs/procurement/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { ProcurementQuoteRequisitionDataService } from './quote-requisitions-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';

@Injectable({
    providedIn: 'root'
})

/**
 * Procurement Quote Certificate data service
 */
export class ProcurementQuoteCertificateDataService extends ProcurementCommonCertificateDataService<IPrcCertificateEntity, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {
	
	public constructor(
		protected quoteHeaderDataService: ProcurementQuoteHeaderDataService,
		protected parentDataService:ProcurementQuoteRequisitionDataService,
	) {
		super(parentDataService, {} );
	}

	public override provideLoadPayload(): object {
		const selection = this.parentDataService.getSelectedEntity()!;
		const headerDataSelection = this.quoteHeaderDataService.getSelectedEntity()!;
		return {
			MainItemId: selection.PrcHeaderFk,
			projectId: headerDataSelection.ProjectFk,
			moduleName: ProcurementInternalModule.Quote
		};
	}

	public override isParentFn(parentKey:IQuoteRequisitionEntity , entity: IPrcCertificateEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}