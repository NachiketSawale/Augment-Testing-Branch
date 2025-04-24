/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementContractHeaderDataService } from '../services/procurement-contract-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';
import { ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';

@Injectable({
	providedIn: 'root'
})
export class ProcurementContractExportMaterialWizard extends ProcurementCommonWizardBaseService<IConHeaderEntity,ContractComplete,IExportMaterialData>{

	public constructor() {
		super({
			rootDataService: inject(ProcurementContractHeaderDataService)
		});
	}
	private readonly downLoadService = inject(BasicsShareFileDownloadService);

	protected override async showWizardDialog() {
		const selectedItem = this.config.rootDataService.getSelectedEntity();
		if(selectedItem) {
			const resData = await this.http.get('procurement/common/wizard/exportmaterial', {
				params: {
					objectFk: selectedItem!.Id,
					ProjectFk: selectedItem.ProjectFk ?? -1,//todo-The framework should enhance support null values The current -1 is for compilation
					CurrencyFk: selectedItem.BasCurrencyFk ?? -1,//todo-The framework should enhance support null values The current -1 is for compilation
					moduleName: ProcurementInternalModule.Contract,
					subObjectFk: 0
				}
			});
			const materialData = resData as IExportMaterialData;
			if (materialData && materialData.FileName) {
				this.downLoadService.download([], [], materialData.FileName, materialData.path);
				return undefined;
			}
		}
	}
}

interface IExportMaterialData {
	FileExtension: string;
	FileName: string;
	Url: string;
	path: string
}