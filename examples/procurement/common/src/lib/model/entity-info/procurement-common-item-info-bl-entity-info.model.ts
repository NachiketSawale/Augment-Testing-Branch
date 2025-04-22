/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import { CompleteIdentification } from '@libs/platform/common';
import {EntityInfo, IEntityContainerBehavior, IFormContainerLink, IGridContainerLink} from '@libs/ui/business-base';
import {IPrcItemEntity, IPrcItemInfoBLEntity} from '../entities';
import {
    ProcurementCommonItemInfoBlLayoutService
} from '../../services/procurement-common-item-info-bl-layout.service';
import {
    ProcurementCommonItemInfoBlDataService
} from '../../services/procurement-common-item-info-bl-data.service';
import {
    ProcurementCommonItemInfoBlFormBehavior
} from '../../behaviors/procurement-common-item-info-bl-form-behavior.service';
import {
    ProcurementCommonItemInfoBlGridBehavior
} from '../../behaviors/procurement-common-item-info-bl-grid-behavior.service';

/**
 * Procurement common Info BaseLine entity info helper
 */
export class ProcurementCommonItemInfoBlEntityInfo {

    /**
     * Create a real procurement Info BaseLine entity info configuration for different modules
     */
    public static create<T extends IPrcItemInfoBLEntity, PT extends IPrcItemEntity, PU extends CompleteIdentification<PT>>(config: {
        /**
         * Permission uuid in lower case
         */
        permissionUuid: string,
        /**
         * Form uuid in lower case
         */
        formUuid: string;
        /**
         * Data service
         */
        dataServiceToken: ProviderToken<ProcurementCommonItemInfoBlDataService<T,PT, PU>>,
        /**
         * Gird Container behavior
         */
        behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
        /**
         * Form Container behavior
         */
        behaviorForm?: ProviderToken<IEntityContainerBehavior<IFormContainerLink<T>, T>>,
        /**
         * Customize layout service by extending ProcurementCommonItem Info BaseLine LayoutService
         * Default is ProcurementCommonInfo BaseLineLayoutService
         */
        layoutServiceToken?: ProviderToken<ProcurementCommonItemInfoBlLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Item Info (Baseline)', key: 'procurement.common.item.prcItemInfoBlGridTitle'},
                behavior:context => context.injector.get(config.behaviorGrid ?? ProcurementCommonItemInfoBlGridBehavior)
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: 'Item Info (Baseline) Detail', key: 'procurement.common.item.prcItemInfoBlFormTitle'},
                behavior:context => context.injector.get(config.behaviorForm ?? ProcurementCommonItemInfoBlFormBehavior)
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcItemInfoBLDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(ProcurementCommonItemInfoBlLayoutService).generateConfig();
            }
        });
    }
}