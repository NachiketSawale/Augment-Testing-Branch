/*
 * Copyright(c) RIB Software GmbH
 */

import { IInputConfig } from './input-config.interface';

/**
 * Extends the IInputConfig interface to include additional properties for text input configuration.
 */
export interface ITextInputTextConfig extends IInputConfig {
	/**
	 * The pattern that the text input must match.
	 */
	pattern?: string;

	/**
	 * The maximum length of the text input.
	 */
	maxlength?: number;

	/**
	 * The minimum length of the text input.
	 */
	minlength?: number;
}