/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, Input, OnInit, inject } from '@angular/core';
import { ColumnDef, ConcreteMenuItem, FieldType, GridComponent, IFieldValueChangeInfo, IGridConfiguration, ItemType, MenuListContent, UiCommonLookupViewService, UiCommonModule } from '@libs/ui/common';
import { IPrjEstRuleEntity } from '@libs/estimate/interfaces';
import {EstimateRuleRemoveLookupProviderService} from '@libs/estimate/rule';

@Component({
	selector: 'estimate-main-remove-rule-generate-grid',
	standalone: true,
	imports: [UiCommonModule, GridComponent],
	templateUrl: './estimate-main-remove-rule-generate-grid.component.html'
})

/**
 * EstimateMainRemoveRuleGenerateGridComponent is used for Rule Remove Wizard
 */
export class EstimateMainRemoveRuleGenerateGridComponent implements OnInit {

	/**
	 * columns: column configuration for grid.
	 */
	private columns: ColumnDef<IPrjEstRuleEntity>[] = [
		{
			id: 'icon',
			model: 'Icon',
			type: FieldType.Code,
			label: { key: 'cloud.common.entityIcon' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'code',
			model: 'Code',
			type: FieldType.Code,
			label: { key: 'cloud.common.entityCode' },
			visible: true,
			readonly: true,
			sortable: true,
		},
		{
			id: 'desc',
			model: 'DescriptionInfo.Description',
			type: FieldType.Description,
			label: { key: 'cloud.common.entityDescription' },
			visible: true,
			readonly: true,
			sortable: true,
		},
		{
			id: 'comment',
			model: 'Comment',
			type: FieldType.Code,
			label: { key: 'cloud.common.entityComment' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'estevalseqfk',
			model: 'EstEvaluationSequenceFk',
			type: FieldType.Code,
			label: { key: 'estimate.rule.evaluationSequence' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'estruleexecutiontypefk',
			model: 'EstRuleExecutionTypeFk',
			type: FieldType.Integer,
			label: { key: 'estimate.rule.estRuleExecutionType' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'estrubriccatfk',
			model: 'BasRubricCategoryFk',
			type: FieldType.Integer,
			label: { key: 'cloud.common.entityBasRubricCategoryFk' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'operand',
			model: 'Operand',
			type: FieldType.Decimal,
			label: { key: 'cloud.common.operand' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'formfk',
			model: 'FormFk',
			type: FieldType.Code,
			label: { key: 'estimate.rule.userForm' },
			visible: true,
			readonly: true,
			sortable: true
		},
		{
			id: 'formFk',
			model: '',
			label: {
				text: 'formFk'
			},
			type: FieldType.Description,
			required: true,
			visible: true,
			sortable: true,
			searchable: true
		}
	];

	private selectedItem: IPrjEstRuleEntity[] | null = null;

	private columData:IPrjEstRuleEntity[]=[];

	/**
	 * gridConfig: stores configuration for grid.
	 */
	@Input()
	public gridConfig: IGridConfiguration<IPrjEstRuleEntity>;


	public constructor() {

		this.gridConfig = {
			uuid: '223d60f03cf447ab90aa7044ccaab31d',
			columns: this.columns,
			skipPermissionCheck: true,
			items: []
		};
	}

	public lookupViewService = inject(UiCommonLookupViewService);

	public ngOnInit(): void {
		this.loadToolBar();
		this.gridConfig = {
			uuid: '223d60f03cf447ab90aa7044ccaab31d',
			columns: this.columns,
			skipPermissionCheck: true,
			items: []
		};
	}


	@Input()
	private readonly toolbarContent = new MenuListContent();

	private loadToolBar() {
		this.toolbarContent.addItems(this.toolbarItems());
	}

	//public removeRuleLookupService = inject(EstimateMainRuleRemoveLookupService);
	public removeRuleLookupService = inject(EstimateRuleRemoveLookupProviderService);
	/**
	 * toolbar configuration: stores toolbar configuration for Search Rule grid.
	 */
	private toolbarItems(): ConcreteMenuItem<void>[] {
		return [
			{
				caption: { key: 'cloud.common.taskBarNewRecord' },
				iconClass: 'control-icons ico-input-add',
				hideItem: false,
				id: 'create',
				sort: 1,
				type: ItemType.Item,
				fn: this.addRule,
				disabled: false
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'tlb-icons ico-rec-delete',
				hideItem: false,
				id: 'delete',
				sort: 2,
				type: ItemType.Item,
				fn: function () {
					//TODO: waiting for grid refresh
				},
				disabled: function () {

					return true;
				},

			}
		];
	}

	/**
	 * Add Rules to wizard's grid
	 */
	private addRule = (): void => {
		this.lookupViewService.showDialog(this.removeRuleLookupService!)?.then((result) => {
			if( result && result.value && result.value.result){
				//this.columData.push(result.value.result as unknown as IPrjEstRuleEntity);
				this.gridConfig.items = [result.value.result as unknown as IPrjEstRuleEntity];
			}
		});
	};

		/**
	 * Event triggered on change of selection in the grid.
	 * @param event
	 */
		public selectionChanged = (event: IPrjEstRuleEntity[]) => {
			this.selectedItem = event;
		};

		/**
	 * Event triggered on change of selected item's value.
	 * @param event
	 */
	public valueChanged = (event: IFieldValueChangeInfo<IPrjEstRuleEntity>) => {
		if(this.gridConfig.items) {
			this.gridConfig = {...this.gridConfig.columns, items: this.columData};
		}
	};

	public get toolbarData() {
		return this.toolbarContent.items;
	}


}
