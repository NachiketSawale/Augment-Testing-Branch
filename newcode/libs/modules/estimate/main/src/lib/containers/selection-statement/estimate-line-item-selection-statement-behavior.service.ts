/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { inject, Injectable } from '@angular/core';
import { IEstLineItemSelStatementEntity } from '@libs/estimate/interfaces';
import { ItemType, UiCommonMessageBoxService } from '@libs/ui/common';
import { EstimateLineItemSelectionStatementDataService } from './estimate-line-item-selection-statement-data.service';

/**
 * Service to handle behaviors related to estimate line item selection statement
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateLineItemSelectionStatementBehavior implements IEntityContainerBehavior<IGridContainerLink<IEstLineItemSelStatementEntity>, IEstLineItemSelStatementEntity> {
	private readonly messageBoxService = inject(UiCommonMessageBoxService);

	/**
	 * EstimateLineItemSelectionStatementBehavior constructor
	 */
	public constructor(private dataService: EstimateLineItemSelectionStatementDataService) {}

	/**
	 * Method to call when a container is created
	 * @param containerLink
	 */
	public onCreate(containerLink: IGridContainerLink<IEstLineItemSelStatementEntity>): void {
		this.customizeToolbar(containerLink);
	}

	/**
	 * Private method to customize the toolbar with additional items
	 * @param containerLink
	 * @private
	 */
	private customizeToolbar(containerLink: IGridContainerLink<IEstLineItemSelStatementEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems(['create']);
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.taskBarNewRecord' },
				iconClass: 'tlb-icons ico-rec-new',
				hideItem: false,
				id: 'create',
				sort: 1,
				type: ItemType.Item,
				disabled: !this.dataService.IsProjectLoaded,
				fn: () => {
					this.dataService.createNewItem();
				},
			},
			{
				caption: { key: 'cloud.common.toolbarInsertSub' },
				hideItem: false,
				iconClass: 'tlb-icons ico-sub-fld-new',
				id: 'createChild',
				sort: 2,
				disabled: this.dataService.SubDivisionDisabled,
				fn: () => {
					this.dataService.createNewSubDivision();
				},
				type: ItemType.Item,
			},
			{
				id: 'tbNewDivision',
				hideItem: false,
				type: ItemType.Item,
				caption: 'cloud.common.toolbarNewDivision',
				iconClass: 'tlb-icons ico-fld-ins-below',
				disabled: this.dataService.NewDivisionDisable,
				sort: 3,
				fn: () => {
					this.dataService.createNewDivision();
				},
			},
			{
				id: 'filterSelectionStatements',
				hideItem: false,
				type: ItemType.Check,
				caption: 'cloud.common.toolbarFilter',
				value: this.dataService.FilterStatue,
				iconClass: 'tlb-icons ico-filter',
				disabled: !this.dataService.IsProjectLoaded,
				sort: 42,
				fn: () => {
					//TODO depend on framework filter component
					/*estimateMainLineItemSelStatementListService.setFilterStatus(this.value);
					estimateMainLineItemSelStatementListService.filterChanged.fire();*/
				},
			},
			{
				id: 'applyForCurrentLineItems',
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.lineItemSelStatement.applySelectionStForCurrentLineItems',
				iconClass: 'tlb-icons ico-refresh-one',
				disabled: this.dataService.ApplyDisabled,
				sort: 43,
				fn: () => {
					this.dataService.applySelectionStatementFn(true);
				},
			},
			{
				id: 'apply',
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.lineItemSelStatement.applySelectionS',
				iconClass: 'tlb-icons ico-refresh-all',
				disabled: this.dataService.ApplyDisabled,
				sort: 44,
				fn: () => {
					this.dataService.applySelectionStatementFn();
				},
			},
			{
				id: 'import',
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.lineItemSelStatement.import',
				iconClass: 'tlb-icons ico-import',
				sort: 45,
				disabled: this.dataService.ImportDisable,
				fn: () => {
					this.dataService.excelImport();
				},
			},
			{
				id: 'export',
				hideItem: false,
				type: ItemType.Item,
				caption: 'estimate.main.lineItemSelStatement.export',
				iconClass: 'tlb-icons ico-export',
				sort: 46,
				disabled: this.dataService.ExportDisable,
				fn: () => {
					const selStatements = this.dataService.getList();
					if (selStatements.length <= 0) {
						this.messageBoxService.showErrorDialog({ key: 'estimate.main.lineItemSelStatement.exportNoRecordsError' });
						return;
					}
					this.dataService.excelExport();
				},
			},
		]);
	}
}
