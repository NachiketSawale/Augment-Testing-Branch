/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsReportingReportParameterBehavior } from '../../behaviors/basics-reporting-report-parameter-behavior.service';
import { BasicsReportingReportParameterDataService } from '../../services/basics-reporting-report-parameter-data.service';
import { IReportParameterEntity } from '../entities/report-parameter-entity.interface';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsReportingSysContextLookupService } from '../../lookup-services/basic-reporting-syscontext-lookup.service';

/**
 * Basics Reporting report parameter Entity Info
 */
export const BASICS_REPORTING_REPORT_PARAMETER_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportParameterEntity> ({
    grid: {
        title: {key: 'basics.reporting.reportParameterContainerTitle'},
        behavior: ctx => ctx.injector.get(BasicsReportingReportParameterBehavior),
    },
    dataService: ctx => ctx.injector.get(BasicsReportingReportParameterDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.Reporting', typeName: 'ReportParameterDto'},
    permissionUuid: 'c846509f1b0345c1b7469e4fd56e11e7',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: ['DescriptionInfo', 'ParameterName', 'DataType', 'SysContext', 'Default', 'IsVisible', 'Sorting'],
            },
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.reporting.', {
                DescriptionInfo: {key: 'description'},
                ParameterName: {key: 'entityParameterName'},
                DataType: {key: 'entityDatatype'},
                SysContext: {key: 'entitySyscontext'},
                Default: {key: 'entityDefault'},
                IsVisible: {key: 'entityIsVisible'},
                Sorting: {key: 'entitySorting'},
            }),
        },
        overloads: {
            Id: { readonly: true },
            ParameterName: { readonly: true },
			DataType: { readonly: true },
            SysContext: {
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsReportingSysContextLookupService,
                }),
            },
        },
    },
});