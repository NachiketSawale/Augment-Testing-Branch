/*
 * Copyright(c) RIB Software GmbH
 */

import { IRuleOperatorInfo } from '../representation/rule-operator-info.interface';
import { IRuleOperatorInfoParameter } from '../representation/rule-operator-info-parameter.interface';
import { cloneDeep } from 'lodash';
import { RuleOperand } from './rule-operand.class';
import { IDynamicValueExport, IEnvironmentExpressionExport, IOperandLiteralExport, IOperandPropertyExport } from '../representation/rule-export.interface';
import { IVariableTimePeriod } from '../representation/variable-time-period.interface';

/***
 * The class representing an operator used in expressions
 */
export class ExprOperator {
	private data: IRuleOperatorInfo;
	private operands: RuleOperand[] = [];
	private variablePeriodData: IVariableTimePeriod | undefined = undefined;

	/***
	 * constructor
	 * @param operatorInfo
	 */
	public constructor(operatorInfo: IRuleOperatorInfo) {
		this.data = operatorInfo;
	}

	/***
	 * gets the internal id
	 */
	public get internalId(): number {
		return this.data.IntId;
	}

	/***
	 * gets the string id
	 */
	public get stringId(): string {
		return this.data.StringId;
	}

	/***
	 * gets the condition fk
	 */
	public get conditionTypeFk(): number {
		return this.data.ConditionTypeFk;
	}

	/***
	 * gets the display name
	 */
	public get displayName(): string {
		return this.data.DisplayName;
	}

	/***
	 * flag onlyForNullable
	 */
	public get onlyForNullable(): boolean | undefined {
		return this.data.OnlyForNullable;
	}

	/***
	 * gets the uiTypes
	 */
	public get uiTypes(): string [] | null {
		return this.data.UiTypes;
	}

	/***
	 * gets the parameters
	 */
	public get parameters(): IRuleOperatorInfoParameter[] | undefined {
		if (this.data.Parameters) {
			return cloneDeep(this.data.Parameters);
		}

		return undefined;
	}

	/***
	 * set operands
	 * @param operands
	 */
	public setOperands(operands: RuleOperand[]) {
		this.operands = operands;
	}

	/***
	 * get operands
	 */
	public getOperands() {
		return this.operands;
	}

	/***
	 * set the variable period data
	 * @param variablePeriodData
	 */
	public setVariablePeriodData(variablePeriodData: IVariableTimePeriod | undefined) {
		this.variablePeriodData = variablePeriodData;
	}

	/***
	 * returns the exported structure
	 * @param selectedField
	 */
	public export(selectedFieldId?: string) {
		if (!selectedFieldId) {
			return [];
		}

		const operandLiterals = this.exportOperandLiterals();

		return [
			{
				DdProperty: {
					Path: selectedFieldId.toString()
				}
			},
			...operandLiterals,
			...this.exportVariableTimePeriod()
		];
	}

	private exportVariableTimePeriod() {
		if (this.variablePeriodData) {
			const dynamicValueExports: IDynamicValueExport[] = [
				{
					DynamicValue: {
						Parameters: [
							{
								Literal: {
									Integer: this.variablePeriodData.lowerBound
								}
							}
						],
						Transformation: this.variablePeriodData.transformation
					}
				}, {
					DynamicValue: {
						Parameters: [
							{
								Literal: {
									Integer: this.variablePeriodData.upperBound
								}
							}
						],
						Transformation: this.variablePeriodData.transformation
					}
				}
			];

			return dynamicValueExports;
		}

		return [];
	}

	private exportOperandLiterals(): (IOperandLiteralExport | IOperandPropertyExport | IEnvironmentExpressionExport)[] {
		const literalExports: (IOperandLiteralExport | IOperandPropertyExport | IEnvironmentExpressionExport)[] = [];
		this.getOperands().forEach(operand => {
			const literalExport = operand.exportLiteral();
			if (literalExport) {
				literalExports.push(literalExport);
			}
		});
		return literalExports;
	}
}