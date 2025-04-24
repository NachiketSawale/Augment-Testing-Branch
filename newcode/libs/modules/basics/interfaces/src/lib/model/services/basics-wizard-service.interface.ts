/*
 * Copyright(c) RIB Software GmbH
 */
import { Dictionary, IInitializationContext } from '@libs/platform/common';

export interface IBasicsWizardService {
	/**
	 * Executes the wizard.
	 */
	execute(context: IInitializationContext, wizardParameters?: Dictionary<string, unknown>): Promise<void> | undefined;
}

export interface IBasicsChangeCertificateStatusWizardService extends IBasicsWizardService {
}


