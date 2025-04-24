/*
 * Copyright(c) RIB Software GmbH
 */

import { IEnvExprInfo } from './env-expr-info.interface';

/***
 * Represents the rule operand type (i.e. Field, Value, etc)
 */
export interface IRuleOperandType {
	/***
	 * The string identifier
	 */
	stringId: string;

	/***
	 * The display text
	 */
	displayName: string;

	/***
	 * Flag isRange.
	 * true => preset operand represents a range. other operand is hidden or made readonly
	 */
	isRange?: boolean;

	/***
	 * Flag variableTimePeriod. Special for the first operand of between and !between operators
	 */
	variableTimePeriod?: boolean;

	/***
	 * Environment Expression info
	 */
	environmentExpression?: IEnvExprInfo;
}