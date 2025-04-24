/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {UiCommonLookupEndpointDataService} from '../services/lookup-endpoint-data.service';
import {FieldType} from '../../model/fields';

export class ProjectAddressEntity {
    public constructor(public Id: number, public AddressLine: string) {
    }
}

/**
 * todo: the sample of web api endpoint lookup data service base on simple lookup data provider, maybe removed from here later.
 */
@Injectable({
    providedIn: 'root'
})
export class UiCommonProjectAddressLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ProjectAddressEntity, TEntity> {
    public constructor() {
        super({
            httpRead: {route: 'project/main/address/', endPointRead: 'getProjectAddresses'},
            filterParam: 'projectId',
            prepareListFilter: context => {
                return 'projectId=573';
            }
        }, {
            uuid: '22ac8586a5a642280278e50a46d8a9c2',
            valueMember: 'Id',
            displayMember: 'AddressLine',
            gridConfig: {
                columns: [
                    {
                        id: 'AddressLine',
                        model: 'AddressLine',
                        type: FieldType.Remark,
                        label: {text: 'AddressLine', key: 'cloud.common.address'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }
}