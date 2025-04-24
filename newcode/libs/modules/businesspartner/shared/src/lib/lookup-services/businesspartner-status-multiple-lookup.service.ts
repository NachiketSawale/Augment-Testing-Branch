import { Injectable } from '@angular/core';
import { FieldType, ILookupContext, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBasicsCustomizeBpStatusEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})

export class BusinesspartnerSharedStatusMultipleLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBasicsCustomizeBpStatusEntity, TEntity> {
    /**
     * constructor
     */
    public constructor() {
        super('BusinessPartnerStatus', {
            uuid: 'e94dbbb900d440dea08b22819b4e2fea',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Description',
            gridConfig: {
                uuid: 'e94dbbb900d440dea08b22819b4e2fea',
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
                        model: 'Description',
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
                select(item: IBasicsCustomizeBpStatusEntity, context: ILookupContext<IBasicsCustomizeBpStatusEntity, TEntity>): string {
                    return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
                },
                getIconType() {
                    return 'css';
                }
            }
        });

    }
}
