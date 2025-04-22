/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, effect, inject } from '@angular/core';
import { GenericWizardNamingParameterConstantService } from '../../services/base/generic-wizard-naming-parameter-constant.service';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { RfqBidderWizardContainers } from '../../configuration/rfq-bidder/enum/rfq-bidder-containers.enum';
import { IGenericWizardReportEntity } from '../../configuration/rfq-bidder/types/generic-wizard-report-entity.interface';
import { FieldType, IControlContext } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { RfqBidderWizardConfig } from '../../configuration/rfq-bidder/types/rfq-bidder-wizard-config.type';
import { GenericWizardUseCaseUuid } from '../../models/enum/generic-wizard-use-case-uuid.enum';
import { ReportPlaceholder } from '../../services/base/generic-wizard-report-parameters-base.service';
import { RfqWizardProject } from '../../configuration/rfq-bidder/types/generic-wizard-project.type';
import { ContractConfirmWizardContainers } from '../../configuration/contract-confirm/enum/contract-confirm-containers.enum';

/**
 * Cover letter component for generic wizard.
 */
@Component({
	templateUrl: './cover-letter.component.html',
	styleUrl: './cover-letter.component.scss'
})
export class WorkflowCommonGenericWizardCoverLetterComponent extends ContainerBaseComponent {

	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly namingConstantService = inject(GenericWizardNamingParameterConstantService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly wizardInstanceUuid: GenericWizardUseCaseUuid | undefined = undefined;

	public coverLetters: IGenericWizardReportEntity[] = [];
	public fieldType = FieldType.Description;
	public controlContext: IControlContext<string> = {
		fieldId: 'cover-letter-container',
		entityContext: {
			totalCount: 0
		},
		readonly: false,
		validationResults: [],
		value: ''
	};

	/**
	 * Placeholder object that automatically replaces report values.
	 */
	public placeholders: ReportPlaceholder = {};

	public constructor() {
		super();
		this.uiAddOns.toolbar.setVisibility(false);
		this.wizardInstanceUuid = this.wizardConfigService.getWizardInstanceUuid();
		const wizardConfig = this.wizardConfigService.getWizardConfig() as RfqBidderWizardConfig;
		const subject = this.prepareSubject(wizardConfig);

		//Setting subject value to wizard config.
		wizardConfig.subject = subject;
		wizardConfig.defaultSubject = structuredClone(subject);
		this.controlContext.value = wizardConfig.subject;

		effect(() => {
			if (this.wizardConfigService.$haveDataServicesLoaded()) {
				this.prepareCoverLetters();
				this.placeholders = this.setPlaceholders();
			}
		});
	}

	private prepareSubject(wizardConfig: RfqBidderWizardConfig): string {
		const foundSubjectNamingParam = wizardConfig.namingParameter.find(item => item.NamingType === 1);
		const subjectPattern = foundSubjectNamingParam ? foundSubjectNamingParam.Pattern : '';
		let subject = this.namingConstantService.resolveName(subjectPattern);

		if (!subject) {
			switch (this.wizardInstanceUuid) {
				case GenericWizardUseCaseUuid.RfqBidder:
					subject = this.prepareDefaultSubjectForRfq(wizardConfig);
					break;
				case GenericWizardUseCaseUuid.ContractConfirm:
					subject = this.prepareDefaultSubjectForContract(wizardConfig);
					break;
			}
		}
		return subject;
	}

	private prepareCoverLetters(): void {
		switch (this.wizardInstanceUuid) {
			case GenericWizardUseCaseUuid.RfqBidder:
				this.coverLetters = this.wizardConfigService.getService(RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER).getList();
				break;
			case GenericWizardUseCaseUuid.ContractConfirm:
				this.coverLetters = this.wizardConfigService.getService(ContractConfirmWizardContainers.CONTRACT_CONFIRM_COVER_LETTER).getList(); break;
		}

		if (!this.coverLetters.some(item => item.isIncluded)) {
			this.coverLetters.forEach(coverLetter => coverLetter.isIncluded = coverLetter.IsDefault);
		}
	}

	private prepareDefaultSubjectForRfq(wizardConfig: RfqBidderWizardConfig): string {
		const subject: string = this.translateService.instant('cloud.desktop.moduleDisplayNameRfQ').text;
		const project = wizardConfig.project;
		const rfqDescription = wizardConfig.prcInfo.Rfq[0].Description;

		return this.setSubjectGeneric(subject, project, rfqDescription);
	}

	private prepareDefaultSubjectForContract(wizardConfig: RfqBidderWizardConfig): string {
		const subject: string = this.translateService.instant('cloud.desktop.moduleDisplayNameContract').text;
		const project = wizardConfig.project;
		const contractDescription = wizardConfig.prcInfo.Contract[0].Description;
		return this.setSubjectGeneric(subject, project, contractDescription);
	}

	private setSubjectGeneric(subject: string, project: RfqWizardProject, description?: string) {
		if (!project && description) {
			subject += ': ' + description;
			return subject;
		}

		let subjectPropertyArray = [];
		subjectPropertyArray.push(project.ProjectName);
		subjectPropertyArray.push(project.ProjectNo);
		subjectPropertyArray.push(description);
		subjectPropertyArray = subjectPropertyArray.filter(item => item !== undefined);

		subjectPropertyArray.forEach((item, index) => {
			if (index === 0) {
				subject += ': ';
			} else {
				subject += ' - ';
			}
			subject += item;
		});

		return subject;
	}

	private setPlaceholders(): Record<string, string | number | (() => number)> {
		const config = this.wizardConfigService.getWizardConfig();
		const entityId = config.startEntityId;
		let placeholders: Record<string, string | number | (() => number)> = {};
		switch (this.wizardInstanceUuid) {
			case GenericWizardUseCaseUuid.RfqBidder: {
				const wizardService = this.wizardConfigService;
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