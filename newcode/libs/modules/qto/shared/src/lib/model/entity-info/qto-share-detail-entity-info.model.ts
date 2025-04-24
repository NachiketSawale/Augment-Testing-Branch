/*
 * Copyright(c) RIB Software GmbH
 */

import { ProviderToken } from '@angular/core';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { EntityInfo, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IQtoShareDetailEntity } from '../entities/qto-share-detail-entity.interface';
import { QtoShareDetailGridComplete } from '../qto-share-detail-complete.class';
import { QtoShareDetailDataService } from '../../services/qto-share-detail-data.service';
import { QtoShareDetailLayoutService } from '../../services/qto-share-detail-layout.service';
import {QtoShareDetailValidationService} from '../../services/validation/qto-share-detail-validation.service';

/**
 * qto share detail entity info helper
 */
export class QtoShareDetailEntityInfo {

    /**
     * Create qto detail entity info configuration for different modules
     */
    public static create<T extends IQtoShareDetailEntity, U extends QtoShareDetailGridComplete, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
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
        dataServiceToken: ProviderToken<QtoShareDetailDataService<T, U, PT, PU>>,
        /**
         * validation service
         */
        validationServiceToken?: ProviderToken<QtoShareDetailValidationService<T, U, PT, PU>>,
        /**
         * Container behavior
         */
        behavior?: ProviderToken<IEntityContainerBehavior<IGridContainerLink<T>, T>>,
        /**
         * Customize layout service by extending QtoShareDetailLayoutService
         * Default is QtoShareDetailLayoutService
         */
        layoutServiceToken?: ProviderToken<QtoShareDetailLayoutService>
    }) {
        return EntityInfo.create<T>({
            grid: {
                title: {text: 'Quantity Takeoff', key: 'qto.main.detail.gridTitle'},
                behavior: config.behavior ? context => context.injector.get(config.behavior) : undefined
            },
            form: {
                containerUuid: config.formUuid,
                title: {text: 'Quantity Takeoff Detail', key: 'qto.main.detail.formTitle'}
            },
            dataService: context => context.injector.get(config.dataServiceToken),
            validationService: context => context.injector.get(config.validationServiceToken),
            dtoSchemeId: {moduleSubModule: 'Qto.Main', typeName: 'QtoDetailDto'},
            permissionUuid: config.permissionUuid,
            layoutConfiguration: context => {
                return context.injector.get(config.layoutServiceToken ?? QtoShareDetailLayoutService).generateLayout({
                    dataServiceToken: config.dataServiceToken
                });
            }
        });
    }

}