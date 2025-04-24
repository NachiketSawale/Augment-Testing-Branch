/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DrawingStackDataService } from '../services/drawing-stack-data.service';
import { DrawingStackBehavior } from '../behaviors/drawing-stack-behavior.service';
import { IEngStackEntity } from './entities/eng-stack-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const PRODUCTIONPLANNING_DRAWING_STACK_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngStackEntity>({
	grid: {
		title: { key: 'productionplanning.drawing' + '.stackListTitle' },
		behavior: (ctx) => ctx.injector.get(DrawingStackBehavior),
		containerUuid: '2a74717f7e774c1f8817ed70c7d7f490',
	},
	form: {
		title: { key: 'productionplanning.drawing' + '.stackDetailsTitle' },
		containerUuid: '9df6588657114a41bd800e4c6a04bf5c',
	},
	dataService: (ctx) => ctx.injector.get(DrawingStackDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngStackDto' },
	permissionUuid: '231c11dda4004fed84984b86488089be',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'Description', 'Height', 'IsLive', 'Length', 'ResTypeFk', 'Type', 'UomHeightFk', 'UomLengthFk', 'UomWeightFk', 'UomWidthFk', 'Weight', 'Width'],
			},
		],
		overloads: {
			UomHeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			UomLengthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			UomWeightFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			UomWidthFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
			ResTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideResourceTypeLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode', text: '*Code' },
				Description: { key: 'entityDescription', text: '*Description' },
				IsLive: { key: 'entityIsLive', text: '*Active' },
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				Height: { key: 'product.height', text: '*Height' },
				Length: { key: 'product.length', text: '*Length' },
				UomHeightFk: { key: 'product.heightUoM', text: '*Height UoM' },
				UomLengthFk: { key: 'product.lengthUoM', text: '*Length UoM' },
				UomWeightFk: { key: 'product.weightUoM', text: '*Weight UoM' },
				UomWidthFk: { key: 'product.widthUoM', text: '*Width UoM' },
				Weight: { key: 'product.weight', text: '*Weight' },
				Width: { key: 'product.width', text: '*Width' },
			}),
			...prefixAllTranslationKeys('productionplanning.drawing.', {
				Type: { key: 'type', text: '*Type' },
			}),
			ResTypeFk: { key: 'resource.type.entityResourceType', text: 'Resource Type' },
		},
	},
});
