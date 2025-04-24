import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEngDrawingComponentEntityGenerated } from './eng-drawing-component-entity-generated.interface';


export const EngDrawingComponentSharedLayout: ILayoutConfiguration<IEngDrawingComponentEntityGenerated> = {
	groups: [
		{
			gid: 'basicData',
			attributes: ['Description', 'EngDrwCompStatusFk', 'EngDrwCompTypeFk', 'IsLive', 'MdcMaterialCostCodeFk', 'Remark', 'Sorting']
		},
		{
			gid: 'Quantities',
			attributes: ['BasUomFk', 'Quantity', 'Quantity2', 'Quantity3', 'Uom2Fk', 'Uom3Fk']
		},
		{
			gid: 'RuleInformation',
			attributes: ['EngAccRulesetResultFk', 'EngAccountingRuleFk', 'Isimported']
		},
		{
			gid: 'UserDefined',
			attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']
		}],
	overloads: {
		BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
		Uom2Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
		Uom3Fk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
		EngDrwCompStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringDrawingComponentStatusReadonlyLookupOverload(),
		EngDrwCompTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringDrawingComponentTypeReadonlyLookupOverload()
	},
	labels: {
		...prefixAllTranslationKeys('cloud.common.', {
			MdcCostCodeFk: { key: 'entityCostCode', text: '*Cost Code' },
			BasUomFk: { key: 'entityUoM', text: '*Uom' },
			Description: { key: 'entityDescription', text: '*Description' },
			IsLive: { key: 'entityIsLive', text: '*Active' },
			EngDrwCompStatusFk: { key: 'entityStatus', text: '*Status' },
			Quantity: { key: 'entityQuantity', text: '*Quantity' },
			UserDefined1: {
				key: 'entityUserDefined',
				text: 'User Defined 1',
				params: { 'p_0': '1' }
			},
			UserDefined2: {
				key: 'entityUserDefined',
				text: 'User-Defined 2',
				params: { 'p_0': '2' }
			},
			UserDefined3: {
				key: 'entityUserDefined',
				text: 'User-Defined 3',
				params: { 'p_0': '3' }
			},
			UserDefined4: {
				key: 'entityUserDefined',
				text: 'User-Defined 4',
				params: { 'p_0': '4' }
			},
			UserDefined5: {
				key: 'entityUserDefined',
				text: 'User-Defined 5',
				params: { 'p_0': '5' }
			},
		}),
		...prefixAllTranslationKeys('productionplanning.drawing.', {
			EngAccRulesetResultFk: { key: 'drawingComponent.rulesetResult', text: '*Ruleset Result' },
			EngAccountingRuleFk: { key: 'drawingComponent.rulePattern', text: '*Rule-Pattern' },
			EngDrwCompTypeFk: { key: 'drawingComponent.engDrwCompTypeFk', text: '*Component Type' },
			MdcMaterialCostCodeFk: { key: 'drawingComponent.materialCostCode', text: '*Material/CostCode' },
			Quantity2: { key: 'drawingComponent.quantity2', text: '*Quantity2' },
			Quantity3: { key: 'drawingComponent.quantity3', text: '*Quantity3' },
			Uom2Fk: { key: 'drawingComponent.uom2', text: '*Uom2' },
			Uom3Fk: { key: 'drawingComponent.uom3', text: '*Uom3' },
			Isimported: { key: 'drawingComponent.isImported', text: '*Is Imported' },
		}),
		MdcMaterialFk: { key: 'basics.material.record.material', text: '*Material' },
	}
};