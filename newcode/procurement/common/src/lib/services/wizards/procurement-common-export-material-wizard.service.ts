/*
 * Copyright(c) RIB Software GmbH
 */

import { inject } from '@angular/core';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsShareFileDownloadService } from '@libs/basics/shared';
import { CompleteIdentification, IEntityIdentification, PlatformHttpService } from '@libs/platform/common';
import { IProcurementCommonExportMaterialWizardConfig } from '../../model/interfaces/wizard/prc-common-export-material-wizard.interface';
import { IExportMaterialData } from '../../model/interfaces/export-material-wizard.interface';

export class ProcurementCommonExportMaterialWizardService<TRootEntity extends IEntityIdentification, U extends CompleteIdentification<TRootEntity>, TEntity extends object> {

	private http = inject(PlatformHttpService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly downloadService = inject(BasicsShareFileDownloadService);

	public constructor(private readonly config: IProcurementCommonExportMaterialWizardConfig<TRootEntity, U, TEntity>) {
	}

	public async export() {
		const selectedRootEntity = this.config.rootDataService.getSelectedEntity();
		const selectedEntity = this.config.currentSelectionSvc.getSelectedEntity();

		if (this.config.currentSelectionSvc && !selectedEntity) {
			this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'procurement.common.wizard.noItemSelectedTitle', 'ico-info');
			return;
		}

		this.config.rootDataService.updateAndExecute(async () => {
			const wizardInitialEntity = this.config.GetExportParameters(selectedEntity as TEntity, selectedRootEntity as TRootEntity);
			const resData = await this.http.get('procurement/common/wizard/exportmaterial', {
				params: {
					objectFk: wizardInitialEntity.objectFk,
					ProjectFk: wizardInitialEntity.ProjectFk as string | number,
					CurrencyFk: wizardInitialEntity.CurrencyFk,
					moduleName: wizardInitialEntity.moduleName,
					subObjectFk: wizardInitialEntity.subObjectFk
				}
			});

			const materialData = resData as IExportMaterialData;
			if (materialData && materialData.FileName) {
				this.downloadService.download([], [], materialData.FileName, materialData.path);
				return undefined;
			}
		});
	}
}