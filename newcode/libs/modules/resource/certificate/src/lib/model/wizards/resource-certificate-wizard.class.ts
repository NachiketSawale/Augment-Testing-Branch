/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { ResourceCertificateWizardService } from '../../services/wizards/resource-certificate-wizard.service';

/**
 *
 * This class provides functionality for resource certificate wizards
 */
export class ResourceCertificateWizard {
	/**
	 * This method provides functionality to change the certificate record status
	 */
	public changeCertificateStatus(context: IInitializationContext) {
		const service = context.injector.get(ResourceCertificateWizardService);
		service.onStartChangeStatusWizard();
	}




}