/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { FieldType, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule, PlatformTranslateService } from '@libs/platform/common';

import { ProcurementStockItemInfoDataService } from '../../services/procurement-stock-item-info-data.service';
import { ProcurementStockHeaderDataService } from '../../services/procurement-stock-header-data.service';


/**
 * The interface for viewOptions,representing the filter criteria for stock item info
 */
export interface IStockItemInfoViewOptions {
	outStandingText?: string;
	deliveredText?: string;
	isOutStanding: boolean;
	isDelivered: boolean;
	startDate: Date | undefined;
	endDate: Date | undefined;
}

/**
 * Procurement Stock Item Info Component
 */
@Component({
	selector: 'procurement-stock-item-info',
	templateUrl: './item-info.component.html',
	styleUrls: ['./item-info.component.scss'],
	imports: [FormsModule, PlatformCommonModule, UiCommonModule],
	standalone: true,
})
export class ProcurementStockItemInfoComponent {
	/**
	 * To inject PlatformTranslateService
	 */
	private translate = inject(PlatformTranslateService);

	/**
	 * To inject ProcurementStockItemInfoDataService
	 */
	private readonly dataService = inject(ProcurementStockItemInfoDataService);

	/**
	 * To inject ProcurementStockHeaderDataService
	 */
	private readonly parentService = inject(ProcurementStockHeaderDataService);

	/**
	 * The Subscription
	 */
	private parentServiceSubscription!: Subscription;

	/**
	 * Property FieldType of type FieldType
	 */
	protected readonly FieldType = FieldType;
	
	/**
	 * Stores the current filter settings for stock item information, with default values
	 */
	public viewOptions: IStockItemInfoViewOptions = {
		outStandingText: this.translate.instant('procurement.stock.outStandingText').text,
		deliveredText: this.translate.instant('procurement.stock.deliveredText').text,
		isOutStanding: true,
		isDelivered: false,
		startDate: undefined,
		endDate: undefined,
	};

	public ngOnInit(): void {
		this.parentServiceSubscription = this.parentService.selectionChanged$.subscribe(() => {
			this.setFilter();
		});
	}

	/**
	 * Updates the filter in the data service with the current viewOptions
	 */
	private setFilter(): void {
		this.dataService.initItemInfoFilter(this.viewOptions);
	}

	/**
	 * Updates the start date in viewOptions and applies the filter.
	 * @param {Date | undefined} newDate
	 */
	public onStartDateChange(newDate: Date | undefined): void {
		this.viewOptions.startDate = newDate;
		this.setFilter();
	}

	/**
	 * Updates the end date in viewOptions and applies the filter.
	 * @param {Date | undefined} newDate
	 */
	public onEndDateChange(newDate: Date | undefined): void {
		this.viewOptions.endDate = newDate;
		this.setFilter();
	}

	public ngOnDestroy(): void {
		if (this.parentServiceSubscription) {
			this.parentServiceSubscription.unsubscribe();
		}
	}
}
