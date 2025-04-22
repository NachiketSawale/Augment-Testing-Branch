/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken} from '@angular/core';
import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {EntityInfo} from '@libs/ui/business-base';
import {IPrcMilestoneEntity} from '../entities/prc-milestone-entity.interface';
import {ProcurementCommonMileStoneDataService} from '../../services/procurement-common-mile-stone-data.service';
import {ProcurementCommonMileStoneLayoutService} from '../../services/procurement-common-mile-stone-layout.service';

/**
 * Procurement common MileStone entity info helper
 */
export class ProcurementCommonMileStoneEntityInfo {

    /**
     * Create a real procurement MileStone entity info configuration for different modules
     */
    public static create<T extends IPrcMilestoneEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
        dataServiceToken: ProviderToken<ProcurementCommonMileStoneDataService<T,PT, PU>>,
        /**
         * Customize layout service by extending ProcurementCommon MileStone LayoutService
         * Default is ProcurementCommon MileStone LayoutService
         */
        layoutServiceToken?: ProviderToken<ProcurementCommonMileStoneLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Milestones', key: 'procurement.common.milestone.milestoneContainerGridTitle'},
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: 'Milestone Detail', key: 'procurement.common.milestone.milestoneContainerFormTitle'},
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            dtoSchemeId: {moduleSubModule: 'Procurement.Common', typeName: 'PrcMilestoneDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(ProcurementCommonMileStoneLayoutService).generateConfig();
            }
        });
    }
}