/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ModelChangeSetDataService } from '../services/model-change-set-data.service';
import { IChangeSetEntity } from './models';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ModelChangeSetBehavior } from '../behavior/model-changeset-behavior.service';

export const ModelChangeSetEntityInfo: EntityInfo = EntityInfo.create<IChangeSetEntity>({
    grid: {
        title: { key: 'model.changeset.modelChangeSetListTitle' },
        behavior: ctx => ctx.injector.get(ModelChangeSetBehavior)
    },
    form: {
        title: { key: 'model.changeset.modelChangeSetDetailTitle' },
        containerUuid: '46f270d1fcce425c85b26dbfc9288b9d',
    },
    idProperty: 'CompoundId',
    dataService: ctx => ctx.injector.get(ModelChangeSetDataService),
    dtoSchemeId: { moduleSubModule: 'Model.ChangeSet', typeName: 'ChangeSetDto' },
    permissionUuid: 'f66eca7800444d81b0acf695ba348d29',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['DescriptionInfo', 'ModelFk', 'ModelCmpFk']
        }, {
            gid: 'optionsGroup',
            attributes: ['CompareModelColumns', 'CompareObjects', 'CompareObjectLocations', 'CompareProperties', 'ExcludeOpenings']
        }, {
            gid: 'resultsGroup',
            attributes: ['ChangeCount', 'status']
        }, {
            gid: 'logGroup',
            attributes: ['LoggingLevel', 'LogFileArchiveDocFk']
        }],
        overloads: {
            DescriptionInfo: {
                readonly: true
            },
            //TODO :DEV-6085: model lookup
            /*  ModelFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                dataServiceName: 'modelProjectModelTreeLookupDataService',
                enableCache: true,
                filter: function (item) {
                    return item.Model ? item.Model.ProjectFk : 0;
                },
                readonly: true
            }),
            ModelCmpFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                dataServiceName: 'modelProjectModelTreeLookupDataService',
                enableCache: true,
                filter: function (item) {
                    return item.ComparedModel ? item.ComparedModel.ProjectFk : 0;
                },
                readonly: true
            }), */
            CompareModelColumns: {
                readonly: true
            },
            CompareObjects: {
                readonly: true
            },
            CompareObjectLocations: {
                readonly: true
            },
            CompareProperties: {
                readonly: true
            },
            ExcludeOpenings: {
                readonly: true
            },
            ChangeCount: {
                readonly: true,
                //TODO
                /* navigator: {
                    moduleName: 'model.change',
                    targetIdProperty: 'ModelFk'
                } */
            },
            //TODO
            /* status: {
                formatterOptions: {
                    appendContent: true,
                    displayMember: 'Status.displayText'
                }
            },
            logginglevel: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                dataServiceName: 'basicsCommonLogLevelLookupDataService',
                enableCache: true,
                readonly: true
            }) */
        },
        labels: {
            ...prefixAllTranslationKeys('model.changeset.', {
                ModelFk: { key: 'model1' },
                ModelCmpFk: { key: 'model2' },
                CompareModelColumns: { key: 'modelColumnsIncluded' },
                CompareObjects: { key: 'objectsIncluded' },
                CompareObjectLocations: { key: 'objLocsIncluded' },
                CompareProperties: { key: 'propertiesIncluded' },
                ExcludeOpenings: { key: 'excludeOpenings' },
                ChangeCount: { key: 'diffCount' },//TODO cloumns not displayed on page 
                state: { key: 'state' },//TODO cloumns not displayed on page 
                LoggingLevel: { key: 'logLevel' },
                LogFileArchiveDocFk: { key: 'storedLog' },
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                DescriptionInfo: { key: 'entityDescription' }
            })
        }
    }
});