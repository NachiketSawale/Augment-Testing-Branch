/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Input } from '@angular/core';
import { IRuleOperandType } from '../../model/representation/rule-operand-type.interface';

/***
 * Displays an Environment Expression. Only shows the name of the expression
 */
@Component({
  selector: 'ui-common-environment-expression',
  templateUrl: './environment-expression.component.html',
  styleUrls: ['./environment-expression.component.css']
})
export class EnvironmentExpressionComponent {
	/***
	 * the selected operand type
	 */
	@Input()
	public operandType?: IRuleOperandType;
}
