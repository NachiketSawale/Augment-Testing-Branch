/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardConfigService } from './generic-wizard-config.service';
import { inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { get, isEmpty } from 'lodash';
import { PrcInfoForGenericWizard } from '../../models/types/prc-info-for-generic-wizard.type';
import { ReportPlaceholder } from './generic-wizard-report-parameters-base.service';
import { RfqBidderWizardContainers } from '../../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';
import { ContractConfirmWizardContainers } from '../../configuration/contract-confirm/enum/contract-confirm-containers.enum';


export abstract class GenericWizardReportBase<T extends IGenericWizardReportEntity> extends ContainerBaseComponent {

	protected readonly reportList: T[] = [];
	private readonly wizardService = inject(GenericWizardConfigService);

	protected constructor() {
		super();
		this.reportList = this.prepareReportList();
		this.placeholders = this.setPlaceholders();
	}

	private prepareReportList() {
		const instanceUuid = this.wizardService.getWizardInstanceUuid();
		let containerUuid: GenericWizardContainers = RfqBidderWizardContainers.RFQ_BIDDER_Report;
		if (instanceUuid === GenericWizardUseCaseUuid.ContractConfirm) {
			containerUuid = ContractConfirmWizardContainers.CONTRACT_CONFIRM_REPORT;
		}
		return this.wizardService.getService(containerUuid).getList() as T[];
	}

	public get list() {
		return this.reportList;
	}

	protected placeholders: ReportPlaceholder = {};

	private setPlaceholders(): Record<string, string | number | (() => number)> {
		const config = this.wizardService.getWizardConfig();
		const entityId = config.startEntityId;
		let placeholders: Record<string, string | number | (() => number)> = {};
		switch (this.wizardService.getWizardInstanceUuid()) {
			case GenericWizardUseCaseUuid.RfqBidder: {
				const wizardService = this.wizardService;
				const defaultBusinessPartnerId = () => {
					return wizardService.getService(RfqBidderWizardContainers.RFQ_BIDDER).getList()[0].BusinessPartnerFk;
				};
				placeholders = {
					RfqHeaderID: entityId,
					RfqID: entityId,
					Module_RfqID: entityId,
					RFQID: entityId,
					BidderID: defaultBusinessPartnerId,
					BusinessPartnerID: defaultBusinessPartnerId
				};
				const prcInfo = get(config, 'prcInfo') as PrcInfoForGenericWizard | undefined;
				if (prcInfo && prcInfo.Requisition && !isEmpty(prcInfo.Requisition)) {
					placeholders['ReqID'] = prcInfo.Requisition[0].Id;
				}
			}
				break;
			case GenericWizardUseCaseUuid.ContractConfirm: {
				placeholders = {
					ConHeaderID: entityId,
					ConID: entityId
				};
			}
				break;
		}
		return placeholders;
	}
}
