/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IProjectCalendarEntity } from '@libs/project/interfaces';

/**
 * Material group attribute complete interface
 */
export interface IProjectCalendarComplete extends CompleteIdentification<IProjectCalendarEntity> {
	Id?: number;
}