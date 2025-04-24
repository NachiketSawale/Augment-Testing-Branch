/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntitySelection } from '@libs/platform/data-access';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { ServiceLocator } from '@libs/platform/common';
import {
	BusinessPartnerLookupService,
	BusinesspartnerSharedEvaluationDataService,
	EvaluationBaseService
} from '@libs/businesspartner/shared';
import { IEvaluationGetTreeResponse, IExtendCreateOptions } from '@libs/businesspartner/interfaces';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { BusinesspartnerMainHeaderDataService } from '@libs/businesspartner/main';
import { find } from 'lodash';

@Injectable({
	providedIn: 'root',
})

export class ProcurementQuoteBusinessPartnerEvaluationService extends EvaluationBaseService<IQuoteHeaderEntity, IQuoteHeaderEntity> {
	public permissionUuid: string = '953895e120714ab4b6d7283c2fc50e14';

	public constructor() {
		super();
	}

	public override getModuleName(): string {
		return 'procurement.quote';
	}

	public override getMainService(): IEntitySelection<IQuoteHeaderEntity> {
		return ServiceLocator.injector.get(ProcurementQuoteHeaderDataService);
	}

	public override getParentService(): IEntitySelection<IQuoteHeaderEntity> {
		return ServiceLocator.injector.get(ProcurementQuoteHeaderDataService);
	}

	public override extendCreateOptions(
		createOptions: IExtendCreateOptions,
		parentService?: IEntitySelection<IQuoteHeaderEntity>,
		evaluationTreeService?: BusinesspartnerSharedEvaluationDataService<object, object>,
	): IExtendCreateOptions {
		if (!parentService) {
			return createOptions;
		}
		const selectEntities = parentService.getSelection() ?? null;
		createOptions.businessPartnerId = selectEntities && selectEntities.length > 0 ? selectEntities[0].BusinessPartnerFk : undefined;
		return createOptions;
	}

	public override onDataReadComplete(readItems: IEvaluationGetTreeResponse, parentService: IEntitySelection<IQuoteHeaderEntity>, evaluationTreeService: BusinesspartnerSharedEvaluationDataService<object, object>) {
		const businessPartnerDataService = ServiceLocator.injector.get(BusinesspartnerMainHeaderDataService);
		const businessPartners = ServiceLocator.injector.get(BusinessPartnerLookupService).syncService?.getListSync();
		const quoteHeaderEntity = parentService.getSelectedEntity();
		if (quoteHeaderEntity) {
			const businessPartnerItem = find(businessPartners, item => {
				return item.Id === quoteHeaderEntity.BusinessPartnerFk;
			});
			if (businessPartnerItem) {
				evaluationTreeService.disableDelete(businessPartnerDataService.isBpStatusHasRight(businessPartnerItem, 'statusWithDeleteRight'));
			}
		}
	}

	public override provideLoadPayload() {
		const parentService = this.getParentService();
		let id: number = this.getIfSelectedIdElse(-1, parentService);
		if (parentService?.hasSelection()) {
			const selected = parentService.getSelectedEntity();
			id = selected ? selected.BusinessPartnerFk : -1;
		}
		return {
			mainItemId: id
		};
	}
}