/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { BasicsExportService, ExportOptions } from '@libs/basics/shared';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IEntitySelection } from '@libs/platform/data-access';
import { IPrcItemEntity } from '../../model/entities';

/**
 * Procurement Common Item Export Options Wizard Service
 */
@Injectable({
	providedIn: 'root',
})
export abstract class PrcCommonItemExportOptionsWizardService {
	private readonly basicsExportService = inject(BasicsExportService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	private selectedItem: IPrcItemEntity | null = null;

	protected async exec(prcHeaderDataService: IEntitySelection<object>) {
		this.selectedItem = prcHeaderDataService.getSelectedEntity() as IPrcItemEntity | null;
		if (!this.selectedItem) {
			return;
		}
		const options = this.getExportOptions();
		this.basicsExportService.showExportDialog(options);
	}

	public exportOptions = {
		moduleName: 'procurement.package.prcitems',
		mainContainer: { id: '', label: '', gridId: 'fb938008027f45a5804b58354026ef1c' },
		subContainers: [],
		permission: '',
		excelProfileContexts: ['MatBidder'],
		exportOptionsCallback(ex: ExportOptions) {},
	};

	private getExportOptions() {
		this.exportOptions.exportOptionsCallback = (exportOption: ExportOptions) => {
			exportOption.filter = { ...(exportOption.filter as object), PKeys: [this.selectedItem!.PrcHeaderEntity!.Id || this.selectedItem!.Id] };
		};
		return this.exportOptions;
	}
	
}
