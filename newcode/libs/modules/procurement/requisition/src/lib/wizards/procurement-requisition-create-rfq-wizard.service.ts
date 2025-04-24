/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ProcurementCommonCreateRfqWizardService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from '../services/requisition-header-data.service';
import { IBusinessPartner2CreateRfqWizardResult } from '@libs/businesspartner/shared';
import { ProcurementInternalModule } from '@libs/procurement/shared';


@Injectable({
	providedIn: 'root'
})
export class ProcurementRequisitionCreateRfqWizardService
	extends ProcurementCommonCreateRfqWizardService<IReqHeaderEntity, ReqHeaderCompleteEntity, object, object> {


	public constructor(private readonly dataService: ProcurementRequisitionHeaderDataService) {
		super({
			rootDataService: dataService,
			getWizardInitialEntity(entity) {
				return {
					structureFk: entity.PrcHeaderEntity?.StructureFk,
					prcHeaderFk: entity.PrcHeaderEntity?.Id,
					addressFk: entity.AddressFk,
					projectFk: entity.ProjectFk,
					companyFk: entity.CompanyFk,
					headerFk: entity.Id,
					moduleName: ProcurementInternalModule.Requisition,
				};
			},
			url: 'procurement/rfq/wizard/createrfqfromreqwizard'
		});
	}


	public override async startWizardValidate() {
		super.startWizardValidate();

		const reqStatus = this.dataService.getStatus();
		if (reqStatus?.Isaccepted) {
			await this.messageBoxService.showMsgBox('procurement.requisition.rfq.disableAcceptedError', 'cloud.common.informationDialogHeader', 'ico-info');
			return false;
		}

		const CreateRfqResult = {
			canCreate: 1,
			baseNotCreated: 2,
			baseStatusNotAllowed: 3,
			selfStatusNotAllowed: 4
		};
		const entity = this.dataService.getSelectedEntity()!;
		const checkResult = await this.checkCreateRfqConditions(entity.Id);
		switch (checkResult) {
			case CreateRfqResult.baseNotCreated:
				await this.messageBoxService.showMsgBox('procurement.requisition.rfq.baseNotCreated', 'cloud.common.informationDialogHeader', 'ico-info');
				return false;
			case CreateRfqResult.baseStatusNotAllowed:
				await this.messageBoxService.showMsgBox('procurement.requisition.rfq.baseStatusNotAllowed', 'cloud.common.informationDialogHeader', 'ico-info');
				return false;
			case CreateRfqResult.selfStatusNotAllowed:
				await this.messageBoxService.showMsgBox('procurement.requisition.rfq.selfStatusNotAllowed', 'cloud.common.informationDialogHeader', 'ico-info');
				return false;
			default:
				return true;
		}

	}

	protected processExecuteWizard(dialogResult: IBusinessPartner2CreateRfqWizardResult): void {
		if (this.wizardInitialEntity?.headerFk) {
			dialogResult.AutoCopyDefaultContact = (dialogResult?.RfqBpWithContact?.length ?? 0) > 0 ? true : dialogResult.AutoCopyBidder;
			dialogResult.ReqHeaderId = this.wizardInitialEntity.headerFk;
		}
	}

	private async checkCreateRfqConditions(reqHeaderId: number): Promise<number> {
		return await this.http.get<number>('procurement/rfq/requisition/checkreqcancreaterfq', {
			params: {
				reqHeaderId: reqHeaderId
			}
		});
	}
}