/*
 * Copyright(c) RIB Software GmbH
 */

import {ServiceLocator} from '@libs/platform/common';
import {ProcurementPackageEstimateLineItemDataService} from '../package-estimate-line-item-data.service';
import {IPackageEstimateResourceEntity} from '../../model/entities/package-estimate-resource-entity.interface';
import {IEntityProcessor} from '@libs/platform/data-access';

export class ProcurementPackageEstimateResourceTypeProcessorService implements IEntityProcessor<IPackageEstimateResourceEntity>{
	private readonly lineItemService = ServiceLocator.injector.get(ProcurementPackageEstimateLineItemDataService);
	public process(resource: IPackageEstimateResourceEntity) {
		if (resource) {
			resource.EstResourceTypeFkExtend = resource.EstAssemblyTypeFk ? (4000 + resource.EstAssemblyTypeFk) : resource.EstResourceTypeFk;
		}

		const lineItem = this.lineItemService.getSelectedEntity();
		if (lineItem) {
			// if line item's EstLineItemFk has value, set all resources fileds readonly and a gray background css style
			// because the resources from the EstLineItemFk.
			if (lineItem.EstLineItemFk && lineItem.EstLineItemFk > 0) {
				resource.cssClass = 'row-readonly-background';
			} else {
				if (resource.cssClass === 'row-readonly-background') {
					resource.cssClass = '';
				}
			}
		}
	}

	public revertProcess(): void {
	}
}