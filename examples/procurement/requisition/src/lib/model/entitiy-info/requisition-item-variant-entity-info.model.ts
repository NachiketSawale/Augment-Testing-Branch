import { EntityInfo } from '@libs/ui/business-base';
import { IPrcItemEntity, MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { RequisitionItemVariantDataService } from '../../services/requisition-item-variant-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedMaterialLookupService } from '@libs/basics/shared';

export const PROCUREMENT_REQUISITION_ITEM_VARIANT_ENTITY_INFO = EntityInfo.create<IPrcItemEntity>({
	grid: {
		title: {
			text: 'Requisition Item Variant',
			key: ProcurementInternalModule.Requisition + '.variant.reqItemVariantListTitle',
		},
		containerUuid: 'bf524a00b99d40198ea9e1a79afde315',
	},
	form: {
		title: {
			text: 'Requisition Item Variant Detail',
			key: ProcurementInternalModule.Requisition + '.variant.reqItemVariantDetailTitle',
		},
		containerUuid: '5562c729243c45d09c33e65df86340ea',
	},
	dataService: (ctx) => ctx.injector.get(RequisitionItemVariantDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_PROCUREMENT.ProcurementCommonPascalCasedModuleName, typeName: 'PrcItemDto' },
	permissionUuid: 'bf524a00b99d40198ea9e1a79afde315',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['MdcMaterialFk', 'Itemno', 'Description1', 'Quantity', 'BasUomFk', 'Price', 'Total', 'TotalOc', 'TotalGross', 'TotalGrossOc'],
			},
		],
		overloads: {
			MdcMaterialFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMaterialLookupService,
					showClearButton: true,
					readonly: true,
				}),
				width: 100,
				readonly: true,
			},
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.CloudCommonModuleName + '.', {
				Quantity: { key: 'entityQuantity', text: 'entityQuantity' },
				BasUomFk: { key: 'entityUoM', text: 'entityUoM' },
				Price: { key: 'entityPrice', text: 'entityPrice' },
				Total: { key: 'entityTotal', text: 'entityTotal' },
			}),
			...prefixAllTranslationKeys(MODULE_INFO_PROCUREMENT.ProcurementCommonModuleName + '.', {
				MdcMaterialFk: { key: 'prcItemMaterialNo', text: 'prcItemMaterialNo' },
				Itemno: { key: 'prcItemItemNo', text: 'prcItemItemNo' },
				Description1: { key: 'prcItemDescription1', text: 'prcItemDescription1' },
				TotalOc: { key: 'prcItemTotalCurrency', text: 'prcItemTotalCurrency' },
				TotalGross: { key: 'totalGross', text: 'Total (Gross)' },
				TotalGrossOc: { key: 'totalOcGross', text: 'Total Gross (Oc)' },
			}),
		},
	},
});
