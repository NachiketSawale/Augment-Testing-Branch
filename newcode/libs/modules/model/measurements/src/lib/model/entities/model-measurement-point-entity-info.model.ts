/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IModelMeasurementPointEntity } from './model-measurement-point-entity.interface';
import { ModelMeasurementPointBehavior } from '../../behaviors/model-measurement-point-behavior.service';
import { ModelMeasurementPointDataService } from '../../services/model-measurement-point-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';

 export const ModelMeasurementPointEntityInfo: EntityInfo = EntityInfo.create<IModelMeasurementPointEntity> ({
                grid: {
                    title: {key: 'model.measurements.modelMeasurementPointListTitle'},
						  behavior: ctx => ctx.injector.get(ModelMeasurementPointBehavior),
                },
                form: {
			           title: { key: 'model.measurements.modelMeasurementPointDetailTitle' },
	                 containerUuid: '4c7ea712d06a42feae5926d17446986c',
		          },
                dataService: ctx => ctx.injector.get(ModelMeasurementPointDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Measurements', typeName: 'ModelMeasurementPointDto'},
                permissionUuid: '8c8f48d17387402694b8359bef7bde6d',
	             layoutConfiguration: {
		             groups: [{
			             gid: 'baseGroup',
			             attributes: ['DescriptionInfo', 'Sorting', 'PosX', 'PosY', 'PosZ']
		             }],
		             labels: {
			             ...prefixAllTranslationKeys('model.measurements.', {
				             Sorting: {key: 'sorting'},
				             PosX: {key: 'posx'},
				             PosY: {key: 'posy'},
				             PosZ: {key: 'posz'}
			             }),
			             ...prefixAllTranslationKeys('cloud.common.', {
				             DescriptionInfo: {key: 'entityDescription'}
			             })
		             }
	             }
            });