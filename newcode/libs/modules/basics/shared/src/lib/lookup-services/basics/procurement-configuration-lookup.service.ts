/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import {ProcurementConfigurationEntity} from '../entities/procurement-configuration-entity';
import {BASICS_PRC_CONFIG_LOOKUP_LAYOUT_GENERATOR, ILookupLayoutGenerator} from '@libs/basics/interfaces';
/**
 * ProcurementConfiguration lookup service
 */
@Injectable({
    providedIn: 'root'
})
export class BasicsSharedProcurementConfigurationLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ProcurementConfigurationEntity, TEntity> {
    public constructor() {
        super('prcconfiguration', {
            uuid: 'eaa3fb99e37af8301cfef62ad7fce050',
            idProperty: 'Id',
            valueMember: 'Id',
            displayMember: 'DescriptionInfo.Translated',
            gridConfig: async ctx => {
                const layoutGenerator = await ctx.lazyInjector.inject<ILookupLayoutGenerator<ProcurementConfigurationEntity>>(BASICS_PRC_CONFIG_LOOKUP_LAYOUT_GENERATOR);
                const gridColumns = await layoutGenerator.generateLookupColumns();
                return {
                    uuid: 'eaa3fb99e37af8301cfef62ad7fce050',
                    columns: gridColumns
                };
            },
        });
    }
}