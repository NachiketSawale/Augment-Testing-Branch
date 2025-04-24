/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsEngineeringCadImportConfigDataService } from '../services/cad-import-config-data.service';
import { CadImportConfigGridBehavior } from '../behaviors/cad-import-config-grid-behavior.service';
import { IEngCadImportConfigEntity } from './entities/cad-import-config-entity.interface';
import {createLookup, FieldType, LookupSimpleEntity, UiCommonLookupDataFactoryService} from '@libs/ui/common';
import {IMORTER_KINDS_TOKEN} from '../constants/ImporterKinds';
import {get} from 'lodash';


export const PPS_ENGINEERING_CAD_IMPORT_CONFIG_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngCadImportConfigEntity>({
    grid: {
        title: { key: 'productionplanning.cadimportconfig.listViewTitle' },
        behavior: ctx => ctx.injector.get(CadImportConfigGridBehavior),
        containerUuid: '66yh4c988b634bf4hfb9bff0d6dfb111',
    },
    form: {
        title: { key: 'productionplanning.cadimportconfig.detailViewTitle' },
        containerUuid: '66yh4c988b634bf4hfb9bff0d6dfb112',
    },
    dataService: ctx => ctx.injector.get(PpsEngineeringCadImportConfigDataService),
    dtoSchemeId: { moduleSubModule: 'ProductionPlanning.CadImportConfig', typeName: 'EngCadImportConfigDto' },
    permissionUuid: '66yh4c988b634bf4hfb9bff0d6dfb111',
    layoutConfiguration: ctx => {
        return {
            groups: [
                {
                    gid: 'basicData',
                    attributes: [
                        'Description', 'EngDrawingTypeFk', 'ImporterKind', 'BaseDirectory', 'MatchPatternType', 'MatchPattern', 'IsLive'
                    ]
                },
                {
                    gid: 'entityHistory',
                    attributes: ['InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version']
                }
            ],
            overloads: {
                EngDrawingTypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('EngDrawingType', {
                            uuid: '253e0c26af594ae993a5d5adf9608e3c',
                            valueMember: 'Id',
                            displayMember: 'DescriptionInfo.Translated'
                        })
                    })
                },
                ImporterKind: {
                    type: FieldType.Select,
                    itemsSource: {
                        items: (function(){
                            return ctx.injector.get(IMORTER_KINDS_TOKEN);
                        })()
                    }
                },
                MatchPatternType: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromSimpleDataProvider('basics.customize.engineeringaccountingruletype', {
                            uuid: '439b42b30d8d44f085b8b534620854ef',
                            valueMember: 'Id',
                            displayMember: 'Description',
                            showClearButton: true
                        }),
                        clientSideFilter: {
                            execute(item: LookupSimpleEntity, context): boolean {
                                const id = get(item, 'Id') as unknown as number;
                                return id === 1 || id === 2;
                            }
                        }
                    })
                },
            }
        };
    }
});