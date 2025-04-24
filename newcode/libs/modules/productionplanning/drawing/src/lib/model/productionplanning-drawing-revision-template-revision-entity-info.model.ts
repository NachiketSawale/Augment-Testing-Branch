/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEngTmplRevisionEntity } from './entities/eng-tmpl-revision-entity.interface';
import { DrawingRevisionTemplateRevisionDataService } from '../services/drawing-revision-template-revision-data.service';

export const PRODUCTIONPLANNING_DRAWING_REVISION_TEMPLATE_REVISION_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngTmplRevisionEntity>({
	grid: {
		title: { key: 'productionplanning.drawing.drwRevision.tmplRevisionListTitle' },
		containerUuid: '8b1e1f1f6beb4b5790cc64a52fe07862',
	},
	dataService: (ctx) => ctx.injector.get(DrawingRevisionTemplateRevisionDataService),
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
