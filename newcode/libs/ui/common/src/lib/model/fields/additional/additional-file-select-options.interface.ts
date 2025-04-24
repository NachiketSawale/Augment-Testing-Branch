/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TemplateRef } from '@angular/core';
import { IFileSelectOptions } from './file-select-options.interface';

/**
 * Defines additional options for file selection fields.
 *
 * @group Fields API
 */
export interface IAdditionalFileSelectOptions {
	/**
	 * An options object with settings for the file select input control.
	 */
	options?: IFileSelectOptions;

	/**
	 * Provides required context to build toolbar items
	 */
	customTemplate?: TemplateRef<Element>;
}