/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { PpsEngineeringCadValidationBehavior } from '../behaviors/pps-engineering-cad-validation-behavior.service';
import { PpsEngineeringCadValidationDataService } from '../services/pps-engineering-cad-validation-data.service';
import { IEngCadValidationEntity } from './models';
import { FieldType, UiCommonLookupDataFactoryService, createLookup } from '@libs/ui/common';
import { ICadImportValidationRuleEntity } from './entities/cad-imiport-validation-rule-entity.interface';
import { ICadImportMessageLevelEntity } from './entities/cad-imiport-message-level-entity.interface';


 export const PPS_ENGINEERING_CAD_VALIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IEngCadValidationEntity> ({
                grid: {
                    title: {key: 'productionplanning.cadimportconfig' + '.validation.listViewTitle'},
                    behavior: ctx => ctx.injector.get(PpsEngineeringCadValidationBehavior),
                    containerUuid: '77yh4c988b634bf4hfb9bff0d6dfb112',
                },
                
                dataService: ctx => ctx.injector.get(PpsEngineeringCadValidationDataService),
                dtoSchemeId: {moduleSubModule: 'ProductionPlanning.CadImportConfig', typeName: 'EngCadValidationDto'},
                permissionUuid: '66yh4c988b634bf4hfb9bff0d6dfb111',
                layoutConfiguration: ctx => {
                    return {
                        groups: [
                            {
                                gid: 'basicData',
                                attributes: [
                                    'RuleId', 'MessageLevel'
                                ]
                            },
                            {
                                gid: 'entityHistory',
                                attributes: ['InsertedAt', 'InsertedBy', 'UpdatedAt', 'UpdatedBy', 'Version']
                            }
                        ],
                        overloads: {
                            RuleId: {
                                type: FieldType.Lookup,
                                lookupOptions: createLookup({
                                    dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('CadImportValidationRule', {
                                        uuid: 'a080fe7ce1634fa692e545caa9b5e69c',
                                        valueMember: 'Id',
                                        displayMember: 'Description',
                                        imageSelector: { // TODO: Use the global status icon formatter/selector instead.
                                            select(item: ICadImportValidationRuleEntity): string {
                                                return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
                                            },
                                            getIconType() {
                                                return 'css';
                                            }
                                        }
                                    })
                                })
                            },
                            MessageLevel: {
                                type: FieldType.Lookup,
                                lookupOptions: createLookup({
                                    dataService: ctx.injector.get(UiCommonLookupDataFactoryService).fromLookupType('CadImportMessageLevel', {
                                        uuid: '0f87da44232e47a19465e38f4a06dd7e',
                                        valueMember: 'Id',
                                        displayMember: 'Description',
                                        imageSelector: { // TODO: Use the global status icon formatter/selector instead.
                                            select(item: ICadImportMessageLevelEntity): string {
                                                return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
                                            },
                                            getIconType() {
                                                return 'css';
                                            }
                                        }
                                    })
                                })
                            }
                        }
                    };
                }
            });