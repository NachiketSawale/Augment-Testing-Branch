/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMdcMaterial2basUomEntity } from '../model/entities/mdc-material-2-bas-uom-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
/**
 * Material Uom layout service
 */
@Injectable({
    providedIn: 'root',
})
export class BasicsMaterialUomLayoutService {
    public async generateConfig(): Promise<ILayoutConfiguration<IMdcMaterial2basUomEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'BasUomFk',
                        'Quantity',
                        'CommentText',
                        'IsDefaultForInternalDelivery'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('basics.material.', {
                    BasUomFk: {key: 'basUom.basUom', text: 'Uom'},
                    Quantity: {key: 'basUom.quantity', text: 'Quantity'},
                    IsDefaultForInternalDelivery: {key: 'basUom.isdefaultforinternaldelivery', text: 'Is Default for Internal Delivery'}
                }),
	            ...prefixAllTranslationKeys('cloud.common.', {
		            CommentText: {key: 'entityCommentText', text: 'Comment'},
	            })
            },
	        overloads:{
		        BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
	        }
        };
    }
}