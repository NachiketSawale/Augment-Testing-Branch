import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPpsProductTemplateEntity } from '../models';
import { PpsSharedDrawingDialogLookupService } from '@libs/productionplanning/shared';

export const PpsProductTemplateLayout: ILayoutConfiguration<IPpsProductTemplateEntity> = {
	groups: [
		{
			gid: 'baseGroup',
			attributes: [
				'DbId',
				'Code',
				'SortCode',
				'DescriptionInfo',
				'EngDrawingFk',
				'EngTaskFk',
				'MaterialFk',
				'Quantity',
				'UomFk',
				'BillingQuantity',
				'UomBillFk',
				'StackCode',
				'Level',
				'Number4Stack',
				'Number4Plan',
				'IsLive',
				'PpsStrandPatternFk',
				'Guid',
				'InstallationSequence',
				'MdcProductDescriptionFk',
				'PpsFormulaVersionFk',
			],
		},
		{
			gid: 'dimensions',
			attributes: ['Length', 'UomLengthFk', 'Width', 'UomWidthFk', 'Height', 'UomHeightFk', 'Area', 'Area2', 'Area3', 'UomAreaFk', 'Volume', 'Volume2', 'Volume3', 'UomVolumeFk'],
		},
		{
			gid: 'propertiesGroup',
			attributes: ['IsolationVolume', 'ConcreteVolume', 'ConcreteQuality', 'Weight', 'Weight2', 'Weight3', 'UomWeightFk'],
		},
		{
			gid: 'userDefTextGroup',
			attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'UserdefinedByMaterial1', 'UserdefinedByMaterial2', 'UserdefinedByMaterial3', 'UserdefinedByMaterial4', 'UserdefinedByMaterial5'],
		},
	],
	overloads: {
		MdcProductDescriptionFk: {},
		PpsFormulaVersionFk: {},
		MaterialFk: {},
		PpsStrandPatternFk: {},
		EngTaskFk: {},
		EngDrawingFk: {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PpsSharedDrawingDialogLookupService,
				showClearButton: false,
			}),
		},
		UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomBillFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomAreaFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomVolumeFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
		UomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
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
			baseGroup: { key: 'entityProperties', text: '*Basic Data' },
			Code: { key: 'entityCode', text: '*Code' },
			DescriptionInfo: { key: 'entityDescription', text: '*Description' },
			Quantity: { key: 'entityQuantity', text: '*Quantity' },
			UomFk: { key: 'entityUoM', text: '*UoM' },
			Sorting: { key: 'entitySorting', text: '*Sorting' },
			InstallationSequence: { key: 'installationSequence', text: '*Installation Sequence' },
		}),
		...prefixAllTranslationKeys('productionplanning.common.', {
			DbId: { key: 'summary', text: '*Summary' },
			Length: { key: 'product.length', text: '*Length' },
			Width: { key: 'product.width', text: '*Width' },
			Height: { key: 'product.height', text: '*Height' },
			UomLengthFk: { key: 'product.lengthUoM', text: '*Length UoM' },
			UomWidthFk: { key: 'product.widthUoM', text: '*Width UoM' },
			UomHeightFk: { key: 'product.heightUoM', text: '*Height UoM' },
			UomAreaFk: { key: 'product.areaUoM', text: '*Area UoM' },
			UomVolumeFk: { key: 'product.volumeUoM', text: '*Volume UoM' },
			UomWeightFk: { key: 'product.weightUoM', text: '*Weight UoM' },
			UomBillFk: { key: 'product.weightUoM', text: '*Weight UoM' },
			Area: { key: 'product.area', text: '*Area' },
			Area2: { key: 'product.area2', text: '*Area2' },
			Area3: { key: 'product.area3', text: '*Area3' },
			Volume: { key: 'product.volume', text: '*Volume' },
			Volume2: { key: 'product.volume2', text: '*Volume2' },
			Volume3: { key: 'product.volume3', text: '*Volume3' },
			Weight: { key: 'product.weight', text: '*Weight' },
			Weight2: { key: 'product.weight2', text: '*Weight2' },
			Weight3: { key: 'product.weight3', text: '*Weight3' },
			BillingQuantity: { key: 'product.billQuantity', text: '*Bill Quantity' },
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			EngTaskFk: { key: 'entityEngTaskFk', text: '*Task' },
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			propertiesGroup: { key: 'productDescription.propertiesGroup', text: '*Properties' },
			IsolationVolume: { key: 'productDescription.isolationVolume', text: '*Isolation Volume' },
			ConcreteVolume: { key: 'productDescription.concreteVolume', text: '*Concrete Volume' },
			ConcreteQuality: { key: 'productDescription.concreteQuality', text: '*Concrete Quality' },
			MdcProductDescriptionFk: {
				key: 'productDescription.entityMdcProductDescription',
				text: '*Mdc Product Description',
			},
		}),
		...prefixAllTranslationKeys('productionplanning.formulaconfiguration.', {
			PpsFormulaVersionFk: { key: 'ppsParameter.ppsFormulaVersionFk', text: '*Formula Version' },
		}),
		...prefixAllTranslationKeys('productionplanning.strandpattern.', {
			PpsStrandPatternFk: { key: 'entityStrandPattern', text: '*Strand Pattern' },
		}),
		...prefixAllTranslationKeys('productionplanning.producttemplate.', {
			MaterialFk: { key: 'entityMaterialFk', text: '*Material' },
			EngDrawingFk: { key: 'entityEngDrawingFk', text: '*Drawing' },
			StackCode: { key: 'stackCode', text: '*Stack Code' },
			Level: { key: 'level', text: '*Level' },
			SortCode: { key: 'sortCode', text: '*Sort Code' },
			Number4Stack: { key: 'number4Stack', text: '*Number in Stack' },
			Number4Plan: { key: 'number4Plan', text: '*Number in Plan' },
			Guid: { key: 'GUID', text: '*GUID' },
			UserdefinedByMaterial1: { key: 'userdefinedbymaterial1', text: '*Text By Material 1' },
			UserdefinedByMaterial2: { key: 'userdefinedbymaterial2', text: '*Text By Material 2' },
			UserdefinedByMaterial3: { key: 'userdefinedbymaterial3', text: '*Text By Material 3' },
			UserdefinedByMaterial4: { key: 'userdefinedbymaterial4', text: '*Text By Material 4' },
			UserdefinedByMaterial5: { key: 'userdefinedbymaterial5', text: '*Text By Material 5' },
		}),
	},
};
