import { Component, OnInit } from '@angular/core';
import { IEntityIdentification, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IGridConfiguration, ColumnDef, IFormConfig, ILookupEvent, ILookupMultiSelectEvent } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { UiBusinessBaseSourceWindowGridDataService } from '../../services/ui-business-base-source-window-grid-data.service';

interface IFormData {
	selectedType: number;
}

@Component({
	selector: 'ui-source-window',
	template: ''
})
export abstract  class SourceWindowComponent<T extends object> extends ContainerBaseComponent implements OnInit {

	public configuration!: IGridConfiguration<T>;
	public formConfig!: IFormConfig<object>;
	protected translationService = ServiceLocator.injector.get(PlatformTranslateService);
	protected gridColumns:ColumnDef<T>[]=[];

	public constructor(private uiBusinessBaseSourceWindowGridDataService: UiBusinessBaseSourceWindowGridDataService) {
		super();
	}

	public async ngOnInit(): Promise<void> {
		this.initializeFormConfig();
		this.initializeGrid([],[]);
		this.createGridConfig();
	}

	protected initializeFormConfig(): void {
		this.formConfig = {
			formId: 'form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: []
		};
	}

	protected initializeGrid(items: T[], columns: ColumnDef<T>[]) {
		this.configuration = {
			uuid: this.containerUUID(),
			columns: columns,
			items: items,
			dragDropAllowed: true
		};
	}

	protected abstract containerUUID(): string | undefined;

	protected getGridColumns(): ColumnDef<T>[] {
		return [];
	}

	protected async createGridConfig():Promise <void>{
	}

	protected loadGridData(apiUrl: string, requestData: object) {
		this.uiBusinessBaseSourceWindowGridDataService.fetchGridData<T>(apiUrl, requestData).subscribe({
			next: async (response: T[]) => {
				await this.createGridConfig();  // Wait for column configuration
				if (this.gridColumns.length === 0) {
					return; //Grid Columns are not defined.
				}
				this.initializeGrid(response || [], this.gridColumns);  // Pass columns to initializeGrid
			},
			error: (error) => {
				console.error('Error loading grid data:', error);
			}
		});
	}

	protected onLookupItemSelected(e: (ILookupEvent<IEntityIdentification, IFormData> | ILookupMultiSelectEvent<IEntityIdentification, IFormData>)): void {
		// To be overridden in derived components
	}
}
