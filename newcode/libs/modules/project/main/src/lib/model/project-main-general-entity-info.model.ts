/*
* $Id$
* Copyright(c) RIB Software GmbH
*/

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IGeneralEntity } from '@libs/project/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { ProjectMainGeneralDataService } from '../services/project-main-general-data.service';


export const PROJECT_MAIN_GENERAL_ENTITY_INFO: EntityInfo = EntityInfo.create<IGeneralEntity>({
	grid: {
		title: {key: 'project.main' + '.entityGeneralList'},
	},
	form: {
		title: {key: 'project.main' + '.entityGeneralDetail'},
		containerUuid: '82366961458345aa8113ed3c2fcddc1d',
	},
	dataService: ctx => ctx.injector.get(ProjectMainGeneralDataService),
	dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'GeneralDto'},
	permissionUuid: '8d00d49507ea490f8f256518e84a98e8',
	entityFacadeId: 'a459af22905b41a29b8d544cc66d373c',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: [/*'GeneralstypeFk',*/ 'Value', 'CommentText'],
			}
		],
		overloads: {},
		labels: {
			...prefixAllTranslationKeys('project.main.', {
				Value: {key: 'entityValue'},
				CommentText: {key: 'entityCommentText'},
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				ValueType: {key: 'valuetype'},
			}),
		}
	}

});