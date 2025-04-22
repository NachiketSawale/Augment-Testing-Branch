/*
 * Copyright(c) RIB Software GmbH
 */

import {ICreateRequests, ICreateRequestsOptions} from './create-requests.interface';
import {LazyInjectionToken} from '@libs/platform/common';

export interface ICreateRequestsWizardProvider {
	createRequests<T extends ICreateRequests>(options: ICreateRequestsOptions<T>, afterCreated?: () => void): Promise<void>;
}

export const BUSINESSPARTNER_CERTIFICATE_CREATE_REQUESTS_WIZARD_PROVIDER =
	new LazyInjectionToken<ICreateRequestsWizardProvider>('businesspartner-certificate-create-requests-wizard-provider');