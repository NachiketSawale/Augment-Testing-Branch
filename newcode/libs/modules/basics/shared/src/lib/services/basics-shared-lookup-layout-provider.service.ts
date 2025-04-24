/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedMaterialCatalogTypeLookupService } from '../lookup-services/customize';
import { BasicsSharedLookupLayoutService, ILookupLayoutConfig } from '../lookup-layout';
import { IMaterialSearchEntity } from '../material-search';
import { BasicsSharedMaterialLookupService } from '../material-lookup';

/**
 * A shared lookup layout service to deal with lookup fields in container layout.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedLookupLayoutProvider {
	private readonly lookupLayoutService = inject(BasicsSharedLookupLayoutService);

	public provideMaterialLookupFields<T extends object>(containerLayout: ILayoutConfiguration<T>, config: ILookupLayoutConfig<T>) {
		this.lookupLayoutService.appendLookupFieldsIntoLayout<T, IMaterialSearchEntity>(containerLayout, {
			...config,
			lookupService: BasicsSharedMaterialLookupService,
			lookupFields: [
				{
					id: 'MaterialCatalogCode',
					lookupModel: 'CatalogCode',
					label: {
						key: 'procurement.common.prcItemMaterialCatalogCode',
						text: 'Material Catalog Code',
					},
					type: FieldType.Code,
				},
				{
					id: 'MaterialCatalogDescription',
					lookupModel: 'CatalogDescriptionInfo',
					label: {
						key: 'procurement.common.prcItemMaterialCatalogDescription',
						text: 'Material Catalog Description',
					},
					type: FieldType.Translation,
				},
				{
					id: 'MaterialCatalogSupplier',
					lookupModel: 'Supplier',
					label: {
						key: 'procurement.common.prcItemMaterialCatalogSupplier',
						text: 'Material Catalog Supplier',
					},
					type: FieldType.Description,
				},
				{
					id: 'MaterialCatalogTypeFk',
					lookupModel: 'MaterialCatalogTypeFk',
					label: {
						key: 'procurement.common.prcItemMaterialCatalogType',
						text: 'Material Catalog Type',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialCatalogTypeLookupService,
					}),
				},
			],
		});
	}
}
