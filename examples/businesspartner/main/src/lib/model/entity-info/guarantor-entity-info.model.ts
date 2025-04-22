/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { BusinessPartnerMainGuarantorDataService } from '../../services/guarantor-data.service';
import { GuarantorLayoutService } from '../../services/layouts/guarantor-layout.service';

export const GUARANTOR_INFO_ENTITY = EntityInfo.create<IGuarantorEntity>({
    grid: {
        title: {
            text: 'Guarantors',
            key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.entityGuarantor',
        },
        containerUuid: 'ddf49471e5944a5f8b8de31c9715375e'
    },
    form: {
        title: {
            text: 'Guarantor Detail',
            key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.entityGuarantorDetail',
        },
        containerUuid: '81579d8e9d0648769a118c2840e1fe8a',
    },
    // eslint-disable-next-line strict
    dataService: (ctx) => ctx.injector.get(BusinessPartnerMainGuarantorDataService),
    dtoSchemeId: {moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'GuarantorDto'},
    permissionUuid: 'ddf49471e5944a5f8b8de31c9715375e',
    layoutConfiguration: context => {
        return context.injector.get(GuarantorLayoutService).generateLayout();
    },
});