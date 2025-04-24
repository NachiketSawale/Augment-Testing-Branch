/*
 * Copyright(c) RIB Software GmbH
 */

import {Observable} from 'rxjs';
import {
    FieldType,
    ILookupSearchRequest,
    ILookupSearchResponse,
    UiCommonLookupReadonlyDataService
} from '@libs/ui/common';
import {IPrcItemEntity} from '../model/entities';
import {IReadonlyDataService} from '@libs/procurement/shared';
import {IIdentificationData} from '@libs/platform/common';

export class ProcurementCommonItemLookupService<T extends IPrcItemEntity> extends UiCommonLookupReadonlyDataService<T> {
    public constructor(private dataService: IReadonlyDataService<T>) {
        super({
            uuid: 'fe0c60f5c01728687c4af28426bb4b35',
            valueMember: 'Id',
            displayMember: 'Itemno',
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Itemno',
                        label: {
                            key: 'cloud.common.entityCode'
                        },
                        type: FieldType.Code,
                        sortable: true,
                        visible: true
                    },
                    {
                        id: 'desc',
                        model: 'Description1',
                        label: {
                            key: 'cloud.common.entityDescription'
                        },
                        type: FieldType.Description,
                        sortable: true,
                        visible: true
                    }
                ]
            },
            dialogOptions: {
                headerText: {
                    key: 'procurement.common.dialogTitleItem'
                }
            },
            isClientSearch: true,
            canListAll: true
        });
    }

    public getItemByKey(key: IIdentificationData): Observable<T> {
        return new Observable<T>(e => {
            e.next(this.dataService.getList().find(e => e.Id === key.id));
            e.complete();
        });
    }

    public getList(): Observable<T[]> {
        return new Observable<T[]>(e => {
            e.next(this.dataService.getList());
            e.complete();
        });
    }

    public getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<T>> {
        throw new Error('Using client side search, this method should not be called');
    }
}