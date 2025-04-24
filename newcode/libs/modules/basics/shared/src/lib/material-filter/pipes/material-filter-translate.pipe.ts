/*
 * Copyright(c) RIB Software GmbH
 */

import { Pipe, PipeTransform, inject } from '@angular/core';
import { PlatformLazyInjectorService, PlatformTranslateService } from '@libs/platform/common';
import { MaterialFilterId } from '../model';
import { BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY, IBasicsMaterialLayoutService } from '@libs/basics/interfaces';
import { EntityFilterSource, IEntityFilterDefinition } from '../../entity-filter';

/**
 * Pipe to translate material filter definitions
 */
@Pipe({
	name: 'materialFilterTranslate',
})
export class BasicsSharedMaterialFilterTranslatePipe implements PipeTransform {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly translateService = inject(PlatformTranslateService);
	private materialLayoutService?: IBasicsMaterialLayoutService;

	public constructor() {
		this.lazyInjector.inject(BASICS_MATERIAL_LAYOUT_SERVICE_FACTORY).then(e => {
			this.materialLayoutService = e;
		});
	}

	/**
	 * Transforms a material filter definition to its translated description
	 * @param definition The material filter definition
	 * @returns The translated description of the filter definition
	 */
	public transform(definition: IEntityFilterDefinition): string {
		let description = definition.Id;

		if (definition.Source === EntityFilterSource.Attribute) {
			return description;
		}

		if (this.materialLayoutService && definition.Source === EntityFilterSource.Entity && definition.PropertyName) {
			const label = this.materialLayoutService.getCommonLabel()[definition.PropertyName];

			if (label) {
				return this.translateService.instant(label).text;
			}
		}

		switch (definition.Id) {
			case MaterialFilterId.CatalogAndGroup:
				description = this.translateService.instant('basics.material.record.materialCatalog').text;
				break;
			case MaterialFilterId.PrcStructure:
				description = this.translateService.instant('basics.material.lookup.filter.prcStructure').text;
				break;
			case MaterialFilterId.CatalogType:
				description = this.translateService.instant('basics.material.lookup.filter.catalogType').text;
				break;
			case MaterialFilterId.MaterialType:
				description = this.translateService.instant('basics.material.record.materialType').text;
				break;
			case MaterialFilterId.Uom:
				description = this.translateService.instant('cloud.common.entityUoM').text;
				break;
		}

		return description;
	}
}
