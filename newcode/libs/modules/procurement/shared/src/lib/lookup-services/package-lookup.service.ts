/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {createLookup, FieldType, UiCommonLookupTypeDataService} from '@libs/ui/common';
import { IBasicsCustomizePackageStatusEntity, IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import {
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedPackageStatusLookupService, BasicsSharedStatusIconService
} from '@libs/basics/shared';
import { ServiceLocator } from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProcurementPackageLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProcurementPackageLookupEntity, TEntity> {
    public constructor() {
        super('PrcPackage', {
            uuid: '3819a8a5317c4579908f4d2e2f95d75e',
            valueMember: 'Id',
            displayMember: 'Code',
            gridConfig: {
                columns: [
                    {
                        id: 'code',
                        model: 'Code',
                        label: {key: 'cloud.common.entityCode'},
                        type: FieldType.Code,
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'description',
                        model: 'Description',
                        label: {key: 'cloud.common.entityDescription'},
                        type: FieldType.Description,
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'packageStatusDescription',
                        model: 'PackageStatusFk',
                        label: {key: 'cloud.common.entityState'},
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedPackageStatusLookupService,
                            displayMember: 'DescriptionInfo.Translated',
	                         imageSelector: ServiceLocator.injector.get(BasicsSharedStatusIconService<IBasicsCustomizePackageStatusEntity, IProcurementPackageLookupEntity>)
                        }),
                        sortable: false,
                        readonly: true
                    },
                    {
                        id: 'packageConfigurationDescription',
                        model: 'PrcPackageConfigurationFk',
                        label: {key: 'procurement.common.prcConfigurationDescription'},
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
                            displayMember: 'DescriptionInfo.Translated'
                            // TODO - imageSelector
                        }),
                        sortable: false,
                        readonly: true
                    },
                ]
            },
            dialogOptions: {
                headerText: {
                    key: 'procurement.common.packageLookupDialogTitle'
                },
            }
        });
    }
}