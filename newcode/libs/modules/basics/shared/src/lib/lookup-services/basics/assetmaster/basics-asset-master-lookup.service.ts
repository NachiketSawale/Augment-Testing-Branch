/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, IGridConfiguration, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IBasicsAssetMasterEntity } from '@libs/basics/interfaces';
/**
 * asset master lookup  service
 */
@Injectable({
    providedIn: 'root'
})

export class BasicsSharedAssetMasterLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IBasicsAssetMasterEntity, TEntity> {
    /**
     * The constructor
     */
    /**
     * Grid configuration
     */
    public configuration!: IGridConfiguration<IBasicsAssetMasterEntity>;

    /**
     * The constructor
     */
    public constructor() {
        super('AssertMaster', {
            uuid: 'a2f4ff8fb2dd47dab5fc2df16a00aed3',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                treeConfiguration: {
                    parent: (entity: IBasicsAssetMasterEntity) => {
                        if (entity?.AssetMasterParentFk) {
                            return this.configuration.items?.find((item) => item.Id === entity.AssetMasterParentFk) || null;
                        }
                        return null;
                    },
                    children: (entity: IBasicsAssetMasterEntity) => entity.AssetMasterChildren ?? []
                },
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {
                            text: 'Code',
                            key: 'cloud.common.entityCode'
                        },
                        width: 100,
                        visible: true,
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo',
                        type: FieldType.Translation,
                        label: {
                            text: 'Description',
                            key: 'cloud.common.entityDescription'
                        },
                        width: 120,
                        visible: true,
                        sortable: false,
                        readonly: true
                    }
                ]
            },
            dialogOptions: {
                headerText: {
                    text: 'Assign Asset Master',
                    key: 'basics.assetmaster.assetMasterTitle'
                }
            },
            showDialog: true,
            selectableCallback: function(selectItem) {
                // only dataItem.AllowAssignment can be assigned.
                return selectItem.IsLive && selectItem.AllowAssignment;
            }
        });
    }
}