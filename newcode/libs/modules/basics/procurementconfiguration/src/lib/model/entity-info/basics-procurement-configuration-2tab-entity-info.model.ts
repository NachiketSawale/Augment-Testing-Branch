/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { FieldType } from '@libs/ui/common';
import { BasicsProcurementConfig2TabDataService } from '../../services/basics-procurement-config-2tab-data.service';
import { BasicsProcurementConfigModuleDataService } from '../../services/basics-procurement-config-module-data.service';
import { BasicsProcurementConfiguration2TabLayoutService } from '../../services/layouts/basics-procurement-configuration-2tab-layout.service';
import { IPrcConfiguration2TabEntity } from '../entities/prc-configuration-2-tab-entity.interface';
import { IModuleEntity } from '../entities/module-entity.interface';

export const BASICS_PROCUREMENT_CONFIGURATION_2TAB_ENTITY_INFO = EntityInfo.create<IPrcConfiguration2TabEntity>({
    grid: {
        title: {
            text: '',
            key: 'basics.procurementconfiguration.tabGridTitle'
        },
        containerType: SplitGridContainerComponent,
        providers: ctx => [
            {
                provide: SplitGridConfigurationToken,
                useValue: <ISplitGridConfiguration<IPrcConfiguration2TabEntity, IModuleEntity>>{
                    parent: {
                        uuid: '8c4efb2026264965b5ddac17af4d9344',
                        columns: [
                            {
                                id: 'description',
                                model: 'DescriptionInfo',
                                type: FieldType.Translation,
                                label: {
                                    text: 'Description',
                                    key: 'cloud.common.entityDescription'
                                },
                                sortable: true,
                                visible: true,
                                readonly: true,
                                formatterOptions: {
                                    field: 'DescriptionInfo.Translated'
                                }
                            }
                        ],
                        dataServiceToken: BasicsProcurementConfigModuleDataService
                    }
                }
            }
        ]
    },
    permissionUuid: '5f7e832f7fad4a5fbbb29340f8b7a22e',
    dataService: ctx => ctx.injector.get(BasicsProcurementConfig2TabDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfiguration2TabDto'},
    layoutConfiguration: context => {
        return context.injector.get(BasicsProcurementConfiguration2TabLayoutService).generateLayout();
    }
});