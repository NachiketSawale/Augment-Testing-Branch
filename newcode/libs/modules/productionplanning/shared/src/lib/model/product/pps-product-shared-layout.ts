import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { IPpsProductEntityGenerated } from './product-entity-generated.interface';
import { PpsProcessCommonLookupService } from '../../services';
import { PPSStrandPatternLookupService } from '../strandpattern/pps-strandpattern-lookup.service';
import { PPSProductionSetLookupService } from '../production-set/pps-productionset-lookup.service';

export const PpsProductSharedLayout: ILayoutConfiguration<IPpsProductEntityGenerated> = {
	groups: [
		{
			gid: 'product',
			attributes: ['Code', 'Descriptioninfo', 'ProductStatusFk', 'ProductDescriptionFk', 'ProjectId', 'EngDrawingFk', 'MaterialFk', 'LgmJobFk', 'ExternalCode', 'PpsStrandPatternFk', 'IsLive', 'Guid'],
		},
		{
			gid: 'production',
			attributes: [
				'ProductionSetFk',
				'TrsProductBundleFk',
				'PrjLocationFk',
				'PuPrjLocationFk',
				'UnitPrice',
				'BillQuantity',
				'BasUomBillFk',
				'PlanQuantity',
				'BasUomPlanFk',
				'ItemFk',
				'ProductionOrder',
				'Reproduced',
				'PrjStockFk',
				'PrjStockLocationFk',
				'ProductionTime',
				'PpsProcessFk',
				'PpsProductionSetSubFk',
				'FabriCode',
				'FabriExternalCode',
				'ProdPlaceFk',
			],
		},
		{
			gid: 'dimensions',
			attributes: ['Length', 'BasUomLengthFk', 'Width', 'BasUomWidthFk', 'Height', 'BasUomHeightFk', 'Area', 'Area2', 'Area3', 'BasUomAreaFk', 'Volume', 'Volume2', 'Volume3', 'BasUomVolumeFk'],
		},
		{
			gid: 'propertiesGroup',
			attributes: ['IsolationVolume', 'ConcreteVolume', 'ConcreteQuality', 'Weight', 'Weight2', 'Weight3', 'ActualWeight', 'BasUomWeightFk'],
		},
		{
			gid: 'transport',
			attributes: ['TrsRequisitionFk', 'TrsRequisitionDate'],
		},
		{
			gid: 'userDefTextGroup',
			attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'UserdefinedByProddesc1', 'UserdefinedByProddesc2', 'UserdefinedByProddesc3', 'UserdefinedByProddesc4', 'UserdefinedByProddesc5'],
		},
	],
	overloads: {
		ProductStatusFk: BasicsSharedLookupOverloadProvider.providePpsProductStatusLookupOverload(true),
		EngDrawingFk: {},
		PpsStrandPatternFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PPSStrandPatternLookupService,

			}),
		},
		ProductionSetFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PPSProductionSetLookupService
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Description',
					label: {
						text: 'Production Set Description',
						key: 'productionplanning.common.product.productionSetDes',
					},
					column: true,
					singleRow: true,
					readonly: true,
				},
			],
		},
		TrsProductBundleFk: {},
		TrsRequisitionFk: {},
		ItemFk: {},
		PpsProcessFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				showDialog: true,
				showClearButton: true,
				dataServiceToken: PpsProcessCommonLookupService,
			}),
		},
		PpsProductionSetSubFk: {},
		ProdPlaceFk: {},
		ProjectId: {},
		MaterialFk: {},
		LgmJobFk: {},
		PrjLocationFk: {},
		PuPrjLocationFk: {},
		PrjStockFk: {},
		PrjStockLocationFk: {},
		BasUomBillFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomPlanFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomAreaFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomVolumeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		BasUomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		Userdefined1: {
			label: {
				text: '*User-Defined 1',
				key: 'cloud.common.entityUserDefined',
				params: { p_0: '1' },
			},
			type: FieldType.Description,
		},
		Userdefined2: {
			label: {
				text: '*User-Defined 2',
				key: 'cloud.common.entityUserDefined',
				params: { p_0: '2' },
			},
			type: FieldType.Description,
		},
		Userdefined3: {
			label: {
				text: '*User-Defined 3',
				key: 'cloud.common.entityUserDefined',
				params: { p_0: '3' },
			},
			type: FieldType.Description,
		},
		Userdefined4: {
			label: {
				text: '*User-Defined 4',
				key: 'cloud.common.entityUserDefined',
				params: { p_0: '4' },
			},
			type: FieldType.Description,
		},
		Userdefined5: {
			label: {
				text: '*User-Defined 5',
				key: 'cloud.common.entityUserDefined',
				params: { p_0: '5' },
			},
			type: FieldType.Description,
		},
	},
	labels: {
		...prefixAllTranslationKeys('cloud.common.', {
			Code: { key: 'entityCode', text: '*Code' },
			Descriptioninfo: { key: 'entityDescription', text: '*Description' },
			IsLive: { key: 'entityIsLive', text: '*Active' },
			ProductStatusFk: { key: 'entityStatus', text: '*Status' },
		}),
		...prefixAllTranslationKeys('productionplanning.common.', {
			FabriCode: { key: 'product.FabriCode', text: '*Fabrication Unit Code' },
			FabriExternalCode: { key: 'product.FabriExternalCode', text: '*Fabrication Unit ExternalCode' },
			ExternalCode: { key: 'product.externalCode', text: '*ExternalCode' },
			EngDrawingFk: { key: 'product.drawing', text: '*Drawing' },
			Length: { key: 'product.length', text: '*Length' },
			Width: { key: 'product.width', text: '*Width' },
			Height: { key: 'product.height', text: '*Height' },
			BasUomLengthFk: { key: 'product.lengthUoM', text: '*Length UoM' },
			BasUomWidthFk: { key: 'product.widthUoM', text: '*Width UoM' },
			BasUomHeightFk: { key: 'product.heightUoM', text: '*Height UoM' },
			BasUomAreaFk: { key: 'product.areaUoM', text: '*Area UoM' },
			BasUomVolumeFk: { key: 'product.volumeUoM', text: '*Volume UoM' },
			Area: { key: 'product.area', text: '*Area' },
			Area2: { key: 'product.area2', text: '*Area2' },
			Area3: { key: 'product.area3', text: '*Area3' },
			Volume: { key: 'product.volume', text: '*Volume' },
			Volume2: { key: 'product.volume2', text: '*Volume2' },
			Volume3: { key: 'product.volume3', text: '*Volume3' },
			PlanQuantity: { key: 'product.planQuantity', text: '*Plan Quantity' },
			BillQuantity: { key: 'product.billQuantity', text: '*Bill Quantity' },
			Weight: { key: 'product.weight' },
			Weight2: { key: 'product.weight2' },
			Weight3: { key: 'product.weight3' },
			BasUomWeightFk: { key: 'product.weightUoM' },
			ActualWeight: { key: 'product.actualWeight' },
			ProductDescriptionFk: { key: 'product.productDescriptionFk' },
			ProjectId: { key: 'prjProjectFk', text: 'Project No' },
			MaterialFk: { key: 'mdcMaterialFk' },
			TrsProductBundleFk: { key: 'product.trsProductBundleFk' },
			PrjLocationFk: { key: 'prjLocationFk' },
			PuPrjLocationFk: { key: 'puPrjLocationFk' },
			UnitPrice: { key: 'product.unitPrice' },
			BasUomBillFk: { key: 'product.billUoM' },
			BasUomPlanFk: { key: 'product.planUoM' },
			ItemFk: { key: 'event.itemFk' },
			ProductionOrder: { key: 'product.productionOrder' },
			ProductionSetFk: { key: 'product.productionSetFk' },
			Reproduced: { key: 'product.reproduced' },
			ProductionTime: { key: 'productionTime' },
			PpsProcessFk: { key: 'product.Process' },
			PpsProductionSetSubFk: { key: 'product.subProductionSet' },
			UserdefinedByProddesc1: { key: 'product.userdefinedbyproddesc1' },
			UserdefinedByProddesc2: { key: 'product.userdefinedbyproddesc2' },
			UserdefinedByProddesc3: { key: 'product.userdefinedbyproddesc3' },
			UserdefinedByProddesc4: { key: 'product.userdefinedbyproddesc4' },
			UserdefinedByProddesc5: { key: 'product.userdefinedbyproddesc5' },
		}),
		...prefixAllTranslationKeys('productionplanning.producttemplate.', {
			Guid: { key: 'GUID' },
		}),
		...prefixAllTranslationKeys('productionplanning.strandpattern.', {
			PpsStrandPatternFk: { key: 'entityStrandPattern' },
		}),
		...prefixAllTranslationKeys('procurement.common.', {
			PrjStockFk: { key: 'entityPrjStock' },
			PrjStockLocationFk: { key: 'entityPrjStockLocation' },
		}),
		...prefixAllTranslationKeys('productionplanning.product.', {
			ProdPlaceFk: { key: 'productionPlace.productionPlace' },
		}),
		...prefixAllTranslationKeys('transportplanning.requisition.', {
			TrsRequisitionFk: { key: 'entityRequisition' },
			TrsRequisitionDate: { key: 'entityRequisitionDate' },
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			IsolationVolume: { key: 'productDescription.isolationVolume' },
			ConcreteVolume: { key: 'productDescription.concreteVolume' },
			ConcreteQuality: { key: 'productDescription.concreteQuality' },
		}),
		...prefixAllTranslationKeys('project.costcodes.', {
			LgmJobFk: { key: 'lgmJobFk' },
		}),
	},
};
