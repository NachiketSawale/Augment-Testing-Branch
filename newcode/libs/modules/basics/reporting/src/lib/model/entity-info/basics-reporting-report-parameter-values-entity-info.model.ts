/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IReportParameterValuesEntity } from '../entities/report-parameter-values-entity.interface';
import { BasicsReportingReportParameterValuesDataService } from '../../services/basics-reporting-report-parameter-values-data.service';

/**
 * Basics Reporting report parameter values Entity Info
 */
export const BASICS_REPORTING_REPORT_PARAMETER_VALUES_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportParameterValuesEntity> ({
    grid: {
        title: {key: 'basics.reporting.reportParameterValuesContainerTitle'},
    },
    
    dataService: ctx => ctx.injector.get(BasicsReportingReportParameterValuesDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.Reporting', typeName: 'ReportParameterValuesDto'},
    permissionUuid: 'eecedd9408434f51a6e99460453da724',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: ['DescriptionInfo', 'Value', 'Sorting'],
            },
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.reporting.', {
                DescriptionInfo: {key: 'description'},
                Value: {key: 'entityParameterValue'},
                Sorting: {key: 'entitySorting'},
            }),
        }
    },
});