/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, LazyInjectionToken } from '@libs/platform/common';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, IEntitySelection } from '@libs/platform/data-access';
import { ICertificateEntity } from '../entities/certificate';


export const BUSINESSPARTNER_CERTIFICATE_CHANGE_CERTIFICATE_STATUS_WIZARD =
	new LazyInjectionToken<IChangeCertificateStatusWizard>('businesspartner-certificate-change-certificate-status-wizard');

export interface IChangeCertificateStatusWizard {
	changeCertificateStatus<PT extends object, PU extends CompleteIdentification<PT>>(options: IChangeCertificateStatusWizardOptions<PT, PU>): Promise<void>;
}

export interface IChangeCertificateStatusWizardOptions<PT extends object, PU extends CompleteIdentification<PT>> {
	/**
	 * Title of the status change dialog
	 */
	title?: string;
	/**
	 * guid of the status change wizard
	 */
	guid?: string;
	/**
	 * the root data service of the module
	 */
	dataService: IEntitySelection<ICertificateEntity>;
	/**
	 * the root data service of the module
	 */
	rootDataService?: DataServiceHierarchicalRoot<PT, PU> | DataServiceFlatRoot<PT, PU>;
}
