/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IMaterialFilterResultDisplayConfig, MaterialFilterGridId, MaterialFilterScope } from '../../model';
import { GridApiService } from '@libs/ui/common';
import { IMaterialSearchEntity } from '../../../material-search';
import { firstValueFrom, forkJoin } from 'rxjs';
import { PlatformPermissionService } from '@libs/platform/common';
import { BasicsSharedMaterialFilterResultDisplayConfigService } from '../../services';

/**
 * Material filter result component
 */
@Component({
	selector: 'basics-shared-material-filter-result-view',
	templateUrl: './material-filter-result-view.component.html',
	styleUrl: './material-filter-result-view.component.scss',
})
export class BasicsSharedMaterialFilterResultViewComponent implements OnInit, OnDestroy {
	private isAutoOpenPreviewPanel: boolean = true;
	private readonly createSimilarPermissionUuid = 'a663969f4d1d49b8804989c62665d28f';

	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly displayConfigService = inject(BasicsSharedMaterialFilterResultDisplayConfigService);
	private readonly gridApiService = inject(GridApiService);

	/**
	 * Whether required data ready
	 */
	public isDataReady: boolean = false;

	/**
	 * Preview panel size
	 */
	public previewPanelSize: number = 0;

	/**
	 * Preview item
	 */
	public previewItem: IMaterialSearchEntity | null = null;

	/**
	 * Result display configuration
	 */
	public displayConfig: IMaterialFilterResultDisplayConfig | null = null;

	/**
	 * Search scope
	 * The scope defines the context in which the filters are applied.
	 */
	@Input()
	public scope!: MaterialFilterScope;

	/**
	 * Initialization
	 */
	public ngOnInit(): void {
		// Load and initialize required data
		this.loadRequiredData().then(() => {
			this.isDataReady = true;
		});

	}

	/**
	 * On Destroy
	 */
	public ngOnDestroy(): void {
	}

	private async loadRequiredData() {
		return firstValueFrom(forkJoin([
			// Load and initialize result display configuration
			this.loadResultDisplayConfig(),

			// Load result material create similar permission
			this.loadMaterialSimilarPermission()
		]));
	}

	private async loadResultDisplayConfig() {
		return this.displayConfigService.loadResultDisplayConfig().then((config: IMaterialFilterResultDisplayConfig | null) => {
			this.displayConfig = config ?? null;
		});
	}

	private async loadMaterialSimilarPermission() {
		return this.platformPermissionService.loadPermissions(this.createSimilarPermissionUuid);
	}

	/**
	 * Handle data selection changed
	 * @param selection
	 */
	public onSelectionChanged(selection: IMaterialSearchEntity | null) {
		this.previewItem = selection;

		if (!this.previewItem) {
			this.previewPanelSize = 0;
		} else if (this.isAutoOpenPreviewPanel && this.previewPanelSize === 0) {
			this.previewPanelSize = 30;
		}
	}

	/**
	 * Handler splitter size changed
	 */
	public onSplitterChangeSize(event: string) {
		this.gridApiService.get(MaterialFilterGridId)?.resizeGrid();
		this.isAutoOpenPreviewPanel = this.isAutoOpenPreviewPanel ? !(event.toLowerCase() === 'right') : false;
	}
}