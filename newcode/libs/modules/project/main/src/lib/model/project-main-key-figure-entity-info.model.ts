/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IKeyFigureEntity } from '@libs/project/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ProjectMainKeyFigureDataService } from '../services/project-main-key-figure-data.service';


 export const PROJECT_MAIN_KEY_FIGURE_ENTITY_INFO: EntityInfo = EntityInfo.create<IKeyFigureEntity> ({
                grid: {
                    title: {key: 'project.main' + '.entityKeyFigureList'},
                },

	             dataService: ctx => ctx.injector.get(ProjectMainKeyFigureDataService),
                dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'KeyFigureDto'},
                permissionUuid: 'e755a4d373c44fb7a19339d238685dac',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: [/*'KeyFigureFk',*/ 'KeyFigureValue'],
						 }
					 ],
					 overloads: {
					 },
					 labels: {
						 ...prefixAllTranslationKeys('project.main.', {
							 KeyFigureValue: {key: 'entityKeyFigureValue'},
							/* KeyFigureFk: {key: 'entityKeyFigure'},*/
						 })
					 }
				 }

            });