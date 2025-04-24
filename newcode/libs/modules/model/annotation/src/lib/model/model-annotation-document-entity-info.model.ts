/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ModelAnnotationDocumentDataService } from '../services/model-annotation-document-data.service';
import { IModelAnnotationDocumentEntity } from './entities/model-annotation-document-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


 export const MODEL_ANNOTATION_DOCUMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IModelAnnotationDocumentEntity> ({
                grid: {
                    title: {key: 'model.annotation.documentListTitle'},
                },
                form: {
			    title: { key: 'model.annotation.documentDetailTitle'},
			    containerUuid: 'ac73e76de2924220a46956319d4d424c',
		        },
                dataService: ctx => ctx.injector.get(ModelAnnotationDocumentDataService),
                dtoSchemeId: {moduleSubModule: 'Model.Annotation', typeName: 'ModelAnnotationDocumentDto'},
                permissionUuid: '437ca6a2a0c64fe79f90ec3f9b3dc3f0',
                layoutConfiguration: async ctx => {
                  
                    return <ILayoutConfiguration<IModelAnnotationDocumentEntity>>{
                        groups: [
                            {
                                gid: 'baseGroup',
                                attributes: ['AnnotationDocumentTypeFk', 'BasDocumentTypeFk', 'FileArchiveDocFk', 'Description', 'DocumentDate']
                            }
                        ],
                        overloads: {
                           AnnotationDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideModelAnnotationDocumentTypeLookupOverload(true),
                           BasDocumentTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideDocumentTypeLookupOverload(true),
                           FileArchiveDocFk: {
                                readonly: true
                            },
                       
                        },
                        labels: {
                            ...prefixAllTranslationKeys('model.annotation.', {
                                AnnotationDocumentTypeFk: { key: 'annoDocType' },
                                BasDocumentTypeFk: { key: 'documentType' },
                            }),
                        }
                    };
                }         
            });