import {FieldType, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {Injectable} from '@angular/core';
import {QtoCommentsTypeLookupEntity} from '../model/entities/qto-comments-type-lookup-entitiy.interface';
import {IQtoDetailCommentsEntityGenerated} from '../model/entities/qto-detail-comments-entity-generated.interface';


@Injectable({
    providedIn: 'root'
})
export class QtoCommentsTypeLookupService<TEntity extends IQtoDetailCommentsEntityGenerated> extends UiCommonLookupEndpointDataService<QtoCommentsTypeLookupEntity, TEntity> {
    public constructor() {
        super(
            {
                httpRead: { route: 'qto/detail/comments/', endPointRead: 'qtoCommentTypeOfRole' },
                filterParam: true,
                prepareListFilter: context => {
                    return {
                        CustomIntegerProperty: null,
                        displayProperty: 'Description',
                        lookupModuleQualifier: 'basics.customize.qtocommenttype',
                        valueProperty: 'Id',
                    };
                }
            },
            {
                uuid: '5a3d15812a864364aab8f4bc7314c277',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'DescriptionInfo.Translated',
                showGrid: true,
                gridConfig: {
                    uuid: 'a1d00dfdffa74ddb81f9c55d741fe986',
                    columns: [
                        { id: 'DescriptionInfo', model: 'DescriptionInfo', type: FieldType.Translation, label: { key: 'cloud.common.description' }, sortable: true, visible: true },
                    ]
                },
                events: [
                    {
                        name: 'onSelectedItemChanged',
                        handler: function (e) {
                            const selectedItem = e.context.lookupInput?.selectedItem;
                            if( e.context.entity && selectedItem) {
                                e.context.entity.IsDelete = selectedItem.IsDelete;
                            }
                        }
                    }
                ]
            });
    }
}