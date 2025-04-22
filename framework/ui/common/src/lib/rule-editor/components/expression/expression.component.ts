/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Expression } from '../../model/data/expression.class';
import { IRuleConfiguration } from '../../model/representation/rule-configuration.interface';
import { IAdditionalSelectOptions } from '../../../model/fields/additional/additional-select-options.interface';
import { RuleEditorManagerService } from '../../services/rule-editor-manager.service';
import { FieldType } from '../../../model/fields/field-type.enum';
import { ExpressionGroup } from '../../model/data/expression-group.class';
import { ExprOperator } from '../../model/data/expr-operator.class';
import { SchemaGraphNode } from '../../model/schema-graph-node/schema-graph-node.class';
import { PropertyType } from '@libs/platform/common';

/**
 * Displays a single expression in an expression tree.
 */
@Component({
	selector: 'ui-common-expression',
	templateUrl: './expression.component.html',
	styleUrls: ['./expression.component.scss'],
})
export class ExpressionComponent {

	private ruleEditorManager = inject(RuleEditorManagerService);
	private availableExpressionOperators: ExprOperator[] = [];

	protected readonly FieldType = FieldType;
	protected selectedOperator?: ExprOperator | undefined;
	protected ruleOperatorsSelectOptions: IAdditionalSelectOptions = {
		itemsSource: {
			items: []
		}
	};

	/**
	 * Expression removed event emitter
	 */
	@Output()
	public $expressionRemoved: EventEmitter<Expression> = new EventEmitter<Expression>();

	/**
	 * Gets or sets the expression to display in the component.
	 */
	@Input()
	public expressionData?: Expression;

	/**
	 * parentExpressionGroup
	 */
	@Input()
	public parentExpressionGroup?: ExpressionGroup;

	/**
	 * Gets or sets a complete configuration object.
	 */
	@Input()
	public configuration?: IRuleConfiguration;

	/**
	 * The selected entity field
	 */
	protected selectedNode?: SchemaGraphNode;

	/**
	 * selectedOperatorId
	 */
	public selectedOperatorId: number = 0;


	private populateAvailableOperatorsSelectOptions() {
		this.ruleOperatorsSelectOptions.itemsSource.items.splice(0, this.ruleOperatorsSelectOptions.itemsSource.items.length);
		this.availableExpressionOperators.forEach(operator => {
			this.ruleOperatorsSelectOptions.itemsSource.items.push({id: operator.internalId, displayName: operator.displayName});
		});
		this.selectOperatorOption(this.ruleOperatorsSelectOptions.itemsSource.items[0].id);
	}

	private setNodeIdToExpressionData(){
		if (this.expressionData && this.selectedNode) {
			this.expressionData.selectedNodeId = this.selectedNode.id.toString();
		}
	}

	/***
	 * on entity field select handler
	 * @param node
	 */
	public onSelectColumn(node: SchemaGraphNode) {
		if(this.selectedNode && this.selectedNode.id === node.id) {
			return;
		}

		this.availableExpressionOperators = this.ruleEditorManager.getAvailableExpressionOperators(node.uiTypeId as string);
		if(!node.isNullable) {
			this.availableExpressionOperators = this.availableExpressionOperators.filter(operator => !operator.onlyForNullable);
		}
		this.populateAvailableOperatorsSelectOptions();
		this.selectedNode = node;
		this.setNodeIdToExpressionData();
	}

	/***
	 * remove self button click handler
	 */
	public onRemoveSelfClicked() {
		this.$expressionRemoved.emit(this.expressionData);
	}

	/***
	 * operator select handler
	 * @param operatorId
	 */
	public selectOperatorOption(operatorId: PropertyType) {
		this.selectedOperator = this.availableExpressionOperators.find(operator => operator.internalId == operatorId);
		this.selectedOperatorId = this.selectedOperator?.internalId ?? 0;
		if (this.expressionData) {
			this.expressionData.operator = this.selectedOperator;
		}
	}
}
