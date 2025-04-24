/*
 * Copyright(c) RIB Software GmbH
 */

import { IRuleExport } from '../representation/rule-export.interface';
import { ExprOperator } from './expr-operator.class';


/**
 * Represents an individual expression that applies an operation to a number of operands.
 */
export class Expression {
	/**
	 * Selected operator of the Expression
	 */
	public operator?: ExprOperator;

	/**
	 * Selected table field for the Expression
	 */
	public selectedNodeId?: string;

	/**
	 * Gets the exported object
	 */
	public export(): IRuleExport {

		if(!this.selectedNodeId) {
			throw new Error('No field selected');
		}

		if(!this.operator) {
			throw new Error('No operator selected');
		}

		return {
			Children: [],
			Context: {},
			Operands: this.operator?.export(this.selectedNodeId) ?? [],
			Id: -1,
			Description: 'Rule 0',
			ConditionFk: -1,
			ConditionFktop: -1,
			ConditiontypeFk: this.operator?.conditionTypeFk ?? -1,
			EntityIdentifier: null,
			OperatorFk: this.operator?.internalId ?? -1,
			ClobsFk: null,
			InsertedAt: '',
			InsertedBy: 1,
			UpdatedAt: null,
			UpdatedBy: null,
			Version: 1,
			BulkConfigurationEntities: '', // ??
			_ruleEditorInstance: {}, // ??
			$$hashKey: ''
		};
	}
}