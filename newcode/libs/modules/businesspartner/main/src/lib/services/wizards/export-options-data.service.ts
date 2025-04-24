import { inject, Injectable } from '@angular/core';
import { ExportOptions, IExportContainer } from '@libs/basics/shared';
import { cloneDeep, forEach, map as lodashMap } from 'lodash';
import { GridApiService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class BusinessPartnerMainExportOptionsDataService {
	private gridApi = inject(GridApiService);
	private translateService = inject(PlatformTranslateService);

	private exportOptions: ExportOptions = {
		moduleName: 'businesspartner.main',
		mainContainer: { id: 'businesspartner.main.grid', label: 'businesspartner.main.headerGridContainerTitle', gridId: '75dcd826c28746bf9b8bbbf80a1168e8' },
		subContainers: [
			{
				id: 'businesspartner.main.subsidiary',
				gridId: 'e48c866c714440f08a1047977e84481f',
				qualifier: 'subsidiary',
				label: 'businesspartner.main.subsidiaryGridContainerTitle',
				selected: false,
			},
			{
				id: 'businesspartner.main.contactgrid', // must match an entry in the module-containers.json!
				gridId: '72f38c9d2f4b429bae5f70da33068ae3', // gridId of the grid container to export
				qualifier: 'contact', // unique identifier for subcontainers (used on server side!)
				label: 'businesspartner.main.contactGridContainerTitle', // listbox item text
				selected: false, // pre-select container in the listbox
			},
			{
				id: 'businesspartner.main.activities',
				gridId: 'c87f45d900e640768a08d471bd476b2c',
				qualifier: 'activity',
				label: 'businesspartner.main.activitiesContainerTitle',
				selected: false,
			},
			{
				id: 'businesspartner.main.objectsofcustomers',
				gridId: '72121ad6a4774cbea673753606fb19d2',
				qualifier: 'realestate',
				label: 'businesspartner.main.realEstateGridContainerTitle',
				selected: false,
			},
			{
				id: 'businesspartner.main.characteristic',
				gridId: '4f864faad8094b4c97b3e1edb28d21f8',
				qualifier: 'characteristic',
				label: 'cloud.common.ContainerCharacteristicDefaultTitle',
				selected: false,
			},
			{
				id: 'businesspartner.main.supplier',
				gridId: '7f5057a88b974acd9fb5a00cee60a33d',
				qualifier: 'supplier',
				label: 'businesspartner.main.supplierContainerTitle',
				selected: false,
			},
			{
				id: 'businesspartner.main.customer',
				gridId: '53aa731b7da144cdbff201a7df205016',
				qualifier: 'customer',
				label: 'businesspartner.main.customerGridContainerTitle',
				selected: false,
			},
		],
		permission: '3c5513a31ebd49c7a9e5ae0832b05ea0#e',
		//: [],
		exportOptionsCallback(ex: ExportOptions) {},
		handlerSubContainer(subContainers: IExportContainer[]) {},
	};

	//TODO Waiting for the BP. mian container export button to be called
	public getExportOptions() {
		this.exportOptions.handlerSubContainer = (subContainers: IExportContainer[]) => {
			forEach(subContainers, (item) => {
				item.columnLabels = [];
				item.selectedColumns = [];
				item.internalFieldNames = [];
				if (!item.gridId) {
					return;
				}
				const grid = this.gridApi.get(item.gridId ?? '');
				if (grid) {
					//const gridConfig = platformGridAPI.columns.configuration(item.gridId);
					const gridColumns = cloneDeep(grid.columns);
					if (gridColumns.length > 0 && gridColumns[0].id === 'indicator') {
						gridColumns.splice(0, 1);
					}
					item.selectedColumns = lodashMap(gridColumns, 'id');
					// TODO: is model the same as field?
					item.internalFieldNames = lodashMap(gridColumns, 'model') as string[];
					forEach(gridColumns, (column) => {
						item.columnLabels?.push((column as unknown as Record<string, string>)['userLabelName'] ?? this.translateService.instant(column.label ?? column.id).text);
					});
				}
			});
		};
		return this.exportOptions;
	}
}
