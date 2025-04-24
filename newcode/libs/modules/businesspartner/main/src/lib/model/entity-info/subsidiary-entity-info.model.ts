/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartnerMainSubsidiaryDataService } from '../../services/subsidiary-data.service';
import { ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { SubsidiaryLayoutService } from '../../services/layouts/subsidiary-layout.service';

export const SUBSIDIARY_INFO_ENTITY = EntityInfo.create<ISubsidiaryEntity>({
    grid: {
        title: {
            text: 'Branches',
            key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.subsidiaryGridContainerTitle',
        },
    },
    form: {
        title: {
            text: 'Branch Detail',
            key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.subsidiaryDetailContainerTitle',
        },
        containerUuid: '79d7f116fe29482687375a6afa9149fe',
    },
    dataService: (ctx) => ctx.injector.get(BusinessPartnerMainSubsidiaryDataService),
    dtoSchemeId: {moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'SubsidiaryDto'},
    permissionUuid: 'e48c866c714440f08a1047977e84481f',
    layoutConfiguration: context => {
        return context.injector.get(SubsidiaryLayoutService).generateLayout();
    },
});