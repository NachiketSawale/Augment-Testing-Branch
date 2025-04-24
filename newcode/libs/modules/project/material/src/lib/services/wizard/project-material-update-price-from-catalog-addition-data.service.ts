/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {PriceVersions} from '../../model/project-material-constants';
import {PlatformTranslateService} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceFromCatalogAdditionalData {

    private readonly translateService = inject(PlatformTranslateService);

    public additionalPriceVersions = [
        {
            Id: this.weightedPriceVersionId,
            MaterialCatalogFk: this.weightedPriceVersionId,
            MaterialPriceVersionDescriptionInfo: {
                Translated: this.translateService.instant('project.main.prjMaterialSource.mixed')
            },
            PriceListDescriptionInfo: {
                Translated: ''
            }
        },
        {
            Id: this.basePriceVersionId,
            MaterialCatalogFk: this.basePriceVersionId,
            MaterialPriceVersionDescriptionInfo: {
                Translated: this.translateService.instant('project.main.prjMaterialSource.onlyBase')
            },
            PriceListDescriptionInfo: {
                Translated: ''
            }
        }
    ];

    public get basePriceVersionId() {
        return PriceVersions.base;
    }
    public get weightedPriceVersionId() {
        return PriceVersions.mixed;
    }
}