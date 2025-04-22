/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { CompleteIdentification, LazyInjectable, ServiceLocator } from '@libs/platform/common';
import { BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD, IChangeCertificateStatusWizardOptions } from '@libs/businesspartner/interfaces';
import { ChangeCertificateStatusService } from './change-certificate-status.service';

@Injectable({
	providedIn: 'root'
})
@LazyInjectable({
	token: BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD,
	useAngularInjection: true,
})
/**
 * Change Certificate Status wizard service
 */
export class ChangeCertificateStatusWizardService {
	public changeCertificateStatus<PT extends object, PU extends CompleteIdentification<PT>>(options: IChangeCertificateStatusWizardOptions<PT, PU>): Promise<void> {
		const service = ServiceLocator.injector.get(ChangeCertificateStatusService<PT, PU>);
		service.onStartChangeStatusWizard.bind(service);
		return service.onStartChangeStatusWizard(options);
	}
}