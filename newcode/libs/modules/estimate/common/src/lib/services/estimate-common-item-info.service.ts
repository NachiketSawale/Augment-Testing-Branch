import { IEstResourceEntity } from '@libs/estimate/interfaces';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { ITranslated, PlatformTranslateService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { EstimateMainResourceType } from '../model/enums/estimate-common-item-info-types.enum';
import { EstimateCommonTypeRecogniteService } from '@libs/estimate/shared';

@Injectable({
	providedIn: 'root'
})
export class EstimateCommonItemInfoService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly typeRecogniteService = inject(EstimateCommonTypeRecogniteService);

	/**
	 * Get comment item info
	 * @param item Line items or Resource items
	 * @param itemInfos Translated item info
	 */
	public getCommonItemInfo(item: IEstLineItemEntity | IEstResourceEntity, itemInfos: ITranslated[]) {
		if (this.typeRecogniteService.isResourceEntity(item)) {
			if (item.IsDisabled) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.Disabled));
			}
			if (item.IsLumpsum) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.Lumpsum));
			}
			if (item.IsFixedBudget) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.FixedBudget));
			}
		} else {
			if (item.IsGc) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.GcItem));
			}
			if (item.IsIncluded) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.Included));
			}
			if (item.IsDisabled || item.IsOptional) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.Disabled));
			}
			if (item.IsLumpsum) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.Lumpsum));
			}
			if (item.IsFixedBudget) {
				itemInfos.push(this.translateService.instant(EstimateMainResourceType.FixedBudget));
			}
		}
	}

	/**
	 * Set item info for line item
	 * @param item line items
	 */
	public buildLineItemInfo(item: IEstLineItemEntity): string {
		const itemInfos: ITranslated[] = [];

		this.getCommonItemInfo(item, itemInfos);

		if (item.IsOptionalIT) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.OptionalIT));
		}
		if (item.IsNoMarkup) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.NoMarkup));
		}
		if (item.IsFixedPrice) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.FixedPrice));
		}
		if (item.NoLeadQuantity) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.NoLeadQuantity));
		}
        return itemInfos.join();
	}

	/**
	 * Set item info for resource
	 * @param item Resource items
	 */
	public buildResourceItemInfo(item: IEstResourceEntity): string {
		const itemInfos: ITranslated[] = [];

		this.getCommonItemInfo(item, itemInfos);

		if (item.IsDisabledPrc) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.DisabledPrc));
		}
		if (item.IsRuleMarkupCostCode) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.MarkupCost));
		}
		if (!item.IsBudget) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.NoBudget));
		}
		if (item.IsGeneratedPrc) {
			itemInfos.push(this.translateService.instant(EstimateMainResourceType.GenerateByPrc));
		}
        return itemInfos.join();
	}
}
