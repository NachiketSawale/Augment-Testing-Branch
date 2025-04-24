/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IBasicsChangeCertificateStatusWizardService } from '@libs/basics/interfaces';
import { BasicsSharedWizardFeatureRegisterService } from './basics-shared-wizard-feature-register.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedChangeCertificateStatusWizardRegisterService extends BasicsSharedWizardFeatureRegisterService<IBasicsChangeCertificateStatusWizardService> {
}
