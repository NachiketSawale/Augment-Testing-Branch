/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { FieldType, createLookup } from '@libs/ui/common';
import { BasicsConfigGenericWizardStepScriptLookupService } from '../services/basics-config-generic-wizard-step-script-lookup.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsConfigGenericWizardStepScriptDataService } from '../services/basics-config-generic-wizard-step-script-data.service';
import { IGenericWizardStepScriptEntity } from './entities/generic-wizard-step-script-entity.interface';

/**
 * The Basics config Generic Wizard Step Script info model
 */
 export const BASICS_CONFIG_GENERIC_WIZARD_STEP_SCRIPT_ENTITY_INFO: EntityInfo = EntityInfo.create<IGenericWizardStepScriptEntity> ({
                grid: {
                    title: {key: 'basics.config.genWizardStepScriptListContainerTitle'}
                },
                form: {
			    title: { key: 'basics.config' + '.genWizardStepScriptDetailContainerTitle' },
			    containerUuid: '0e6ce2d0d1a7450a8787ed86964f86d7',
		        },
                dataService: ctx => ctx.injector.get(BasicsConfigGenericWizardStepScriptDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Config', typeName: 'GenericWizardStepScriptDto'},
                permissionUuid: '25f58b6c3bc5451794724582fcc1eec8',
                layoutConfiguration:  {
                    groups: [
                        {
                            gid: 'basicData',
                            title: {
                                key: 'cloud.common.entityProperties',
                                text: 'Basic Data',
                            },
                            attributes: ['DescriptionInfo', 'GenericWizardScriptTypeFk', 'Remark'],
                        },
                    ],
                    labels: {
                        ...prefixAllTranslationKeys('basics.customize.', {
                            GenericWizardScriptTypeFk: {
                                key: 'genericwizardscripttype',
                            },
        
                        }),
                        ...prefixAllTranslationKeys('cloud.common.', {
                            Remark: {
                                key: 'entityRemark'
                            },
                            CommentInfo: {
                                key: 'entityComment'
                            }
        
                        }),
                    },
                    overloads: {
                        GenericWizardScriptTypeFk: {
                            type: FieldType.Lookup,
                            lookupOptions: createLookup({
                                dataServiceToken: BasicsConfigGenericWizardStepScriptLookupService,
                            })
                        }
                    },
                },    
            });