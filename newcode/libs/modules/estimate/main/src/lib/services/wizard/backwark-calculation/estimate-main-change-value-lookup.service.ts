import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class EstimateMainChangeValueLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(1, translateService.instant('estimate.main.backwardCalculation.CostFactor1').text),
			new LookupSimpleEntity(2, translateService.instant('estimate.main.backwardCalculation.QuantityFactor1').text),
			new LookupSimpleEntity(3, translateService.instant('estimate.main.backwardCalculation.Quantity').text),
			new LookupSimpleEntity(4, translateService.instant('estimate.main.backwardCalculation.CostUnit').text),
		];
		super(items, { uuid: '5f5d384fa3cccc1d7403069808562f61', displayMember: 'description', valueMember: 'id' });
	}
}
