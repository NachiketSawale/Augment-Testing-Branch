/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {PlatformLazyInjectorService} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN} from '@libs/estimate/shared';
import {IPackageEstimateResourceEntity} from '../../model/entities/package-estimate-resource-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPackageEstimateResourceLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IPackageEstimateResourceEntity>> {
		return await this.getCommonLayout();
	}

	private async getCommonLayout(): Promise<ILayoutConfiguration<IPackageEstimateResourceEntity>> {
		const resourceCommonLayoutService = await this.lazyInjector.inject(ESTIMATE_MAIN_RESOURCE_LAYOUT_TOKEN);
		return await resourceCommonLayoutService.generateLayout();
	}
}
