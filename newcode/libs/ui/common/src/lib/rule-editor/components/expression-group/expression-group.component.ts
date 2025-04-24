/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ExpressionGroup } from '../../model/data/expression-group.class';
import { IRuleConfiguration } from '../../model/representation/rule-configuration.interface';
import { FieldType } from '../../../model/fields/field-type.enum';
import { IAdditionalSelectOptions } from '../../../model/fields/additional/additional-select-options.interface';
import { Expression } from '../../model/data/expression.class';
import { RuleEditorManagerService } from '../../services/rule-editor-manager.service';
import { PropertyType } from '@libs/platform/common';

/**
 * Displays a single nestable group in an expression tree.
 */
@Component({
	selector: 'ui-common-expression-group',
	templateUrl: './expression-group.component.html',
	styleUrls: ['./expression-group.component.scss']
})
export class ExpressionGroupComponent implements OnInit{

	private ruleOperatorManager = inject(RuleEditorManagerService);

	/**
	 * Gets or sets the group to display in the component.
	 */
	@Input()
	public data?: ExpressionGroup;

	/**
	 * Gets or sets a complete configuration object.
	 */
	@Input()
	public configuration?: IRuleConfiguration;

	/***
	 * Expression Group removed event emitter
	 */
	@Output()
	public $expressionGroupRemoved: EventEmitter<ExpressionGroup> = new EventEmitter<ExpressionGroup>();

	/***
	 * The operator list select options
	 */
	public groupOperatorsListSelectOptions: IAdditionalSelectOptions<number> = {
		itemsSource: {
			items: []
		}
	};


	protected readonly FieldType = FieldType;

	/***
	 * Creates a new child Expression Group
	 */
	public createNewGroup() {
		this.data?.createNewGroup();
	}

	/***
	 * Creates a new child Expression
	 */
	public createNewExpression() {
		this.data?.createNewExpression();
	}

	/***
	 * Remove self button click handler
	 */
	public onRemoveSelfClicked() {
		this.$expressionGroupRemoved.emit(this.data);
	}

	/***
	 * returns true if supplied item is of type ExpressionGroup
	 * @param item
	 */
	public isExpressionGroup(item: ExpressionGroup | Expression) {
		return item instanceof ExpressionGroup;
	}

	/***
	 * cast parameter to Expression or undefined
	 * @param item
	 */
	public tryCastToExpression(item: Expression | ExpressionGroup): Expression | undefined {
		return (this.isExpressionGroup(item)) ? undefined : item as Expression;
	}

	/***
	 * cast parameter to ExpressionGroup or undefined
	 * @param item
	 */
	public tryCastToExpressionGroup(item: Expression | ExpressionGroup): ExpressionGroup | undefined {
		return (this.isExpressionGroup(item)) ? item as ExpressionGroup : undefined;
	}

	/***
	 * child Expression or ExpressionGroup remove handler
	 * @param expression
	 */
	public childRemoved(expression?: Expression|ExpressionGroup) {
		this.data?.removeChild(expression);
	}

	/***
	 * Group operator (i.e. Match All, Match Any) select handler
	 * @param operator
	 */
	public selectGroupOperatorOption(operator: PropertyType) {
		console.log(operator);
		if(this.data) {
			const groupOperator = this.ruleOperatorManager.getGroupOperatorById(operator as number);
			if(groupOperator){
				this.data.onGroupOperatorChange(groupOperator);
			}
		}
	}

	/***
	 * on init handler
	 */
	public ngOnInit(): void {
		if(this.ruleOperatorManager.getGroupOperators().length > 0) {
			this.createGroupOperatorOptions();
		} else {
			this.ruleOperatorManager.loadData().subscribe(()=>{
				this.createGroupOperatorOptions();
			});
		}
	}

	/***
	 * populate group operator options
	 * @private
	 */
	private createGroupOperatorOptions() {
		this.groupOperatorsListSelectOptions.itemsSource.items.splice(0, this.groupOperatorsListSelectOptions.itemsSource.items.length);
		this.ruleOperatorManager.getGroupOperators().forEach(operator => {
			this.groupOperatorsListSelectOptions.itemsSource.items.push({ id: operator.internalId, displayName: operator.displayName});
		});
		this.selectGroupOperatorOption(this.groupOperatorsListSelectOptions.itemsSource.items[0].id);
	}


}
