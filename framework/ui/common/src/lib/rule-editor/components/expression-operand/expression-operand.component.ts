/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { RuleOperand } from '../../model/data/rule-operand.class';
import { FieldType } from '../../../model/fields/field-type.enum';
import { DomainControlHostComponent } from '../../../domain-controls/components/domain-control-host/domain-control-host.component';
import { ExprOperator } from '../../model/data/expr-operator.class';
import { IRuleOperandType } from '../../model/representation/rule-operand-type.interface';
import { RuleEditorManagerService } from '../../services/rule-editor-manager.service';
import { SchemaGraphNode } from '../../model/schema-graph-node/schema-graph-node.class';
import { IDropDownButtonData, IItems } from '../../../components/dropdown-button/model/interfaces/dropdown-button.model';
import { IDdStateConfig } from '../../model/representation/dd-state-config.interface';

/***
 * Displays an operand
 */
@Component({
	selector: 'ui-common-expression-operand',
	templateUrl: './expression-operand.component.html',
	styleUrls: ['./expression-operand.component.scss']
})
export class ExpressionOperandComponent implements OnInit{

	/***
	 * The input operand
	 */
	@Input()
	public inputOperand!: RuleOperand;

	/***
	 * The index of the operand in the operator
	 */
	@Input()
	public operandIndex!: number;

	/***
	 * The parent operator
	 */
	@Input()
	public operator?: ExprOperator;

	/***
	 * operand type (i.e. Field, Value, etc) change event
	 */
	@Output()
	public $operandTypeSelected = new EventEmitter<IRuleOperandType>();

	/***
	 * the DomainControlHostComponent for operand type Value
	 */
	@ViewChild('domainControlHostComponent')
	public domainHost!: DomainControlHostComponent<FieldType.Dynamic>;

	@Input()
	public ddStateConfig?: IDdStateConfig;

	/***
	 * Flag initialized
	 */
	public initialized: boolean = false;

	protected selectedOperandType?: IRuleOperandType;

	protected FieldType = FieldType;

	private operandTypes: IRuleOperandType[] = [];

	private operandTypeDropdownItems: IItems[] = [];
	private operandTypeDropdownItemsMap = new Map<IRuleOperandType, IItems>();

	private ruleOperatorManager = inject(RuleEditorManagerService);

	/***
	 * on init handler
	 */
	public ngOnInit() {
		this.createOperandTypes();
		this.createOperandTypeDropdownItems();
		this.selectedOperandType = this.operandTypes[0];
		this.initialized = true;
	}

	private createOperandTypes() {
		this.operandTypes = [
			{
				stringId: 'value',
				displayName: 'Value',
			},
			{
				stringId: 'field',
				displayName: 'Field'
			},
			{
				stringId: 'variableTime',
				displayName: 'Variable Time Period',
				variableTimePeriod: true
			}
		];

		const environmentExpressions = this.ruleOperatorManager.getEnvironmentExpressions(this.inputOperand.ruleUiType);
		environmentExpressions.forEach(envExp => {
			const optionItem : IRuleOperandType = {
				stringId: envExp.Id.toString(),
				displayName: envExp.Name,
				isRange: envExp.IsRange,
				environmentExpression: envExp
			};
			this.operandTypes.push(optionItem);
		});
	}

	private createOperandTypeDropdownItems() {
		this.operandTypeDropdownItems  = [];
		this.operandTypes.forEach(operandType => {
			const dropdownItem = this.makeItem(operandType.stringId, operandType.displayName, operandType.environmentExpression?.Kind);
			this.operandTypeDropdownItems.push(dropdownItem);
			//this.operandTypeDropdownItemsMap.set(operandType, dropdownItem);
		});
	}

	/**
	 * Get operand type dropdown menu option
	 */
	public getOperandTypeMenu() : IDropDownButtonData {

		return {
			cssClass: 'btn btn-default block-image control-icons ico-input-mode operand-type-btn',
			showSVGTag: false,
			svgSprite: 'control-icons',
			svgImage: 'ico-input-mode',
			svgCssClass: '',
			list: {
				cssClass: 'dropdown-menu dropdown-menu-left',
				items: this.filteredOperandTypes()
			},
		};
	}

	public makeItem(id: string, caption: string, kind: string | undefined): IItems {
		return {
			id: id,
			captionString: caption,
			type: 'item',
			cssClass: '',
			caption: caption,
			disabled: false,
			fn: () => {
				this.selectOperandType(id, kind);
			}
		};
		//later on need to work on this modaloptions functionality
	}

