/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DrawingDataService } from '../services/drawing-data.service';
import { DrawingBehavior } from '../behaviors/drawing-behavior.service';
import { createLookup, FieldType } from '@libs/ui/common';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { BasicsSharedClerkLookupService, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IEngDrawingEntity } from './entities/eng-drawing-entity.interface';
import { PpsSharedDrawingDialogLookupService } from '@libs/productionplanning/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PRODUCTIONPLANNING_DRAWING_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingEntity>({
	grid: {
		title: { key: 'productionplanning.drawing' + '.drawingListTitle' },
		behavior: (ctx) => ctx.injector.get(DrawingBehavior),
		containerUuid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
	},
	form: {
		title: { key: 'productionplanning.drawing' + '.drawingDetailTitle' },
		containerUuid: 'b43f4d685979413e9ca350b38ced33af',
	},
	dataService: (ctx) => ctx.injector.get(DrawingDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingDto' },
	permissionUuid: '231c11dda4004fed84984b86488089be',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'Description', 'EngDrawingFk', 'EngDrawingStatusFk', 'EngDrawingTypeFk', 'IsFullyAccounted', 'IsLive', 'LgmJobFk', 'PpsItemFk', 'PrjProjectFk'],
			},
			{
				gid: 'PlanningInformation',
				attributes: ['BasClerkFk'],
			},
			{
				gid: 'Assignment',
				attributes: ['PrjLocationFk', 'MdcControllingunitFk'],
			},
			{
				gid: 'UserDefined',
				attributes: ['Remark', 'UserDefined1', 'UserDefined10', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'UserDefined6', 'UserDefined7', 'UserDefined8', 'UserDefined9'],
			},
		],
		overloads: {
			BasClerkFk: {
				type: FieldType.Lookup,
				readonly: true,
				lookupOptions: createLookup<IEngDrawingEntity, IBasicsClerkEntity>({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
				}),
			},
			EngDrawingStatusFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingStatusReadonlyLookupOverload(),
			EngDrawingTypeFk: BasicsSharedLookupOverloadProvider.provideEngineeringDrawingTypeLookupOverload(true),
			EngDrawingFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: PpsSharedDrawingDialogLookupService,
					showClearButton: false,
				}),
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: { key: 'entityCode', text: '*Code' },
				Description: { key: 'entityDescription', text: '*Description' },
				IsLive: { key: 'entityIsLive', text: '*Active' },
				EngDrawingStatusFk: { key: 'entityStatus', text: '*Status' },
				PrjProjectFk: { key: 'entityProject', text: '*Project' },
				UserDefined1: {
					key: 'entityUserDefined',
					text: 'User Defined 1',
					params: { p_0: '1' },
				},
				UserDefined2: {
					key: 'entityUserDefined',
					text: 'User-Defined 2',
					params: { p_0: '2' },
				},
				UserDefined3: {
					key: 'entityUserDefined',
					text: 'User-Defined 3',
					params: { p_0: '3' },
				},
				UserDefined4: {
					key: 'entityUserDefined',
					text: 'User-Defined 4',
					params: { p_0: '4' },
				},
				UserDefined5: {
					key: 'entityUserDefined',
					text: 'User-Defined 5',
					params: { p_0: '5' },
				},
				UserDefined6: {
					key: 'entityUserDefined',
					text: 'User Defined 6',
					params: { p_0: '6' },
				},
				UserDefined7: {
					key: 'entityUserDefined',
					text: 'User-Defined 7',
					params: { p_0: '7' },
				},
				UserDefined8: {
					key: 'entityUserDefined',
					text: 'User-Defined 8',
					params: { p_0: '8' },
				},
				UserDefined9: {
					key: 'entityUserDefined',
					text: 'User-Defined 9',
					params: { p_0: '9' },
				},
				UserDefined10: {
					key: 'entityUserDefined',
					text: 'User-Defined 10',
					params: { p_0: '10' },
				},
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				EngDrawingFk: { key: 'header.masterDrawingFk', text: '*Master Drawing' },
				PpsItemFk: { key: 'event.itemFk', text: 'PPS Item' },
				MdcControllingunitFk: { key: 'mdcControllingUnitFk', text: '*Controlling Unit' },
				PrjLocationFk: { key: 'prjLocationFk', text: '*Location' },
			}),
			...prefixAllTranslationKeys('productionplanning.drawing.', {
				EngDrawingTypeFk: { key: 'engDrawingTypeFk', text: '*Drawing Type' },
				IsFullyAccounted: { key: 'isFullyAccounted', text: '*Is Fully Accounted' },
				BasClerkFk: { key: 'responsibleClerk', text: '*Responsible Clerk' },
			}),
			LgmJobFk: { key: 'project.costcodes.lgmJobFk', text: '*Logistic Job' },
		},
	},
});
