/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsExportService, ExportOptions } from '@libs/basics/shared';
import { ModuleNavBarService, NavBarIdentifier } from '@libs/ui/container-system';
import { IMenuItemEventInfo } from '@libs/ui/common';
import { BasicsMaterialMaterialGroupDataService } from '../material-group/basics-material-material-group-data.service';
import { BasicsMaterialMaterialCatalogDataService } from '../material-catalog/basics-material-material-catalog-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialNavBarExportService {
	private readonly moduleNavBarService = inject(ModuleNavBarService);
	private readonly materialGroupFilterDataService = inject(BasicsMaterialMaterialGroupDataService);
	private readonly basicsExportService = inject(BasicsExportService);
	private readonly catalogService = inject(BasicsMaterialMaterialCatalogDataService);

	private exportOptions = {
		moduleName: 'basics.material',
		mainContainer: {
			id: 'basics.material.grid',
			label: 'basics.material.record.gridViewTitle',
			gridId: 'dd40337f1f534a42a844122203639ed8',
		},
		subContainers: [
			{
				id: 'basics.material.characteristic.grid',
				gridId: '127dcd97f72546cc90b8fb5583883f4b',
				qualifier: 'attributes',
				label: 'basics.material.characteristic.title',
				selected: false,
				selectedColumns: ['property','characteristic'],
				internalFieldNames: ['PropertyInfo','CharacteristicInfo'],
				columnLabels: [],
				everVisible: true
			},{
				id: 'basics.material.document.grid',
				gridId: 'c84bd59dda4b4644aae314e1a5a11a0c',
				qualifier: 'documents',
				label: 'basics.material.documents.title',
				selected: false,
				selectedColumns: ['OriginFileName'],
				internalFieldNames: ['OriginFileName'],
				columnLabels: [],
				everVisible: true
			}
		],
		specialSubContainers: [
			{
				id: 'basics.material.specification.title',
				gridId: '65e8b902afe74b2da78667707f3d5f27',
				qualifier: 'basSpecification',
				label: 'basics.material.basSpecification',
				selected: false,
				selectedColumns: ['BasBlobsSpecificationFk'],
				internalFieldNames: ['Id'],
				columnLabels: [],
				visible: true
			},
			{
				id: 'basics.material.preview.title',
				gridId: '875c61bb2c5a4f54987a8db8125dd211',
				qualifier: 'preview',
				label: 'basics.material.preview.title',
				selected: false,
				selectedColumns: ['BasBlobsFk'],
				internalFieldNames: ['Id'],
				columnLabels: [],
				visible: true
			}
		],
		permission: '',
		excelProfileContexts: [],
		exportOptionsCallback(ex: ExportOptions) {},
	};

	public initExport() {
		const exportBtn = this.moduleNavBarService.getById(NavBarIdentifier.id.export);
		if (exportBtn) {
			exportBtn.fn = async (info: IMenuItemEventInfo<void>)=> {
				const catalogList = this.catalogService.getList();
				const groupList = this.materialGroupFilterDataService.getList();
				if (!catalogList || !groupList) {
					return;
				}
				const selectedCatalogIds = catalogList.filter((e) => e.IsChecked).map((x) => x.Id);
				const selectedGroupIds = groupList.filter((e) => e.IsChecked).map((x) => x.Id);
				this.exportOptions.exportOptionsCallback = (exportOption: ExportOptions) => {
					exportOption.filter = {
						...(exportOption.filter as object),
						furtherFilters: [
							{
								Token: 'GroupIds',
								Value: selectedGroupIds.toString(),
							},
							{
								Token: 'MaterialCatalogIds',
								Value: selectedCatalogIds.toString(),
							},
						],
						ExecutionHints: false,
						InterfaceVersion: null,
						IncludeNonActiveItems: false,
						OrderBy: null,
					};
				};
				this.basicsExportService.showExportDialog(this.exportOptions);
			};
		}
	}
}