/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupContext, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import {IQuoteStatusEntity} from '@libs/basics/interfaces';

/**
 * Quote Status lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedQuoteStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IQuoteStatusEntity, TEntity> {
    /**
     * The constructor
     */
    public constructor() {
        super('QuoteStatus', {
            uuid: '9981284d02ee4ed0b188f4befacdc6c1',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description',
            showCustomInputContent: true,
            formatter: {
                format(dataItem: IQuoteStatusEntity, context: ILookupContext<IQuoteStatusEntity, TEntity>): string {
                    return `<i class='block-image status-icons ico-status${dataItem.Icon.toString().padStart(2, '0')}'></i><span class='pane-r'>${dataItem.Description}</span>`;
                }
            },
            gridConfig: {
                columns: [
                    {
                        id: 'selected',
                        model: 'Selected',
                        type: FieldType.Boolean,
                        label: {
                            text: 'Selected',
                            key: 'cloud.common.entitySelected'
                        },
                        width: 50,
                        visible: true,
                        sortable: false
                    },
                    {
                        id: 'description',
                        model: 'Description',
                        type: FieldType.Description,
                        label: {
                            text: 'Description',
                            key: 'cloud.common.entityDescription'
                        },
                        width: 120,
                        visible: true,
                        sortable: false,
                        readonly: true,
                        //todo need add formatter
                        // formatter: function (row, cell, value, columndef, dataContext) {
                        // 	var imageUrl = platformStatusIconService.select(dataContext);
                        // 	var isCss = Object.prototype.hasOwnProperty.call(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
                        // 	return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
                        // 		'<span class="pane-r">' + value + '</span>';
                        // }
                    }
                ]
            }
        });
    }
}