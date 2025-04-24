/*
 * Copyright(c) RIB Software GmbH
 */

import { Expression } from './expression.class';
import { IRuleExport } from '../representation/rule-export.interface';
import { ExprOperator } from './expr-operator.class';

/**
 * Represents a group of expressions.
 */
export class ExpressionGroup {

	private children: (Expression | ExpressionGroup)[] = [];
	public selectedGroupOperator?: ExprOperator;
	private isRoot: boolean = false;

	/**
	 * Create a new child ExpressionGroup
	 */
	public createNewGroup() {
		const newGroup = new ExpressionGroup();
		this.children.push(newGroup);
	}

	/**
	 * Create a new child Expression
	 */
	public createNewExpression() {
		const newExpression = new Expression();
		this.children.push(newExpression);
	}

	/**
	 * Gets the children list
	 */
	public getItems() {
		return this.children;
	}

	/**
	 * Removes a child Expression or Expression Group
	 * @param child
	 */
	public removeChild(child?: Expression|ExpressionGroup) {
		if (child && this.children.includes(child)) {
			this.children.splice(this.children.indexOf(child), 1);
		}
	}

	/**
	 * on Group operator change (Match All, Match Any...) from UI
	 * @param groupOperator
	 */
	public onGroupOperatorChange(groupOperator: ExprOperator) {
		this.selectedGroupOperator = groupOperator;
	}

	/**
	 * Get exported condition for the Expression Group
	 */
	public export() {
		const childrenExports: IRuleExport[] = [];
		if(this.children.length === 0) {
			throw new Error('Group does not have any expression');
		}
		this.children.forEach(child => {
			childrenExports.push(child.export());
		});
		const exportValue:IRuleExport = {
			Children: childrenExports,
			Context: {},
			Operands: [], // match all or match any
			Id: 1,
			Description: 'Group ' + (this.isRoot? '' : '0'),
			ConditionFk: 1,
			ConditionFktop: 1,
			ConditiontypeFk: this.selectedGroupOperator?.conditionTypeFk ?? -1,
			EntityIdentifier: null,
			OperatorFk: this.selectedGroupOperator?.internalId ?? -1,
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

		return exportValue;

	}

	private setInsertedAtToExport(item: IRuleExport, insertDate: string) {
		item.InsertedAt = insertDate;
		if(item.Children) {
			item.Children.forEach(child => this.setInsertedAtToExport(child, insertDate));
		}
	}

	/**
	 * Export root expression group to format used to perform search
	 */
	public exportRootExpressionGroup() {
		const conditions = this.export();
		const insertedAt = new Date().toISOString();
		this.setInsertedAtToExport(conditions, insertedAt);
		return {
			Conditions: [
				conditions
			],
			Version: 1
		};
	}

	/**
	 * Set as root expression group
	 */
	public setAsRootExpressionGroup() {
		this.isRoot = true;
	}
}