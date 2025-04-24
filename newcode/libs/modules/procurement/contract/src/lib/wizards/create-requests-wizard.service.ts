/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
	PlatformDateService,
	PlatformLazyInjectorService,
	PlatformTranslateService,
	ServiceLocator
} from '@libs/platform/common';
import {
	BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER, ICreateRequests,
	ICreateRequestsWizardProvider
} from '@libs/businesspartner/interfaces';
import {FieldType} from '@libs/ui/common';
import {ProcurementContractHeaderDataService} from '../services/procurement-contract-header-data.service';
import {ProcurementContractCertificateDataService} from '../services/procurement-contract-certificate-data.service';

interface ICreateRequestsEntity extends ICreateRequests {
	Id: number;
	Code: string;
	Description?: string | null;
	RelevantDate?: Date;
}

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractCreateRequestsWizardService {
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);
	private readonly contractService = inject(ProcurementContractHeaderDataService);
	private readonly dateService = inject(PlatformDateService);
	private readonly translateService = inject(PlatformTranslateService);

	public async createRequests() {
		const commonService = await this.getCommonCreateRequestsWizardService();
		const contract = this.contractService.getSelectedEntity();
		if (!contract) {
			return;
		}

		return commonService.createRequests<ICreateRequestsEntity>({
			createRequestsEntity: {
				Id: contract.Id,
				Code: contract.Code,
				Description: contract.Description,
				RelevantDate: new Date()
			},
			customFormRows: [
				{
					id: 'composite',
					type: FieldType.Composite,
					label: 'cloud.common.entityReference',
					composite: [
						{
							id: 'Code',
							type: FieldType.Code,
							model: 'Code',
							readonly: true,
						},
						{
							id: 'Description',
							type: FieldType.Description,
							model: 'Description',
							readonly: true,
						}
					]
				},
				{
					id: 'RelevantDate',
					// the label should be translated before. because the token procurement.contract is not in bp's translation pool
					label: this.translateService.instant('procurement.contract.entityRelevantDate').text,
					type: FieldType.DateUtc,
					model: 'RelevantDate',
				},
			],
			creationProvider: (param) => {
				if (param.RelevantDate) {
					this.dateService.formatUTC(param.RelevantDate);
				}
				return {
					url: 'businesspartner/certificate/createrequired/contract',
					params: {
						StatusFk: param.CertificateStatusFk!,
						ConHeaderFk: param.Id,
						RelevantDate: param.RelevantDate ? this.dateService.formatUTC(param.RelevantDate) : ''
					}
				};
			}
		}, () => {
			const certificateService = ServiceLocator.injector.get(ProcurementContractCertificateDataService);
			const parentItem = certificateService.parentService.getSelectedEntity();
			if (!parentItem) {
				return;
			}

			certificateService.load({id: 0, pKey1: parentItem.Id});
		});
	}

	private async getCommonCreateRequestsWizardService(): Promise<ICreateRequestsWizardProvider> {
		return await this.lazyInjector.inject(BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER);
	}
}