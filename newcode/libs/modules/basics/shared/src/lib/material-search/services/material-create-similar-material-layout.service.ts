/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY, IMaterialEntity } from '@libs/basics/interfaces';
import { PlatformLazyInjectorService } from '@libs/platform/common';

/**
 * Material similar layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialCreateSimilarMaterialLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	/**
	 * Display Attributes
	 */
	public attributes: (keyof Partial<IMaterialEntity>)[] = [
		'MaterialCatalogFk',
		'MaterialGroupFk',
		'Code',
		'MatchCode',
		'DescriptionInfo1',
		'DescriptionInfo2',
		'MdcMaterialabcFk',
		'BasCurrencyFk',
		'UomFk',
		'RetailPrice',
		'ListPrice',
		'EstimatePrice',
		'ExternalCode'
	];

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMaterialEntity>> {
		const commonLayoutService = await this.lazyInjector.inject(BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY);
		return commonLayoutService.generateLayout({
			groups: [{
				gid: 'basicData',
				title: {key: 'cloud.common.entityProperties'},
				attributes: this.attributes
			}]
		});
	}
}
