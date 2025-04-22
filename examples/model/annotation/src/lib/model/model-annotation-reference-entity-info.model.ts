/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelAnnotationReferenceDataService } from '../services/model-annotation-reference-data.service';
import { IModelAnnotationReferenceEntity } from './entities/model-annotation-reference-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ANNOTATION_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

export const MODEL_ANNOTATION_REFERENCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelAnnotationReferenceEntity> ({
    
    grid: {
                    title: {key: 'model.annotation.referenceListTitle'},
                },
                form: {
			    title: { key: 'model.annotation.referenceDetailTitle' },
			    containerUuid: '5ead9a293b23439e9a668298ed75d438',
		        },
                dataService: ctx => ctx.injector.get(ModelAnnotationReferenceDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Annotation', typeName: 'ModelAnnotationReferenceDto'},
                permissionUuid: '86d0e1fe63d24c1eb25c05a7ad470844',
                layoutConfiguration: async ctx => {
                    const [
                        annotationLookupProvider
                    ] = await Promise.all([
                        ctx.lazyInjector.inject(ANNOTATION_LOOKUP_PROVIDER_TOKEN),
                    ]);
                    return <ILayoutConfiguration<IModelAnnotationReferenceEntity>>{
                       
                       
                        groups: [
                            {
                                gid: 'baseGroup',
                                attributes: ['FromAnnotationFk', 'ToAnnotationFk', 'ReferenceTypeFk']
                            }
                        ],
                        overloads: {
                            FromAnnotationFk: {
                                ...annotationLookupProvider.generateAnnotationLookup(),
                                readonly: true
                            },
                            ToAnnotationFk: {
                                ...annotationLookupProvider.generateAnnotationLookup(),
                                readonly: true
                            },
                            ReferenceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelAnnotationReferenceTypeLookupOverload(true),
                          
                        },
                        labels: {
                            ...prefixAllTranslationKeys('model.annotation.', {
                                FromAnnotationFk: { key: 'fromAnnotation' },
                                ToAnnotationFk: { key: 'toAnnotation' },
                                ReferenceTypeFk: { key: 'referenceType' },
                            }),
                        }
                    };
                }       
            });