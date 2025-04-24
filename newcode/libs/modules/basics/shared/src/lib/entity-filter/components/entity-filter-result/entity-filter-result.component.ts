/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { EntityFilterScope } from '../../model';
import { IEntityIdentification, PlatformTranslateService } from '@libs/platform/common';
import { IEntityFilterResultPaginationInfo } from '../../model';
import { IResizeArgs, IResizeOptions } from '@libs/ui/common';

/**
 * Entity Filter Result Component
 * Displays filtered results in a grid and allows previewing each item in a form.
 */
@Component({
	selector: 'basics-shared-entity-filter-result',
	templateUrl: './entity-filter-result.component.html',
	styleUrl: './entity-filter-result.component.scss'
})
export class BasicsSharedEntityFilterResultComponent<TEntity extends IEntityIdentification>
	implements OnInit {
	private titleText = '';
	private isAutoOpenPreviewPanel: boolean = true;
	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * Filter scope
	 * The scope defines the context in which the filters are applied.
	 */
	@Input()
	public scope!: EntityFilterScope<TEntity>;

	/**
	 * Splitter resize
	 */
	public splitterLeftResize = new EventEmitter<void>();

	/**
	 * Whether required data ready
	 */
	public isDataReady: boolean = false;

	/**
	 * Preview panel size
	 */
	public previewPanelSize: number = 0;

	/**
	 * Preview entity
	 */
	public previewItem?: TEntity;

	/**
	 * Split left area resize option
	 */
	public splitLeftResizeOption: IResizeOptions = {
		handler: {
			execute: (args: IResizeArgs) => {
				this.splitterLeftResize.emit();
			}
		}
	};

	/**
	 * Get pagination Info
	 */
	public get pageInfo(): IEntityFilterResultPaginationInfo {
		return {
			PageNumber: this.scope.input.PageNumber,
			PageSize: this.scope.input.PageSize,
			HasMoreEntities: this.scope.output.HasMoreEntities,
			EntitiesFound: this.scope.output.EntitiesFound,
			PageSizeList: this.scope.pageSizeList
		};
	}

	/**
	 * Initialization
	 */
	public ngOnInit(): void {
		this.titleText = this.scope.resultViewOption.titleTr ? this.translateService.instant(this.scope.resultViewOption.titleTr).text : '';

		// Load and initialize required data
		this.scope.loadResultViewRequiredData().then(() => {
			this.isDataReady = true;
		});
	}

	/**
	 * Handle double click item
	 * @param item
	 */
	public onDoubleClick(item: TEntity) {
		this.scope.selected$.next(item);
	}

	/**
	 * Handle header checkbox changed
	 * @param isChecked
	 */
	public onHeaderCheckboxChanged(isChecked: boolean) {
		this.scope.handleHeaderCheckboxChanged(isChecked);
	}

	/**
	 * Handle data selection changed
	 * @param selection
	 */
	public onSelectionChanged(selection?: TEntity) {
		this.previewItem = selection;
		if (!this.previewItem) {
			this.previewPanelSize = 0;
		} else if (this.isAutoOpenPreviewPanel && this.previewPanelSize === 0) {
			this.previewPanelSize = 30;
		}
		this.scope.handleSelectionChanged(selection);
	}

	/**
	 * Handler splitter size changed
	 */
	public onSplitterChangeSize(event: string) {
		this.isAutoOpenPreviewPanel = this.isAutoOpenPreviewPanel ? !(event.toLowerCase() === 'right') : false;
	}

	/**
	 * Get title result view
	 */
	public getTitle(): string {
		if (this.scope.output.EntitiesFound === 0) {
			return this.titleText;
		}

		const countStr = this.scope.output?.HasMoreEntities ?
			this.scope.output.EntitiesFound.toString() + '+' :
			this.scope.output.EntitiesFound.toString();
		return `${this.titleText} (${countStr})`;
	}
}