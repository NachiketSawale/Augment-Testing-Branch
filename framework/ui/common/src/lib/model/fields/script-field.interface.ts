/*
 * Copyright(c) RIB Software GmbH
 */


import {FieldType} from './field-type.enum';
import {IAdditionalScriptOptions} from './additional/additional-script-options.interface';
import {IField} from './field.interface';

/**
 * The definition of a field that represents a *code* input control.
 *
 * @group Fields API
 */
export interface IScriptField<T extends object> extends IField<T>, IAdditionalScriptOptions {

	/**
	 * The type of the row.
	 */
	type: FieldType.Script;
}

