/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainConfidenceCheckDataService } from './estimate-main-confidence-check-data.service';
import { EstimateMainConfidenceCheckBehavior } from './estimate-main-confidence-check-behavior.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IEstConfidenceCheckEntity } from '@libs/estimate/interfaces';

/**
 * Provides basic information about the Est confidence check container
 */
export const ESTIMATE_MAIN_CONFIDENCE_CHECK_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstConfidenceCheckEntity>({
    grid: {
        title: { key: 'estimate.main.confidenceCheck.confidenceCheck',},
        behavior: () => new EstimateMainConfidenceCheckBehavior(),
        treeConfiguration: (ctx) => {
            return {
                rootEntities: () => {
                    const service = ctx.injector.get(EstimateMainConfidenceCheckDataService);
                    const data =  service.getList();
                    return data;
                },
                parent: function (entity: IEstConfidenceCheckEntity) {
                    const service = ctx.injector.get(EstimateMainConfidenceCheckDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: IEstConfidenceCheckEntity) {
                    const service = ctx.injector.get(EstimateMainConfidenceCheckDataService);
                    return service.childrenOf(entity);
                },
            } as unknown as IGridTreeConfiguration<IEstConfidenceCheckEntity>;
        },
    },
    dataService: (ctx) => ctx.injector.get(EstimateMainConfidenceCheckDataService),
    dtoSchemeId: { moduleSubModule: 'Estimate.Main', typeName: 'EstConfidenceCheckDto' },
    permissionUuid: 'E790BA05B2F54E35AB95041E10941499',
    layoutConfiguration: {
        groups: [
            {
                gid: 'default-group',
                attributes: ['DescriptionInfo','Count'],
            }
        ],
        labels: {
            ...prefixAllTranslationKeys('estimate.main.confidencecheck.', {
                Count: { key: 'count' },
            })
        }
    }
});
