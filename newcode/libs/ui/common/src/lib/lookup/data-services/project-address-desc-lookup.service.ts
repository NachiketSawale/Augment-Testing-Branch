/*
 * Copyright(c) RIB Software GmbH
 */
import {get} from 'lodash';
import {Injectable} from '@angular/core';
import {UiCommonLookupEndpointDataService} from '../services/lookup-endpoint-data.service';
import {FieldType} from '../../model/fields';
import {ILookupSearchRequest} from '../model/interfaces/lookup-search-request.interface';

export class ProjectAddressDescEntity {
    public constructor(public Id: number, public Description: string) {
    }
}

/**
 * todo: the sample of web api endpoint lookup data service base on simple lookup data provider, maybe removed from here later.
 */
@Injectable({
    providedIn: 'root'
})
export class UiCommonProjectAddressDescLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ProjectAddressDescEntity, TEntity> {
    public constructor() {
        super({
            httpRead: {route: 'project/main/address/', endPointRead: 'lookup'},
            filterParam: true,
            prepareListFilter: context => {
                return {
                    PKey1: 573 // could be from entity context
                };
            }
        }, {
            uuid: 'cf32e0bae798bf57be452b2df0b60b52',
            valueMember: 'Id',
            displayMember: 'AddressEntity.AddressLine',
            gridConfig: {
                columns: [
                    {
                        id: 'Description',
                        model: 'Description',
                        type: FieldType.Description,
                        label: {text: 'Description', key: 'cloud.common.entityDescription'},
                        sortable: true,
                        visible: true,
                        readonly: true
                    }
                ]
            }
        });
    }

    protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
        const filterValue = get(request.additionalParameters, 'filterValue');

        return {
            PKey1: filterValue
        };
    }
}