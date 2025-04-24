/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { DrawingRevisionDataService } from '../services/drawing-revision-data.service';
import { DrawingRevisionBehavior } from '../behaviors/drawing-revision-behavior.service';
import { IEngDrwRevisionEntity } from './entities/eng-drw-revision-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';

export const PRODUCTIONPLANNING_DRAWING_REVISION_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngDrwRevisionEntity>({
	grid: {
		title: { key: 'productionplanning.drawing' + '.drwRevisionListTitle' },
		behavior: (ctx) => ctx.injector.get(DrawingRevisionBehavior),
		containerUuid: '7c0fdef1f8c4447abe524ee7130e7d6e',
	},
	dataService: (ctx) => ctx.injector.get(DrawingRevisionDataService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.Drawing', typeName: 'EngTmplRevisionDto' },
	permissionUuid: '231c11dda4004fed84984b86488089be',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Description', 'CommentText', 'Revision'],
			},
		],
		overloads: {
			Description: { readonly: true },
			CommentText: { readonly: true },
			Revision: { readonly: true },
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: { key: 'entityCommentText', text: '*Comment' },
				Description: { key: 'entityDescription', text: '*Description' },
			}),
			...prefixAllTranslationKeys('productionplanning.common.', {
				Revision: { key: 'document.revision.revision', text: '*Revision' },
			}),
		},
	},
});
