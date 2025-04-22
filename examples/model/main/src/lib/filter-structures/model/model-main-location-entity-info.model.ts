/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainLocationDataService } from '../services/model-main-location-data.service';
import { IProjectLocationEntity } from '@libs/project/interfaces';

 export const MODEL_MAIN_LOCATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IProjectLocationEntity> ({
                grid: {
                    title: {key: 'locationContainer'},
                },
                
                dataService: ctx => ctx.injector.get(ModelMainLocationDataService),
                dtoSchemeId: {moduleSubModule: 'Project.Location', typeName: 'LocationDto'},
                permissionUuid: '24c2b0f8d3b146a38f42ad03d4c91b2f',
                    
            });