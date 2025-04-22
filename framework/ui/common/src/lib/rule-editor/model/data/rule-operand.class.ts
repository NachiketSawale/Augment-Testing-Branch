/*
 * Copyright(c) RIB Software GmbH
 */

import { IEnvironmentExpressionExport, IOperandLiteralExport, IOperandPropertyExport } from '../representation/rule-export.interface';
import { PropertyType } from '@libs/platform/common';
import { IRuleOperatorInfoParameter } from '../representation/rule-operator-info-parameter.interface';
import { IRuleOperandType } from '../representation/rule-operand-type.interface';
import { IEnvExprInfo } from '../representation/env-expr-info.interface';

/**
 * Represents an Operand for Rule Operators
 */
export class RuleOperand {
	public operandType?: IRuleOperandType;
	public value?: PropertyType;
	public operandEntityFieldId?: string;
	public environmentExpression?: IEnvExprInfo;
	public ruleUiType: string;
	private parameter?: IRuleOperatorInfoParameter;

	/**
	 * Constructor
	 * @param uiType
	 * @param parameter
	 */
	public constructor(uiType: string, parameter?: IRuleOperatorInfoParameter) {
		this.ruleUiType = uiType;
		this.parameter = parameter;
	}

	/**
	 * Get placeholder text
	 */
	public getPlaceholderText() {
		return this.parameter?.DisplayText ?? '';
	}

	/**
	 * Gets literal export object
	 */
	public exportLiteral(): IOperandLiteralExport | IOperandPropertyExport | IEnvironmentExpressionExport | undefined {

		if(this.environmentExpression) {
			return {
				EnvironmentExpression: {
					kind: this.environmentExpression.Kind,
					id: this.environmentExpression.Id
				}
			} as IEnvironmentExpressionExport;
		}

		if(this.operandType && this.operandType.stringId === 'field') {

			if(!this.operandEntityFieldId) {
				throw new Error('Field is not selected');
			}

			return {
				DdProperty: {
					Path: this.operandEntityFieldId
				}
			} as IOperandPropertyExport;
		}

		if (!this.value) {
			return undefined;
		}

		// const keyName = this.getKeyName(this.ruleUiType.toString());
		//
		// if (!keyName) {
		// 	return undefined;
		// }

		return {
			Literal: {
				[this.ruleUiType]: this.value.toString()
			}
		} as IOperandLiteralExport;
	}


}