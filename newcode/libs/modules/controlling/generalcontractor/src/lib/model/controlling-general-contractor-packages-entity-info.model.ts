import {EntityInfo} from '@libs/ui/business-base';
import {IGccPackagesEntity} from './entities/gcc-packages-entity.interface';
import {
    ControllingGeneralContractorPackagesBehaviorService
} from '../behaviors/controlling-general-contractor-packages-behavior.service';
import {
    ControllingGeneralContractorPackagesDataService
} from '../services/controlling-general-contractor-packages-data.service';
import {PlatformConfigurationService, prefixAllTranslationKeys} from '@libs/platform/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {BasicsShareControllingUnitLookupService, BasicsSharedPackageStatusLookupService} from '@libs/basics/shared';
import {inject} from '@angular/core';

export const controllingGeneralContractorPackagesEntityInfo: EntityInfo = EntityInfo.create<IGccPackagesEntity>({
    grid: {
        title: {text: 'PRC Packages', key: 'controlling.generalcontractor.PackagesListController'},
        containerUuid: '29CAF5BFB483446E9DAAD4126D1F13C4',
        behavior: ctx => ctx.injector.get(ControllingGeneralContractorPackagesBehaviorService),
    },

    dtoSchemeId: {
        moduleSubModule: 'Controlling.GeneralContractor',
        typeName: 'GccPackagesDto'
    },
    dataService: ctx => ctx.injector.get(ControllingGeneralContractorPackagesDataService),
    permissionUuid: '363147351c1a426b82e3890cf661493d',
    layoutConfiguration: {
        groups: [{
            gid: 'baseGroup',
            attributes: ['Code', 'Description', 'Budget', 'MdcControllingUnitFk', 'PackageStatusFk', 'Remark', 'Remark2', 'Remark3']
        }],
        labels: {
            ...prefixAllTranslationKeys('controlling.generalcontractor.', {
                Code: {key: 'Code', text: 'Code'},
                Budget: {key: 'Budget', text: 'Budget'},
                MdcControllingUnitFk: {key: 'entityControllingUnit', text: 'Controlling Unit'},
                PackageStatusFk: {key: 'Status', text: 'Status'},
                Description: {key: 'Description', text: 'Description'},
                Remark: {key: 'Remark', text: 'Remark'},
                Remark2: {key: 'Remark2', text: 'Remark2'},
                Remark3: {key: 'Remark3', text: 'Remark3'},
            })
        },
        overloads: {
            Code: {readonly: true},
            Budget: {readonly: true},
            Description: {readonly: true},
            Remark: {readonly: true},
            Remark2: {readonly: true},
            Remark3: {readonly: true},
            PackageStatusFk: {
                type: FieldType.Lookup,
                readonly: true,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsSharedPackageStatusLookupService,
                    displayMember: 'DescriptionInfo.Translated'
                })
            },
            MdcControllingUnitFk: {
                readonly: true,
                type: FieldType.Lookup,
                lookupOptions: createLookup({
                    dataServiceToken: BasicsShareControllingUnitLookupService,
                    showClearButton: true,
                    showDescription: true,
                    descriptionMember: 'DescriptionInfo.Translated',
                    serverSideFilter: {
                        key: 'controlling-actuals-controlling-unit-filter',
                        execute: context => {
                            return {
                                ByStructure: true,
                                ExtraFilter: false,
                                CompanyFk: inject(PlatformConfigurationService).getContext().clientId,
                                FilterKey: 'controlling.structure.estimate.prjcontrollingunit.filterkey',
                                IsProjectReadonly: true,
                                IsCompanyReadonly: true
                            };
                        }
                    },
                    selectableCallback: e => {
                        return true;
                    }
                })
            },
        }
    }
});