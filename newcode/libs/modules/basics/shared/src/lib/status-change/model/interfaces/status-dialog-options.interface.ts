/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDialogOptions, IDialog } from '@libs/ui/common';
import { IStatusChangeOptions } from './status-change-options.interface';
import { IStatusChangeGroup } from './status-change-group.interface';
import { InjectionToken } from '@angular/core';
import { CompleteIdentification } from '@libs/platform/common';

/**
 * Change status dialog options interface.
 */
export interface IChangeStatusDialogOptions<PT extends object, PU extends CompleteIdentification<PT>> extends IDialogOptions<IDialog> {
	/**
	 * status change configure
	 */
	statusChangeConf: IStatusChangeOptions<PT, PU>;

	/**
	 * Entity ids for status change
	 */
	statusGroup: IStatusChangeGroup[];
}

/**
 * injection token of change status dialog options
 */
export const CHANGE_STATUS_DIALOG_OPTIONS = new InjectionToken<IChangeStatusDialogOptions<object, object>>('CHANGE_STATUS_DIALOG_OPTIONS');
