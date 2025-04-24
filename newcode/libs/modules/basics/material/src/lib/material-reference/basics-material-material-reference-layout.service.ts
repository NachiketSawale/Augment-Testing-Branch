/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMdcMaterialReferenceEntity } from '../model/entities/mdc-material-reference-entity.interface';
/**
 * Material Reference layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsMaterialMaterialReferenceLayoutService {
    public async generateConfig(): Promise<ILayoutConfiguration<IMdcMaterialReferenceEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'MdcMaterialCatalogFk',
                        'MdcMaterialAltFk',
                        'CommentText',
                        'UserDefined1',
                        'UserDefined2',
                        'UserDefined3',
                        'UserDefined4',
                        'UserDefined5'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.material.', {
                    MdcMaterialAltFk: { key: 'reference.entityMdcMaterialAltFk', text: 'Material'},
                    MdcMaterialCatalogFk: {key: 'reference.entityMdcMaterialCatalogFk', text: 'MdcMaterial Catalog'},
                    CommentText: {key: 'reference.entityCommentText', text: 'CommentText'},
                    UserDefined1: {key: 'reference.entityUserDefined1', text: 'User Defined 1'},
                    UserDefined2: {key: 'reference.entityUserDefined2', text: 'User Defined 2'},
                    UserDefined3: {key: 'reference.entityUserDefined3', text: 'User Defined 3'},
                    UserDefined4: {key: 'reference.entityUserDefined4', text: 'User Defined 4'},
                    UserDefined5: {key: 'reference.entityUserDefined5', text: 'User Defined 5'}
                }),
            }
        };
    }
}