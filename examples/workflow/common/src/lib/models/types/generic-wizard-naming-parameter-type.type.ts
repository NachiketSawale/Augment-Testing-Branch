/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslatable } from '@libs/platform/common';
import { GenericWizardNamingParameterTypeEnum } from '../enum/generic-wizard-naming-parameter-type.enum';

/**
 * Generic wizard naming parameter types.
 */
export type GenericWizardNamingParameterType = Record<GenericWizardNamingParameterTypeEnum, { id: number; titleTr: ITranslatable }>;