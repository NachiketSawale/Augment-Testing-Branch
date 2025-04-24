import { inject, Injectable, InjectionToken } from '@angular/core';
import { IPrcItemPriceConditionEntity, ProcurementCommonPriceConditionDataService } from '@libs/procurement/common';
import { IPriceConditionContext } from '@libs/basics/shared';
import { IPackageItemEntity } from '../model/entities/package-item-entity.interface';
import { PackageItemComplete } from '../model/entities/package-item-complete.class';
import { ProcurementPackageHeaderDataService } from './package-header-data.service';
import { ProcurementPackageItemDataService } from './procurement-package-item-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';

export const PROCUREMENT_PACKAGE_PRICE_CONDITION_DATA_TOKEN = new InjectionToken<ProcurementPackagePriceConditionDataService>('procurementQuotePriceConditionDataService');
@Injectable({
	providedIn: 'root',
})
export class ProcurementPackagePriceConditionDataService extends ProcurementCommonPriceConditionDataService<IPackageItemEntity, PackageItemComplete> {
	private readonly packageHeaderDataService = inject(ProcurementPackageHeaderDataService);

	public constructor(protected PackageItemService: ProcurementPackageItemDataService) {
		super(PackageItemService);
	}
	public override isParentFn(parentKey: IPackageItemEntity, entity: IPrcItemPriceConditionEntity): boolean {
		return entity.PrcItemFk === parentKey.Id;
	}
	public getContextFromParent(): IPriceConditionContext {
		let headerId = -1;
		let projectId = -1;
		let prcPriceConditionId: number | null = -1;
		let exchangeRate = 1;
		if (this.PackageItemService.getSelection().length > 0) {
			const parentItem = this.PackageItemService.getSelectedEntity();
			if (parentItem) {
				prcPriceConditionId = parentItem.PrcPriceConditionFk ?? null;
			}
			const packageHeader = this.packageHeaderDataService.getSelectedEntity();
			if (packageHeader) {
				headerId = packageHeader.Id;

				exchangeRate = packageHeader.ExchangeRate;
				if (packageHeader.ProjectFk) {
					projectId = packageHeader.ProjectFk;
				}
			}
		}
		return {
			PrcPriceConditionId: prcPriceConditionId,
			HeaderId: headerId,
			HeaderName: ProcurementInternalModule.Package,
			ProjectFk: projectId,
			ExchangeRate: exchangeRate,
		};
	}
}
