/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectCalendarComplete } from './project-calendar-complete.interface';
import { IProjectCalendarEntity, IProjectComplete } from '@libs/project/interfaces';


/**
 * Material group attribute complete interface
 */
export interface IProjectCalendarParentComplete extends IProjectComplete {
	ProjectCalendarToSave?: IProjectCalendarComplete[];
	ProjectCalendarToDelete?: IProjectCalendarEntity[];
}