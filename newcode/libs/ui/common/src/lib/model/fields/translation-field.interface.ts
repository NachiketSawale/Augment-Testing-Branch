/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField } from './field.interface';
import { FieldType } from './field-type.enum';

/**
 * The definition of a field that represents a *translation* input control.
 *
 * @group Fields API
 */
export interface ITranslationField<T extends object> extends IField<T> {
	/**
	 * The type of the row.
	 */
	type: FieldType.Translation;
}
