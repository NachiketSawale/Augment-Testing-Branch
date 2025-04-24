/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input, OnChanges } from '@angular/core';
import { ExprOperator } from '../../model/data/expr-operator.class';
import { IRuleOperandType } from '../../model/representation/rule-operand-type.interface';
import { RuleOperand } from '../../model/data/rule-operand.class';
import { IVariableTimePeriod } from '../../model/representation/variable-time-period.interface';
import { IDdStateConfig } from '../../model/representation/dd-state-config.interface';


/***
 * Displays an operator
 */
@Component({
  selector: 'ui-common-expression-operator',
  templateUrl: './expression-operator.component.html',
  styleUrls: ['./expression-operator.component.css']
})
export class ExpressionOperatorComponent implements OnChanges{
	/***
	 * The selected operator
	 */
	@Input()
	public operator?: ExprOperator;

	@Input()
	public ddStateConfig?: IDdStateConfig;

	/***
	 * Flag hideSecondOperator. For environment expressions, the operator has 2 operands, 2nd operand is not shown
	 */
	public hideSecondOperator: boolean = false;

	/***
	 * Special flag. true => Variable Time Period component is shown instead of the operands
	 */
	public showVariableTimePeriod: boolean = false;

	/***
	 * The operands of the operator
	 */
	public operands : RuleOperand[] = [];

	/***
	 * Default data for Variable Time Period
	 */
	public variablePeriodData: IVariableTimePeriod = {
		transformation: 1,
		lowerBound: -1,
		upperBound: 1
	};

	/***
	 * On change handler. Resets the operands list and view state
	 */
	public ngOnChanges() {
		if(this.operator) {
			this.operands = this.operator.getOperands();
			this.hideSecondOperator = false;
			this.showVariableTimePeriod = false;
		}
	}

	/***
	 * Operand type (i.e. Field, Value) change handler.
	 * @param operandType
	 */
	public operandTypeChanged(operandType: IRuleOperandType) {
		this.hideSecondOperator = operandType.isRange ?? operandType.variableTimePeriod ?? false;
		this.showVariableTimePeriod = operandType.variableTimePeriod ?? false;
		this.operator?.setVariablePeriodData(this.showVariableTimePeriod ? this.variablePeriodData : undefined);
	}
}
