/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnDestroy } from '@angular/core';
import { ILookupReadonlyDataService } from '@libs/ui/common';
import { BasicsSharedPriceConditionLookupService } from '../../../lookup-services/price-condition-lookup.service';
import { PriceConditionEntity } from '../../../lookup-services/entities/price-condition-entity.class';
import { BasicsSharedPriceConditionHeaderGridFooterInfoToken } from '../../model/interfaces/pricecondition-header-footer-info.interface';
import { Subscription } from 'rxjs';

/**
 * show price condition type lookup at top of price condition container
 */
@Component({
	templateUrl: './price-condition-header.component.html',
	styleUrl: './price-condition-header.component.scss',
})
export class BasicsSharedPriceConditionHeaderComponent implements OnDestroy{
	public value: number | null = null;
	public readonly: boolean = false;
	public lookupDataService: ILookupReadonlyDataService<PriceConditionEntity, object> = inject(BasicsSharedPriceConditionLookupService);
	public dataService = inject(BasicsSharedPriceConditionHeaderGridFooterInfoToken).dataService;

	/**
	 * The parent selected record Subscription
	 */
	private parentSelectionSubscription?: Subscription;

	public constructor() {
		this.parentSelectionSubscription = this.dataService.getParentService()?.selectionChanged$.subscribe((selection) => {
			if (selection && selection.length > 0) {
				this.value = this.dataService.getContextFromParent().PrcPriceConditionId;
			}
		});
	}

	public valueChange(value: number | null) {
		 this.dataService.reloadPriceConditions({priceConditionId:value});
	}

	public ngOnDestroy() {
		if (this.parentSelectionSubscription) {
			this.parentSelectionSubscription.unsubscribe();
		}
	}
}
