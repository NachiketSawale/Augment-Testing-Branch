import { Injectable } from '@angular/core';
import { FieldType, ILookupContext, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBasicsCustomizeBpStatus2Entity } from '@libs/basics/interfaces';


@Injectable({
    providedIn: 'root'
})

export class BusinesspartnerSharedStatus2MultipleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBasicsCustomizeBpStatus2Entity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('BusinessPartnerStatus2', {
            uuid: 'be46474fb53d475ab58d67551c0cbd0e',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            gridConfig: {
                uuid: 'be46474fb53d475ab58d67551c0cbd0e',
                columns: [
                    {
                        id: 'selected',
                        model: 'Selected',
                        type: FieldType.Boolean,
                        label: {key: 'cloud.common.entitySelected'},
                        sortable: true,
                        visible: true,
                        readonly: true,
                        //headerChkbox: true, // TODO chase:  not support yet.
                    },
                    {
                        id: 'description',
                        model: 'DescriptionInfo.Translated',
                        type: FieldType.Translation,
                        label: {text: 'Description', key: 'cloud.common.entityDescription'},
                        sortable: true,
                        visible: true,
                        readonly: true,
                        //todo need add formatter
                        // formatter: function (row, cell, value, columndef, dataContext) {
                        // 	var imageUrl = platformStatusIconService.select(dataContext);
                        // 	var isCss = Object.prototype.hasOwnProperty.call(platformStatusIconService, 'isCss') ? platformStatusIconService.isCss() : false;
                        // 	return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
                        // 		'<span class="pane-r">' + value + '</span>';
                        // }
                    }
                ],

            },
            imageSelector: { // TODO: Use the global status icon formatter/selector instead.
                select(item: IBasicsCustomizeBpStatus2Entity, context: ILookupContext<IBasicsCustomizeBpStatus2Entity, TEntity>): string {
                    return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
                },
                getIconType() {
                    return 'css';
                }
            }
        });

    }
}
