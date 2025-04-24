/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import {ProcurementCommonOverviewDataService} from '../../services/procurement-common-overview-data.service';
import {ProcurementCommonOverviewLayoutService} from '../../services/procurement-common-overview-layout.service';
import {IProcurementCommonOverviewEntity} from '../entities/procurement-common-overview-entity.interface';
import {IGridTreeConfiguration} from '@libs/ui/common';
import { ProcurementCommonOverviewBehaviorService } from '../../behaviors/procurement-common-overview-behavior.service';

/**
 * Procurement common Overview entity info helper
 */
export class ProcurementCommonOverviewEntityInfo {

    /**
     * Create a real procurement Overview entity info configuration for different modules
     */
    public static create<T extends IProcurementCommonOverviewEntity,U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
        /**
         * Permission uuid in lower case
         */
        permissionUuid: string,
        /**
         * Data service
         */
        dataServiceToken: ProviderToken<ProcurementCommonOverviewDataService<T,U,PT, PU>>,
        /**
         * Customize layout service by extending ProcurementCommon Overview LayoutService
         * Default is ProcurementCommon Overview LayoutService
         */
        layoutServiceToken?: ProviderToken<ProcurementCommonOverviewLayoutService>,

	    behaviorGrid?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Overview', key: 'procurement.common.data.dataTitle'},
	             behavior:context => context.injector.get(config.behaviorGrid ?? ProcurementCommonOverviewBehaviorService),
                treeConfiguration: ctx => {
                    return {
                        parent: function (entity: T) {
                            const service = ctx.injector.get(config.dataServiceToken);
                            return service.parentOf(entity);
                        },
                        children: function (entity: T) {
                            const service = ctx.injector.get(config.dataServiceToken);
                            return service.childrenOf(entity);
                        }
                    } as IGridTreeConfiguration<T>;
                }
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcOverviewDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(ProcurementCommonOverviewLayoutService).generateConfig();
            }
        });
    }
}