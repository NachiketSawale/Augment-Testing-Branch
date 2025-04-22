/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BusinesspartnerMainCertificateDataService } from '../certificate-data.service';
import { BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD, IBusinessPartnerEntity, IChangeCertificateStatusWizardOptions } from '@libs/businesspartner/interfaces';
import { BusinessPartnerEntityComplete } from '../../model/entities/businesspartner-entity-complete.class';
import { IBasicsChangeCertificateStatusWizardService } from '@libs/basics/interfaces';
import { IInitializationContext } from '@libs/platform/common';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';

@Injectable({
	providedIn: 'root'
})
/**
 * Change Certificate Status wizard service
 */
export class ChangeCertificateStatusService implements IBasicsChangeCertificateStatusWizardService {
	public async execute(context: IInitializationContext) {
		const options: IChangeCertificateStatusWizardOptions<IBusinessPartnerEntity, BusinessPartnerEntityComplete> = {
			title: 'businesspartner.main.certificateStatusTitle',
			guid: '538325604b524f328fdf436fb14f1fc8',
			dataService: context.injector.get(BusinesspartnerMainCertificateDataService),
			rootDataService: context.injector.get(BusinesspartnerMainHeaderDataService),
		};
		const statusService = await context.lazyInjector.inject(BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD);
		return statusService.changeCertificateStatus<IBusinessPartnerEntity, BusinessPartnerEntityComplete>(options);
	}
}