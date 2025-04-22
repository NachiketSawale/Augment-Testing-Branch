/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelChangeDataService } from '../services/model-change-data.service';
import { IChangeEntity } from './models';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import { MODEL_LOOKUP_PROVIDER_TOKEN, PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


 export const MODEL_CHANGE_ENTITY_INFO: EntityInfo = EntityInfo.create<IChangeEntity> ({
                grid: {
                    title: {key: 'model.change.modelChangeListTitle'}
                },
                idProperty: 'CompoundId',
                form: {
			    title: { key: 'model.change.modelChangeDetailTitle' },
			    containerUuid: '37b54001f96f479ab3babd481b500d2b',
		        },
                dataService: ctx => ctx.injector.get(ModelChangeDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Change', typeName: 'ChangeDto'},
                permissionUuid: '35f7e04a283b44a9b726be260b886ea1',
                layoutConfiguration: async ctx => {
                    const mlp = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
                    const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);
                    
                    return <ILayoutConfiguration<IChangeEntity>>{
                        groups: [
                            {
                                gid: 'baseGroup',
                                attributes: ['ChangeTypeFk', 'ModelFk', 'ModelCmpFk', 'ObjectFk', 'CpiId', 'ObjectCmpFk', 'CmpCpiId', 'PropertyKeyFk', 'Value', 'Valuecmp', 'LocationFk', 'IsChangeOrder']
                            }
                        ],
                        overloads: {
                            ChangeTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideChangeTypeLookupOverload(true),
                            ModelFk: mlp.generateModelLookup(),
                            /*modelcmpfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                                dataServiceName: 'modelProjectModelTreeLookupDataService',
                                enableCache: true,
                                filter: function (item) {
                                    return item.ProjectCmpId;
                                },
                                readonly: true
                            }),
                            objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                                dataServiceName: 'modelMainObjectLookupDataService',
                                enableCache: true,
                                filter: function (item) {
                                    return item.ModelFk;
                                },
                                additionalColumns: true,
                                readonly: true
                            }), */
                            CpiId: {
                                readonly: true
                            },
                        /*  ObjectCmpFk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                                dataServiceName: 'modelMainObjectLookupDataService',
                                enableCache: true,
                                filter: function (item) {
                                    return item.ModelCmpFk;
                                },
                                additionalColumns: true,
                                readonly: true
                            }), */
                            CmpCpiId:{
                                readonly: true
                            },
                            PropertyKeyFk: pkLookupProvider.generatePropertyKeyLookup(),
                            /* value: {
                                formatter: 'dynamic',
                                editor: 'dynamic',
                                readonly: true,
                                domain: function (item) {
                                    let domain;
        
                                    if (item && item.PropertyDto) {
                                        switch (item.PropertyDto.ValueType) {
                                            case 1:
                                                domain = 'remark';
                                                item.Value = item.PropertyDto.PropertyValueText;
                                                break;
        
                                            case 2:
                                                domain = 'decimal';
                                                item.Value = item.PropertyDto.PropertyValueNumber;
                                                break;
        
                                            case 3:
                                                domain = 'integer';
                                                item.Value = item.PropertyDto.PropertyValueLong;
                                                break;
        
                                            case 4:
                                                domain = 'boolean';
                                                item.Value = item.PropertyDto.PropertyValueBool;
                                                break;
        
                                            case 5:
                                                domain = 'dateutc';
                                                item.Value = item.PropertyDto.PropertyValueDate;
                                                break;
        
                                            default:
                                                item.Value = null;
                                        }
                                    }
        
                                    return domain || 'description';
                                }
                            }, 
                            valuecmp: {
                                formatter: 'dynamic',
                                editor: 'dynamic',
                                readonly: true,
                                domain: function (item) {
                                    let domain;
        
                                    if (item && item.PropertyCmpDto) {
                                        switch (item.PropertyCmpDto.ValueType) {
                                            case 1:
                                                domain = 'remark';
                                                item.ValueCmp = item.PropertyCmpDto.PropertyValueText;
                                                break;
        
                                            case 2:
                                                domain = 'decimal';
                                                item.ValueCmp = item.PropertyCmpDto.PropertyValueNumber;
                                                break;
        
                                            case 3:
                                                domain = 'integer';
                                                item.ValueCmp = item.PropertyCmpDto.PropertyValueLong;
                                                break;
        
                                            case 4:
                                                domain = 'boolean';
                                                item.ValueCmp = item.PropertyCmpDto.PropertyValueBool;
                                                break;
        
                                            case 5:
                                                domain = 'dateutc';
                                                item.ValueCmp = item.PropertyCmpDto.PropertyValueDate;
                                                break;
        
                                            default:
                                                item.ValueCmp = null;
                                        }
                                    }
        
                                    return domain || 'description';
                                }
                            },*/
                            /*LocationFk:  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                                dataServiceName: 'projectLocationLookupDataService',
                                filter: function (item) {
                                    switch (item.ChangeTypeFk) {
                                        case 32: // location only in model 1
                                            return item.ProjectId;
                                        case 33: // location only in model 2
                                            return item.ProjectCmpId;
                                        default:
                                            return 0;
                                    }
                                },
                                enableCache: true,
                                readonly: true
                            }) */
                        },
                        labels: {
                            ...prefixAllTranslationKeys('model.change.', {
                                ChangeTypeFk: { key: 'changeType' },
                                ObjectFk: { key: 'object1' },
                                CpiId: { key: 'cpiid' },
                                ObjectCmpFk: { key: 'object2' },
                                CmpCpiId: { key: 'cmpcpiid' },
                                Value: { key: 'value1' },//TODO
                                Valuecmp: { key: 'value2' },//TODO cloumns not displayed on page 
                                LocationFk: { key: 'location' },
                                IsChangeOrder: { key: 'changeOrder' },
                                PropertyKeyFk: { key: 'entityPropertyKey' },
                            }),
                            ...prefixAllTranslationKeys('model.changeset.', {
                                ModelFk: { key: 'model1' },
                                ModelCmpFk: { key: 'model2' },
                            })
                        }
                    };
                }               
            });