	private isEqualityOperator() {
		return this.operator?.stringId === 'eq' || this.operator?.stringId === '!eq';
	}

	private isRangeOperator() {
		return this.operator?.stringId === 'between' || this.operator?.stringId === '!between';
	}

	/**
	 * Operand select handler
	 * @param operandType
	 * @param kind
	 */
	public selectOperandType(operandType: string, kind: string | undefined) {
		console.log('selection operand type');
		this.selectedOperandType = this.operandTypes.find(t => t.stringId === operandType && (!t.environmentExpression || t.environmentExpression.Kind === kind) ) ?? this.operandTypes[0];
		this.$operandTypeSelected.emit(this.selectedOperandType);
		if (this.inputOperand) {
			this.inputOperand.operandType = this.selectedOperandType;
			this.inputOperand.environmentExpression = this.selectedOperandType.environmentExpression;
		}
	}

	/***
	 * true => Value operand type is selected. showing domain control
	 */
	public isShowingValueOperand() {
		return this.selectedOperandType?.stringId === 'value';
	}

	/***
	 * true => Field operand type is selected. showing entity field selection
	 */
	public isShowingFieldOperand() {
		return this.selectedOperandType?.stringId === 'field';
	}

	/***
	 * true => an Environment Expression is selected.
	 */
	public isShowingEnvironmentExpressions() {
		return !this.isShowingValueOperand() && !this.isShowingFieldOperand();
	}

	private filteredOperandTypes() {
		const operandTypeIds = new Set(this.getOperandTypes().map(t => t.stringId));
		return this.operandTypeDropdownItems.filter(t => operandTypeIds.has(t.id));
	}

	/***
	 * gets the operand types for selected operator
	 */
	public getOperandTypes() : IRuleOperandType[] {
		console.log(this.operator);

		const displayedOperandTypes = this.operandTypes.filter(t => !t.environmentExpression && !t.variableTimePeriod);


		if(this.operandIndex === 0 && this.isRangeOperator()) {
			displayedOperandTypes.push(...this.operandTypes.filter(t => t.variableTimePeriod));
		}

		let environmentExpressions = this.operandTypes.filter(t => t.environmentExpression);


		// if equalities
		// filter out hide in equalities
		if(this.isEqualityOperator() || (this.operandIndex === 1 && this.isRangeOperator())) {
			environmentExpressions = environmentExpressions.filter(t => !t.isRange);
		}

		displayedOperandTypes.push(...environmentExpressions);

		return displayedOperandTypes;
	}

	/***
	 * returns true if part of a date operator
	 */
	public isDateOperator() {
		console.log(this.inputOperand);
		if(!this.inputOperand) {
			return false;
		}

		return this.inputOperand.ruleUiType === 'date';
	}

	/***
	 * returns the domain control options
	 */
	public getDomainOptions() {
		return undefined;
	}

	/**
	 * Gets the domain control type according to the ruleUiType of input operand
	 */
	public getDomainType() {
		if (!this.inputOperand) {
			return FieldType.Description;
		}

		console.log('rule ui type found ', this.inputOperand.ruleUiType);

		switch (this.inputOperand.ruleUiType) {
			case 'string':
			case 'remarkString':
			case 'translation':
				return FieldType.Description;
			case 'email':
				return FieldType.Email;
			case 'boolean':
				return FieldType.Boolean;
			case 'integer':
			case 'number':
				return FieldType.Integer;
			case 'exchangerate':
				return FieldType.ExchangeRate;
			case 'factor':
				return FieldType.Factor;
			case 'percent':
				return FieldType.Percent;
			case 'money':
				return FieldType.Money;
			case 'quantity':
				return FieldType.Quantity;
			case 'date':
				return FieldType.Date;
			case 'datetime':
				return FieldType.DateTime;
			case 'time':
				return FieldType.Time;
			// case 'reference':
			// 	return FieldType.??;
			case 'lookup':
				return FieldType.Lookup;
			case 'color':
				return FieldType.Color;
			case 'imageselect':
				return FieldType.ImageSelect;
			case 'datetimeutc':
				return FieldType.DateTimeUtc;
			default:
				return FieldType.Description;
		}
	}

	/**
	 * Column select handler for operand type Field
	 * @param node
	 */
	public onSelectColumn(node: SchemaGraphNode) {
		if(this.inputOperand) {
			this.inputOperand.operandEntityFieldId = node.id.toString();
		}
	}

	/***
	 * Value change handler for operand type Value
	 */
	public onValueChange() {
		console.log('test callback');
		this.inputOperand.value = this.domainHost.value;
	}
}
