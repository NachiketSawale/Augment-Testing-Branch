/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslatable } from '@libs/platform/common';

/**
 * Generic wizard naming parameters
 */
export type GenericWizardNamingParameter = {
	id: number;
	name: string;
	nameTr: ITranslatable;
	pattern: string;
};