/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {PlatformLazyInjectorService} from '@libs/platform/common';
import {FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {IPackageEstimateLineItemEntity} from '../../model/entities/package-estimate-line-item-entity.interface';
import {ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN} from '@libs/estimate/shared';
import {MODULE_INFO_PROCUREMENT} from '@libs/procurement/common';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageEstimateLineItemLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IPackageEstimateLineItemEntity>> {
		const layout = await this.getCommonLayout();
		layout.groups = layout.groups || [];
		layout.groups.push({
			gid: 'additional',
			attributes: ['statusImage']
		});
		const transientFields = [
			{
				id: 'statusImage',
				model: 'statusImage',
				type: FieldType.ImageSelect,
				readonly: true,
				label: { key: MODULE_INFO_PROCUREMENT.ProcurementPackageModuleName + '.generated' },
				itemsSource: {
					items: [
						{
							id: 'ico-indicator4-0',
							displayName: 'procurement.package.notAssigned',
							iconCSS: 'status-icons ico-indicator4-0'
						},
						{
							id: 'ico-indicator4-1',
							displayName: 'procurement.package.partiallyAssigned',
							iconCSS: 'status-icons ico-indicator4-1'
						},
						{
							id: 'ico-indicator4-2',
							displayName: 'procurement.package.totallyAssigned',
							iconCSS: 'status-icons ico-indicator4-2'
						}
					]
				}
			}
		];
		layout.transientFields = layout.transientFields || [];
		layout.transientFields.push(...transientFields);
		return layout;
	}

	private async getCommonLayout(): Promise<ILayoutConfiguration<IPackageEstimateLineItemEntity>> {
		const lineItemCommonLayoutService = await this.lazyInjector.inject(ESTIMATE_MAIN_LINE_ITEM_LAYOUT_TOKEN);
		return await lineItemCommonLayoutService.generateLayout();
	}
}