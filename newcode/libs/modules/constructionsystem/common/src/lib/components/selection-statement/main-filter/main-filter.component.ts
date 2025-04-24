/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnInit } from '@angular/core';
import { ItemType } from '@libs/ui/common';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { SELECTION_STATEMENT_OPTION_TOKEN } from '../../../model/entities/selection-statement/option.interface';
import { SelectionStatementSearchType } from '../../../model/enums/selection-statement-search-type.enum';
import { SelectionStatementFilterScope } from '../../../model/selection-statement-filter-scope';
import { ConstructionSystemCommonPropertyNameLookupService } from '../../../service/lookup/constuction-system-common-property-name-lookup.service';
import { ISelectStatementEntity } from '../../../model/entities/selection-statement/selection-statement-entity.interface';

@Component({
	selector: 'constructionsystem-common-main-filter',
	templateUrl: './main-filter.component.html',
	styleUrls: ['./main-filter.component.scss'],
})
export class CosCommonSelectionStatementComponent<T extends ISelectStatementEntity> extends EntityContainerBaseComponent<T> implements OnInit {
	private readonly option = inject(SELECTION_STATEMENT_OPTION_TOKEN);
	/**
	 * Scope,  all subcomponents have their own scope
	 */
	protected simpleFilterScope: SelectionStatementFilterScope = new SelectionStatementFilterScope(this.option.parentServiceToken);
	protected propertyFilterScope: SelectionStatementFilterScope = new SelectionStatementFilterScope(this.option.parentServiceToken);
	protected enhancedFilterScope: SelectionStatementFilterScope = new SelectionStatementFilterScope(this.option.parentServiceToken);
	protected expertFilterScope: SelectionStatementFilterScope = new SelectionStatementFilterScope(this.option.parentServiceToken);
	private readonly constructionSystemCommonPropertyNameLookupService = inject(ConstructionSystemCommonPropertyNameLookupService);
	protected searchType: SelectionStatementSearchType = SelectionStatementSearchType.Simple;

	public constructor() {
		super();

		this.entitySelection.selectionChanged$.subscribe(() => {
			if (this.option.selectionChangeFn) {
				this.option.selectionChangeFn();
			}
			this.onSelectionChanged();
		});
	}

	public ngOnInit(): void {
		this.updateTools();
		this.onSelectionChanged();
	}

	private onSelectionChanged() {
		const entity = this.entitySelection.getSelectedEntity();
		if (entity) {
			entity.OriginalSelectionStatement = entity.SelectStatement;
			if (!entity.SelectStatement) {
				this.searchType = SelectionStatementSearchType.Simple;
			} else {
				const filterDto = JSON.parse(entity.SelectStatement);
				this.searchType = filterDto.filterType;
			}
		}
	}

	private updateTools() {
		if (this.option.showExecute) {
			this.uiAddOns.toolbar.addItems([
				{
					id: 'execute',
					caption: 'constructionsystem.common.caption.execute',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-filter',
					disabled: () => {
						return this.entitySelection.getSelection().length === 0;
					},
					fn: () => {
						if (this.option.showExecute && this.option.executeFn) {
							this.option.executeFn();
						}
					},
				},
			]);
		}
		this.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'constructionsystem.main.radioGroupCaption', text: 'radio group caption' },
				hideItem: false,
				iconClass: 'filter',
				id: 'filter',
				type: ItemType.Sublist,
				list: {
					cssClass: 'radio-group',
					activeValue: this.searchType,
					showTitles: true,
					items: [
						{
							id: 'googleSearch',
							caption: 'constructionsystem.common.caption.simple',
							type: ItemType.Radio,
							value: SelectionStatementSearchType.Simple,
							iconClass: 'tlb-icons ico-sdb-search1',
							fn: (info) => {
								this.setSearchType(SelectionStatementSearchType.Simple);
							},
						},
						{
							id: 'propertySearch',
							caption: 'constructionsystem.common.caption.property',
							type: ItemType.Radio,
							value: SelectionStatementSearchType.Property,
							iconClass: 'tlb-icons ico-sdb-search2',
							fn: () => {
								this.setSearchType(SelectionStatementSearchType.Property);
							},
						},
						{
							id: 'enhancedSearch',
							caption: 'constructionsystem.common.caption.enhanced',
							type: ItemType.Radio,
							value: SelectionStatementSearchType.Enhanced,
							iconClass: 'tlb-icons ico-criteria-search',
							fn: () => {
								this.setSearchType(SelectionStatementSearchType.Enhanced);
							},
						},
						{
							id: 'expertSearch',
							caption: 'constructionsystem.common.caption.expert',
							type: ItemType.Radio,
							value: SelectionStatementSearchType.Expert,
							iconClass: 'tlb-icons ico-sdb-search3',
							fn: () => {
								this.setSearchType(SelectionStatementSearchType.Expert);
							},
						},
					],
				},
			},
		]);
	}

	private setSearchType(type: SelectionStatementSearchType) {
		this.searchType = type;
	}

	protected isSimpleFilter() {
		return this.searchType === SelectionStatementSearchType.Simple;
	}

	protected isPropertyFilter() {
		return this.searchType === SelectionStatementSearchType.Property;
	}

	protected isEnhancedFilter() {
		return this.searchType === SelectionStatementSearchType.Enhanced;
	}

	protected isExpertFilter() {
		return this.searchType === SelectionStatementSearchType.Expert;
	}

	/**
	 * Destroy
	 */
	public OnDestroy(): void {
		this.constructionSystemCommonPropertyNameLookupService.setCurrentModelId(undefined);
	}
}
