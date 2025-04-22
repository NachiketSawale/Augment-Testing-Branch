/*
 * Copyright(c) RIB Software GmbH
 */

import {createLookup, FieldType, UiCommonLookupEndpointDataService} from '@libs/ui/common';
import {IProjectStockLookupEntity} from '@libs/basics/interfaces';
import {Injectable} from '@angular/core';
import {BasicsCompanyLookupService} from '@libs/basics/shared';
import {get} from 'lodash';
import { ProjectSharedLookupService } from '@libs/project/shared';

/**
 * @deprecated will be removed later, use the new {@link ProjectSharedLookupOverloadProvider.provideProjectStockLookupOverload}.
 */
@Injectable({
    providedIn: 'root'
})
export class ProjectStockLookupService extends UiCommonLookupEndpointDataService<IProjectStockLookupEntity> {

    public constructor() {
        super({
            httpRead: {
                route: 'project/stock/',
                endPointRead: 'instances',
	            usePostForRead: true
            },
	        filterParam: true,
	        prepareListFilter: (context) => {
		        return {
			        PKey1: null,
			        PKey2: null,
			        PKey3: get(context?.entity, 'ProjectFk') || get(context?.entity, 'PrjProjectFk')
		        };
	        },
            prepareSearchFilter: request => {
                return {
                    PKey1: get(request.additionalParameters, 'PKey1'),
                    PKey2: get(request.additionalParameters, 'PKey2'),
                    PKey3: get(request.additionalParameters, 'PKey3')
                };
            }
        }, {
            uuid: 'b9a0fe4aa0774a7aa62f1f64062593c7',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                columns: [
                    {
                        id: 'Code',
                        model: 'Code',
                        type: FieldType.Code,
                        width: 100,
                        label: {key: 'cloud.common.entityCode'},
                        sortable: false,
                        readonly: true,
                    },
                    {
                        id: 'Description',
                        model: 'Description',
                        type: FieldType.Description,
                        width: 150,
                        label: {key: 'cloud.common.entityDescription'},
                        sortable: false,
                        readonly: true,
                    },
                    {
                        id: 'companyCode',
                        model: 'CompanyFk',
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsCompanyLookupService,
                            displayMember: 'Code'
                        }),
                        width: 120,
                        label: {key: 'cloud.common.entityCompanyCode'},
                        sortable: false,
                        readonly: true,
                    },
                    {
                        id: 'companyName',
                        model: 'CompanyFk',
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsCompanyLookupService,
                            displayMember: 'CompanyName'
                        }),
                        width: 120,
                        label: {key: 'cloud.common.entityCompanyName'},
                        sortable: false,
                        readonly: true,
                    },
                    {
                        id: 'projectNo',
                        model: 'ProjectFk',
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: ProjectSharedLookupService,
                            displayMember: 'ProjectNo'
                        }),
                        width: 120,
                        label: {key: 'cloud.common.entityProjectNo'},
                        sortable: false,
                        readonly: true,
                    },
                    {
                        id: 'projectName',
                        model: 'ProjectFk',
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: ProjectSharedLookupService,
                            displayMember: 'ProjectName'
                        }),
                        width: 120,
                        label: {key: 'cloud.common.entityProjectName'},
                        sortable: false,
                        readonly: true,
                    },
                ]
            }
        });
    }
}