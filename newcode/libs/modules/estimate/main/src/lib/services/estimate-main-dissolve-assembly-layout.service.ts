/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedUomLookupService, EstimateAssembliesCategoryLookupService } from '@libs/basics/shared';
import { ColumnDef, FieldType, createLookup } from '@libs/ui/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateLineItemBaseLayoutService } from '@libs/estimate/shared';


@Injectable({
  providedIn: 'root'
})

/**
 * Containes layout configuration for Dissolve Assembly Wizard
 */
export class EstimateMainDissolveAssemblyLayoutService extends EstimateLineItemBaseLayoutService<IEstLineItemEntity>{

	public generateGridConfig(): ColumnDef<IEstLineItemEntity>[] {
		return [
			{
				id: 'Selected',
				model: 'IsChecked',
				label: {
					text:'Select',
					key: 'estimate.main.dissolveAssemblyWizard.select'
				},
				type: FieldType.Boolean,
				sortable: true,
				visible: true,
				width: 65
			},
			{
				id: 'EstAssemblyCatFk',
				model: 'EstAssemblyCatFk',
				label: {
					text:'Assembly Category',
					key: 'estimate.main.assemblyCategoryId'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: EstimateAssembliesCategoryLookupService
				}),
				sortable: true,
				visible: true,
				readonly: false,
				width: 125
			},
			{
				id: 'code',
				model: 'Code',
				label: {
					text:'Code',
					key: 'cloud.common.entityCode'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				readonly: true,
				width: 100
			},
			{
				id: 'description',
				model: 'DescriptionInfo.Translated',
				label: {
					text:'Description',
					key: 'cloud.common.entityDescription'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
				readonly:true,
				width: 120
			},
			{
				id: 'uom',
				model: 'BasUomFk',
				label: {
					text:'UoM',
					key: 'cloud.common.entityUoM'
				},
				//type: FieldType.Description,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
							dataServiceToken: BasicsSharedUomLookupService
						}),
				sortable: true,
				visible: true,
				readonly: true
			},
			{
				id: 'costUnit',
				model: 'costUnit',
				label: {
					text:'Cost/Unit',
					key: 'estimate.main.costUnit'
				},
				type: FieldType.Description,
				sortable: true,
				visible: true
			},

		];
	}
}
