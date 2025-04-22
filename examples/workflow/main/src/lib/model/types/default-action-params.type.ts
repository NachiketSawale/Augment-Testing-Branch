/*
 * Copyright(c) RIB Software GmbH
 */

import { PropertyType } from '@libs/platform/common';
import { ParameterType } from '../enum/action-editors/parameter-type.enum';

/**
 * Configuration for setting default values to action parameters.
 */
export type ActionParamDefaultValueConfig = { actionParamKey: string, parameterType: ParameterType, value: PropertyType }[];