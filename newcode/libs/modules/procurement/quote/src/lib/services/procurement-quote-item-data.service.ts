/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IQuoteItemEntity } from '../model/entities/quote-item-entity.interface';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ICreatePrcItemDto, IPrjStockContext, ProcurementCommonItemDataService, ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { QuoteItemComplete } from '../model/entities/quote-item-entity-complete.class';
import { ServerSideFilterValueType, UiCommonMessageBoxService } from '@libs/ui/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementQuotePriceConditionDataService } from './procurement-quote-price-condition-data.service';
import { ProcurementQuoteRequisitionDataService } from './quote-requisitions-data.service';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';
import { IQuoteRequisitionEntity } from '../model/entities/quote-requisition-entity.interface';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { ProcurementQuoteItemValidationService } from './validations/quote-items-validation.service';

export const PROCUREMENT_QUOTE_ITEM_DATA_TOKEN = new InjectionToken<ProcurementQuoteItemDataService>('procurementQuoteItemDataToken');

/**
 * quote item data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteItemDataService extends ProcurementCommonItemDataService<IQuoteItemEntity, QuoteItemComplete, IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly uiCommonMessageBoxService = inject(UiCommonMessageBoxService);
	private readonly quoteHeaderService = inject(ProcurementQuoteHeaderDataService);
	/**
	 * Identify whether it is possible to copy call off items via toolbar button
	 */
	public canCopyCallOffItems?: boolean = false;

	/**
	 * The constructor
	 */
	public constructor(public readonly quoteRequisitionService: ProcurementQuoteRequisitionDataService) {
		super(
			quoteRequisitionService,
			{
				readInfo: {
					endPoint: 'list',
					usePost: false,
				},
				createInfo: {
					endPoint: 'create',
					usePost: true,
				},
			},
			ProcurementQuoteItemValidationService,
		);
	}

	/**
	 * Create update entity
	 * @param modified
	 */
	public override createUpdateEntity(modified: IQuoteItemEntity | null): QuoteItemComplete {
		const complete = new QuoteItemComplete();
		if (modified !== null) {
			complete.PrcItem = modified;
		}

		if (this.hasSelection()) {
			complete.MainItemId = this.getSelectedEntity()!.Id;
		}
		return complete;
	}

	/**
	 * Get parent exchange rate
	 * @protected
	 */
	public override getParentExchangeRate(): number {
		return 1;
	}

	protected override provideLoadPayload(): object {
		const quoteRequisition = this.quoteRequisitionService.getSelectedEntity()!;
		const quote = this.quoteHeaderService.getSelectedEntity()!;
		return {
			MainItemId: quoteRequisition.PrcHeaderFk,
			projectId: quote.ProjectFk!,
			moduleName: ProcurementInternalModule.Quote,
		};
	}

	protected override provideCreatePayload(): object {
		const payload = super.provideCreatePayload() as ICreatePrcItemDto;
		payload.IsContract = false;
		payload.IsPackage = false;
		return payload;
	}

	protected override onCreateSucceeded(created: object): IQuoteItemEntity {
		return super.onCreateSucceeded(created);
	}

	public override getStockContext(): IPrjStockContext {
		const selected = this.getSelectedEntity();
		if (selected) {
			return {
				materialFk: selected.MdcMaterialFk ?? undefined,
				materialStockFk: selected.MaterialStockFk ?? undefined,
			};
		}
		return {};
	}

	public override getAgreementLookupFilter(): ServerSideFilterValueType {
		return {};
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: QuoteRequisitionEntityComplete, modified: QuoteItemComplete[], deleted: IQuoteItemEntity[]) {
		if ( modified?.some(() => true)) {
			parentUpdate.PrcItemToSave = modified;
		}

		if (deleted?.some(() => true)) {
			parentUpdate.PrcItemToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: QuoteRequisitionEntityComplete): IQuoteItemEntity[] {
		if (parentUpdate?.PrcItemToSave) {
			return parentUpdate.PrcItemToSave.map((e) => e.PrcItem!);
		}
		return [];
	}

	protected getPriceConditionService(): ProcurementCommonPriceConditionDataService<IQuoteItemEntity, QuoteItemComplete> {
		return ServiceLocator.injector.get(ProcurementQuotePriceConditionDataService);
	}

	public override isParentFn(parentKey: IQuoteRequisitionEntity, entity: IQuoteItemEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
