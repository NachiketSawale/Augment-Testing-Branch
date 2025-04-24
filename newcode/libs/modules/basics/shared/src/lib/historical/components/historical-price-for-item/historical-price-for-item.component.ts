/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, GridComponent, ILookupReadonlyDataService, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BasicsSharedHistoricalPriceForItemDataServiceToken } from '../../model/interfaces/Historical-price-for-item-info-token.interface';
import { HistoricalPriceBaseComponent } from '../historical-price-base/historical-price-base.component';
import { IBasicsSharedHistoricalPriceForItemParam } from '../../model/interfaces/historical-price-for-item-parameter.interface';
import { PrcSharedPriceVersionLookupService } from '../../../lookup-services/prc-price-version-lookup.service';
import { IMaterialPriceVersionEntity } from '../../../interfaces/entities/material-price-version-entity.interface';

@Component({
	selector: 'basics-shared-historical-price-for-item',
	templateUrl: 'historical-price-for-item.component.html',
	standalone: true,
	imports: [GridComponent, PlatformCommonModule, UiCommonModule, FormsModule, NgClass, HistoricalPriceBaseComponent],
	styleUrl: 'historical-price-for-item.component.scss',
})
export class HistoricalPriceForItemComponent {
	public lookupDataService: ILookupReadonlyDataService<IMaterialPriceVersionEntity, object> = inject(PrcSharedPriceVersionLookupService);
	public lookupValue: number | null = null;
	public readonly dataService = inject(BasicsSharedHistoricalPriceForItemDataServiceToken);

	public currentItem: IBasicsSharedHistoricalPriceForItemParam = {
		queryFromQuotation: true,
		queryFromContract: true,
		queryFromMaterialCatalog: true,
		queryNeutralMaterial: true,
		startDate: undefined,
		endDate: undefined,
		priceVersionFk: -1,
		materialIds: [],
		businessPartnerId: null,
		itemValue: null,
		priceRange: null,
		priceCondition: null,
	};
	protected readonly fieldType = FieldType;

	public constructor() {}

	public neutralMatChange() {
		// TODO: neutralMatChange
	}

	public materialCatalogChange() {
		// TODO: materialCatalogChange
	}

	public valueChange(lookupValue: number) {
		this.currentItem.priceCondition = lookupValue;
	}

	public setCodeDesc() {
		return this.dataService.setCodeDesc();
	}
}
