/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IEstimateMainLineItemLookupDialogEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root',
})

/**
 * EstimateLineItemLookupService this service provides generic lookup for line items
 */
export class EstimateLineItemLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IEstimateMainLineItemLookupDialogEntity, TEntity> {
    /**
     * Constructor calls abstract lookup data service and assigns values to ILookupConfig
     */
    public constructor() {
        super('estlineitemlookup', {
            uuid: 'c54ba5e9e9ef477180a280f7b517e2e8',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        type: FieldType.Code,
                        label: {
                            text: 'Code',
                            key: 'estimate.main.estimateCode',
                        },
                        visible: true,
                        sortable: false,
                        width: 120,
                        readonly: true,
                    },
                    {
                        id: 'desc',
                        model: 'DescriptionInfo',
                        type: FieldType.Description,
                        label: {
                            text: 'Description',
                            key: 'estimate.main.estimateDescription',
                        },
                        visible: true,
                        sortable: false,
                        width: 120,
                        readonly: true,
                    },
                    {
                        id: 'boqitemfk',
                        model: 'BoqItemFk',
                        type: FieldType.Description,  // todo lookup
                        label: {
                            text: 'BoQ Item Ref. No',
                            key: 'estimate.main.boqItemFk',
                        },
                        visible: true,
                        sortable: false,
                        width: 120,
                        readonly: true,
                    },
                    {
                        id: 'brief',
                        model: 'BoqItemFk',
                        type: FieldType.Description, // todo lookup
                        label: {
                            text: 'BoQ Root Item Ref. No BriefInfo',
                            key: 'estimate.main.briefInfo',
                        },
                        visible: true,
                        sortable: false,
                        width: 120,
                        readonly: true,
                    },
                    {
                        id: 'boqheaderfk',
                        model: 'BoqHeaderFk',
                        type: FieldType.Description, // todo lookup
                        label: {
                            text: 'BoQ Root Item Ref. No',
                            key: 'estimate.main.boqRootRef',
                        },
                        visible: true,
                        sortable: false,
                        width: 120,
                        readonly: true,
                    }
                ],
                skipPermissionCheck: true,
            },
            dialogOptions: {
                headerText: {
                    text: 'estimate.main.estimateTitle',
                }
            },
            showDialog: true,
        });
    }
}
