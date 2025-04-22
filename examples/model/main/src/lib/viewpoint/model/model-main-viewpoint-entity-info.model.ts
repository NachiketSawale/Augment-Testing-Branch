/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelMainViewpointDataService } from '../services/model-main-viewpoint-data.service';
import { IViewpointEntity } from '../../model/models';
import { ILayoutConfiguration } from '@libs/ui/common';

 export const MODEL_MAIN_VIEWPOINT_ENTITY_INFO: EntityInfo = EntityInfo.create<IViewpointEntity> ({
                grid: {
                    title: {key: 'viewpointList'},
                },
                form: {
			    title: { key: 'model.main.viewpointDetails' },
			    containerUuid: '10b630738b584731a275fa5dbdf225a3',
		        },
                dataService: ctx => ctx.injector.get(ModelMainViewpointDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Main', typeName: 'ViewpointDto'},
                permissionUuid: '17c46d111cd44732827332315ea206ed',
                  layoutConfiguration: async ctx => {
                        return <ILayoutConfiguration<IViewpointEntity>>{
                            groups: [
                                {
                                    gid: 'baseGroup',
                                    attributes: ['Code', 'Description', 'ShowInViewer', 'Scope', 'ModelFk', 'ViewpointTypeFk', 'IsImportant']
                                },
                            ],
                        };
                    }
                    
            });