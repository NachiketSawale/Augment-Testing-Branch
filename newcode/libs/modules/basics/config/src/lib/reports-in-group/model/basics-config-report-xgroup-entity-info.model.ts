/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { FieldType, ILayoutConfiguration, createLookup } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

import { BasicsConfigReportXGroupLookupService } from '../services/lookup/basics-config-report-xgroup-lookup.service';
import { BasicsConfigReportXGroupDataService } from '../services/basics-config-report-xgroup-data.service';
import { BasicsConfigReportXGroupBehavior } from '../behaviors/basics-config-report-xgroup-behavior.service';

import { IReport2GroupEntity } from './entities/report-2group-entity.interface';
import { IReportXGroupLookupEntity } from './entities/report-xgroup-lookup-entity.interface';


export const BASICS_CONFIG_REPORT_XGROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IReport2GroupEntity>({
    grid: {
        title: { key: 'basics.config.reportXGroupContainerTitle' },
        behavior: ctx => ctx.injector.get(BasicsConfigReportXGroupBehavior),
    },
    form: {
        title: { key: 'basics.config.reportXGroupDetailsContainerTitle' },
        containerUuid: '6b04f026611b40078bef18da9109938b',
    },

    dataService: ctx => ctx.injector.get(BasicsConfigReportXGroupDataService),
    dtoSchemeId: { moduleSubModule: 'Basics.Config', typeName: 'Report2GroupDto' },
    permissionUuid: '85481d36739a495289e0e4a824d23e88',
    layoutConfiguration: (ctx) => {
        return <ILayoutConfiguration<IReport2GroupEntity>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        key: 'cloud.common.entityProperties',
                        text: 'Basic Data',
                    },
                    attributes: ['ReportFk', 'Sorting', 'IsVisible', 'AccessRightDescriptorFk', 'Visibility'],
                },
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.config.', {
                    ReportFk: {
                        key: 'entityReportFK',
                    },
                    Sorting: {
                        key: 'tabSorting',
                    },
                    IsVisible: {
                        key: 'entityIsVisible',
                    },
                    AccessRightDescriptorFk: {
                        key: 'descriptor',
                    },
                    Visibility: {
                        key: 'dashboardvisibility',
                    }
                }),
            },
            overloads: {
                AccessRightDescriptorFk: {
                    readonly: true,
                },
                Visibility: {
                    grid: {
                        type: FieldType.Select,
                        itemsSource: {
                            items: [
                                {
                                    id: 1,
                                    displayName: {
                                        text: '',
                                        key: 'basics.config.visibilityProperty.standardOnly',
                                    },
                                },
                                {
                                    id: 2,
                                    displayName: {
                                        text: '',
                                        key: 'basics.config.visibilityProperty.portalOnly',
                                    },
                                },
                                {
                                    id: 3,
                                    displayName: {
                                        text: '',
                                        key: 'basics.config.visibilityProperty.standardPortal',
                                    },
                                },
                            ],
                        },
                    }
                },
                ReportFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup<IReport2GroupEntity, IReportXGroupLookupEntity>({
                        dataServiceToken: BasicsConfigReportXGroupLookupService,
                        showDescription: true,
                        descriptionMember: 'Name.Translated',
                        showClearButton: true
                    })

                }
            },
        };
    },
});