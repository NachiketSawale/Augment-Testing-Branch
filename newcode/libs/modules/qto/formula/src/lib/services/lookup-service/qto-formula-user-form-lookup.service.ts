import {Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import {IUserFormDataEntity} from '@libs/basics/shared';

@Injectable({
    providedIn: 'root'
})
export class QtoFormulaUserFormLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IUserFormDataEntity, TEntity> {
    public constructor() {
        super(
            {
                httpRead: {route: 'basics/userform/', endPointRead: 'list?rubricId=87', usePostForRead: false},
            },
            {
                uuid: 'a1592dac35d24f778b6013b43a0adef9',
                idProperty: 'Id',
                valueMember: 'Id',
                displayMember: 'Description',
                showGrid: true,
                gridConfig: {
                    columns: [
                        {
                            id: 'Description',
                            model: 'Description',
                            type: FieldType.Description,
                            label:
                                {
                                    key: 'cloud.common.entityUserForm'
                                },
                            sortable: true,
                            visible: true
                        }
                    ]
                }
            });
    }
}
