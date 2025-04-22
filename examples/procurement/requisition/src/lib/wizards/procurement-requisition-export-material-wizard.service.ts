/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { IReqHeaderEntity, ProcurementCommonExportMaterialWizardService } from '@libs/procurement/common';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
@Injectable({ providedIn: 'root' })
export class ProcurementRequisitionExportMaterialWizardService extends ProcurementCommonExportMaterialWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, IReqHeaderEntity>{

    public constructor() {
        const requisitionHeaderDataService = inject(ProcurementRequisitionHeaderDataService);
        super({
            rootDataService: requisitionHeaderDataService,
            currentSelectionSvc: requisitionHeaderDataService,
            GetExportParameters(entity) {
                return {
                    objectFk: entity.Id,
                    ProjectFk: entity.ProjectFk,
                    CurrencyFk: entity.BasCurrencyFk,
                    moduleName: ProcurementInternalModule.Requisition,
                    subObjectFk: 0,
                };
            },
        });
    }
}