/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { ProcurementCommonExportMaterialWizardService } from '@libs/procurement/common';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { ProcurementQuoteHeaderDataService } from '../quote-header-data.service';
import { ProcurementQuoteRequisitionDataService } from '../quote-requisitions-data.service';
import { IQuoteHeaderEntity } from '../../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../../model/entities/quote-header-entity-complete.class';
import { IQuoteRequisitionEntity } from '../../model/entities/quote-requisition-entity.interface';

@Injectable({ providedIn: 'root' })

export class ProcurementQuoteExportMaterialWizardService extends ProcurementCommonExportMaterialWizardService<IQuoteHeaderEntity, QuoteHeaderEntityComplete, IQuoteRequisitionEntity>{

    public constructor() {
        super({
            rootDataService: inject(ProcurementQuoteHeaderDataService),
            currentSelectionSvc: inject(ProcurementQuoteRequisitionDataService),
            GetExportParameters(entity, rootEntity) {
                return {
                    objectFk: entity.QtnHeaderFk,
                    ProjectFk: rootEntity.ProjectFk,
                    CurrencyFk: rootEntity.CurrencyFk,
                    moduleName: ProcurementInternalModule.Quote,
                    subObjectFk: 0,
                };
            },
        });
    }
}