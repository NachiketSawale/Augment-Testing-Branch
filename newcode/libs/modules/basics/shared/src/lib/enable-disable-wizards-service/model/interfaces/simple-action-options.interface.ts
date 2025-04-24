/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { IDialog, IDialogOptions } from '@libs/ui/common';

/**
 * Accordion options
 * @typeParam T - entity type handled by the data service
 */
export interface ISimpleActionOptions<TEntity> extends IDialogOptions<IDialog<void>>{

	/**
	 * Translation key for header text
	 */
	headerText: string;
	/**
	 * Translation key for question message
	 */
	questionMsg: string;
	/**
	 * Translation key for message when simple action done
	 */
	doneMsg: string;
	/**
	 * Translation key for message when no need to do simple action
	 */
	nothingToDoMsg: string;
	/**
	 * code field in question enable/disable selection dialog
	 */
	codeField: keyof TEntity;
	/**
	 * placeholder in done dialog
	 */
	placeholder?: Translatable;
}


