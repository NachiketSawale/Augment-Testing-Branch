/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainControllingDataService } from '../services/model-main-controlling-data.service';
import { IControllingUnitEntity } from '@libs/basics/shared';

 export const MODEL_MAIN_CONTROLLING_ENTITY_INFO: EntityInfo = EntityInfo.create<IControllingUnitEntity> ({
                grid: {
                    title: {key: 'controllingContainer'},
                },
                
                dataService: ctx => ctx.injector.get(ModelMainControllingDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Main', typeName: ''},
                permissionUuid: '36d21eb2c11b452cac50a62451dfc0ac',
                    
            });