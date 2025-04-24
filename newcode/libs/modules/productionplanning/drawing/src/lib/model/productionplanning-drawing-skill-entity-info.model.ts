/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DrawingSkillDataService } from '../services/drawing-skill-data.service';
import { DrawingSkillBehavior } from '../behaviors/drawing-skill-behavior.service';
import { IEngDrawingSkillEntity } from './entities/eng-drawing-skill-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { ResourceSkillLookupService } from '@libs/resource/shared';

export const PRODUCTIONPLANNING_DRAWING_SKILL_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrawingSkillEntity>({
	grid: {
		title: { key: 'productionplanning.drawing' + '.skill.listTitle' },
		behavior: (ctx) => ctx.injector.get(DrawingSkillBehavior),
		containerUuid: '6ab72263fd7d49b98ca55ecdaf21e3fd',
	},
	form: {
		title: { key: 'productionplanning.drawing' + '.skill.detailTitle' },
		containerUuid: '55031220d38b4abd858c2301acebbace',
	},
	dataService: (ctx) => ctx.injector.get(DrawingSkillDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngDrawingSkillDto' },
	permissionUuid: '6ab72263fd7d49b98ca55ecdaf21e3fd',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['ResSkillFk', 'CommentText'],
			},
		],
		overloads: {
			ResSkillFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ResourceSkillLookupService,
					showClearButton: true,
				}),
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityCommentText', text: '*Comment' },
			}),
			...prefixAllTranslationKeys('productionplanning.drawing.', {
				ResSkillFk: { key: 'skill.resSkillFk', text: '*Skill' },
			}),
		},
	},
});
