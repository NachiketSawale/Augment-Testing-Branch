/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, PlatformCommonModule, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonModule, FieldType } from '@libs/ui/common';
import { IBasicsSharedHistoricalPriceForItemParam } from '../../model/interfaces/historical-price-for-item-parameter.interface';
import { Subscription } from 'rxjs';
import { BasicsSharedHistoricalPriceBaseDataService } from '../../services/historical-price-base-data.service';

@Component({
	standalone: true,
	selector: 'basics-shared-historical-price-base',
	templateUrl: './historical-price-base.component.html',
	styleUrls: ['./historical-price-base.component.scss'],
	imports: [PlatformCommonModule, UiCommonModule],
})
export class HistoricalPriceBaseComponent<T extends IEntityIdentification, PT extends IEntityIdentification = IEntityIdentification, PU extends CompleteIdentification<PT> = CompleteIdentification<PT>> {
	@Input()
	public dataService!: BasicsSharedHistoricalPriceBaseDataService<T, PT, PU>;

	@Input()
	public currentItem!: IBasicsSharedHistoricalPriceForItemParam;

	private readonly translateService = inject(PlatformTranslateService);
	protected readonly fieldType = FieldType;

	public dateHasError() {
		return this.currentItem.startDate && this.currentItem.endDate && this.currentItem.startDate > this.currentItem.endDate;
	}

	public dateErrorText() {
		const dateHasError = this.dateHasError();
		return dateHasError
			? this.translateService.instant({
					key: 'basics.material.updatePriceWizard.DateError',
					params: {
						startDate: this.translateService.instant('basics.material.updatePriceWizard.startDate').text,
						endDate: this.translateService.instant('basics.material.updatePriceWizard.endDate').text,
					},
				}).text
			: '';
	}

	private parentSelectionSubscription?: Subscription;

	public constructor() {}

	public ngOnDestroy() {
		if (this.parentSelectionSubscription) {
			this.parentSelectionSubscription.unsubscribe();
		}
	}

	public async search() {
		await this.dataService.reloadData(this.currentItem);
	}

	public neutralMatChange() {}

	public setPriceRange() {
		return '';
	}
}
