/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {FieldType, ILookupContext, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {IContractStatusEntity} from '@libs/basics/interfaces';


/**
 * Contract Status lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedContractStatusLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IContractStatusEntity, TEntity> {
    /**
     * The constructor
     */
    public constructor() {
        super('ConStatus', {
            uuid: 'c8824a7010994861a7e946bcfa5d2fbf',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            showCustomInputContent: true,
            formatter: {
                format(dataItem: IContractStatusEntity, context: ILookupContext<IContractStatusEntity, TEntity>): string {
                    return `<i class='block-image status-icons ico-status${dataItem.Icon.toString().padStart(2, '0')}'></i><span class='pane-r'>${dataItem.DescriptionInfo.Translated}</span>`;
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
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
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