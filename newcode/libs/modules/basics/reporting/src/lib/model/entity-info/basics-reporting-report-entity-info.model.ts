/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsReportingReportDataService } from '../../services/basics-reporting-report-data.service';
import { BasicsReportingReportBehavior } from '../../behaviors/basics-reporting-report-behavior.service';
import { IReportEntity } from '../entities/report-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Basics Reporting report Entity Info
 */
export const BASICS_REPORTING_REPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IReportEntity> ({
    grid: {
        title: {key: 'basics.reporting.reportContainerTitle'},
        behavior: ctx => ctx.injector.get(BasicsReportingReportBehavior),
    },
    form: {
        title: { key: 'basics.reporting' + '.reportDetailsContainerTitle' },
        containerUuid: 'A181C99848134B7BAD86A51E84924F90',
    },
    dataService: ctx => ctx.injector.get(BasicsReportingReportDataService),
    dtoSchemeId: {moduleSubModule: 'Basics.Reporting', typeName: 'ReportDto'},
    permissionUuid: '43fb6571d246461c9a079c1742085285',
    layoutConfiguration: {
        groups: [
            {
                gid: 'basicData',
                title: {
                    key: 'cloud.common.entityProperties',
                    text: 'Basic Data',
                },
                attributes: ['Name', 'Description', 'FileName', 'FilePath', 'StoreInDocuments', 'DocumentCategoryFk', 'DocumentTypeFk', 'RubricCategoryFk'],
            },
        ],
        labels: {
            ...prefixAllTranslationKeys('basics.reporting.', {
                Name: {key: 'name'},
                Description: {key: 'description'},
                FileName: {key: 'reportFileName'},
                FilePath: {key: 'reportFilePath'},
                StoreInDocuments: {key: 'storeindocuments'},
                DocumentCategoryFk: {key: 'documentcategory'},
                DocumentTypeFk: {key: 'documenttype'},
                RubricCategoryFk: {key: 'rubriccategory'},
            }),
        },
        overloads: {
            Id: { readonly: true },
			FileName: { readonly: true },
			FilePath: { readonly: true },
            RubricCategoryFk:BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
            DocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectDocumentTypeLookupOverload(true),
            DocumentCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectDocumentCategoryLookupOverload(true),
        },
    },
});