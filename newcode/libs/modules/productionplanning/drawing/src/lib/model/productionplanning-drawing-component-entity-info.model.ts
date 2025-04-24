/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DrawingComponentDataService } from '../services/drawing-component-data.service';
import { DrawingComponentBehavior } from '../behaviors/drawing-component-behavior.service';
import { IEngDrawingComponentEntity } from './entities/eng-drawing-component-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import {
	IPpsAccountingResultLookupEntity,
	IPpsAccountingRuleLookupEntity, ProductionplanningSharedAccountingResultLookupService,
	ProductionplanningSharedAccountingRuleLookupService
} from '@libs/productionplanning/shared';


export const PRODUCTIONPLANNING_DRAWING_COMPONENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingComponentEntity>({
	grid: {
		title: {key: 'productionplanning.drawing' + '.drawingComponent.listTitle'},
		behavior: ctx => ctx.injector.get(DrawingComponentBehavior),
		containerUuid: '5g340a9d7e8b4rg2f76dfdd9d2670856'
	},
	form: {
		title: {key: 'productionplanning.drawing' + '.drawingComponent.detailTitle'},
		containerUuid: '6g340a9d7e8b8r5rf76dfdd9y267u856',
	},
	dataService: ctx => ctx.injector.get(DrawingComponentDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingComponentDto'},
	permissionUuid: '3f27b4813a144aee9aaac9f8cd8651c6',
	layoutConfiguration: {
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
			EngDrwCompTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideEngineeringDrawingComponentTypeReadonlyLookupOverload(),
			EngAccountingRuleFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IEngDrawingComponentEntity, IPpsAccountingRuleLookupEntity>({
					dataServiceToken: ProductionplanningSharedAccountingRuleLookupService,
					displayMember: 'MatchPattern',
				})
			},
			EngAccRulesetResultFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IEngDrawingComponentEntity, IPpsAccountingResultLookupEntity>({
					dataServiceToken: ProductionplanningSharedAccountingResultLookupService,
					displayMember: 'Description',
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				MdcCostCodeFk: {key: 'entityCostCode', text: '*Cost Code'},
				BasUomFk: {key: 'entityUoM', text: '*Uom'},
				Description: {key: 'entityDescription', text: '*Description'},
				IsLive: {key: 'entityIsLive', text: '*Active'},
				EngDrwCompStatusFk: {key: 'entityStatus', text: '*Status'},
				UserDefined1: {
					key: 'entityUserDefined',
					text: 'User Defined 1',
					params: {'p_0': '1'}
				},
				UserDefined2: {
					key: 'entityUserDefined',
					text: 'User-Defined 2',
					params: {'p_0': '2'}
				},
				UserDefined3: {
					key: 'entityUserDefined',
					text: 'User-Defined 3',
					params: {'p_0': '3'}
				},
				UserDefined4: {
					key: 'entityUserDefined',
					text: 'User-Defined 4',
					params: {'p_0': '4'}
				},
				UserDefined5: {
					key: 'entityUserDefined',
					text: 'User-Defined 5',
					params: {'p_0': '5'}
				},
			}),
			...prefixAllTranslationKeys('productionplanning.drawing.', {
				EngAccRulesetResultFk: {key: 'drawingComponent.rulesetResult', text: '*Ruleset Result'},
				EngAccountingRuleFk: {key: 'drawingComponent.rulePattern', text: '*Rule-Pattern'},
				EngDrwCompTypeFk: {key: 'drawingComponent.engDrwCompTypeFk', text: '*Component Type'},
				MdcMaterialCostCodeFk: {key: 'drawingComponent.materialCostCode', text: '*Material/CostCode'},
				Quantity2: {key: 'drawingComponent.quantity2', text: '*Quantity2'},
				Quantity3: {key: 'drawingComponent.quantity3', text: '*Quantity3'},
				Uom2Fk: {key: 'drawingComponent.uom2', text: '*Uom2'},
				Uom3Fk: {key: 'drawingComponent.uom3', text: '*Uom3'},
				Isimported: {key: 'drawingComponent.isImported', text: '*Is Imported'},
			}),
			MdcMaterialFk: {key: 'basics.material.record.material', text: '*Material'},
		}
	}

});