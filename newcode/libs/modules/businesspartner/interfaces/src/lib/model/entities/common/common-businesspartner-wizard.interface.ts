/*
 * Copyright(c) RIB Software GmbH
 */
import {IInitializationContext} from '@libs/platform/common';

export interface ICommonBusinessPartnerWizard {
	execute: (context: IInitializationContext) => Promise<void>;
}