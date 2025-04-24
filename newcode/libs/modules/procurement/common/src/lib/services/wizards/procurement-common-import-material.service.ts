import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonWizardBaseService } from './procurement-common-wizard-base.service';
import { inject } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { BasicsSharedImportMessage, BasicsSharedImportXmlFileService, BasicsSharedImportStatus } from '@libs/basics/shared';
import { DataServiceFlatRoot, DataServiceHierarchicalRoot, IEntitySelection } from '@libs/platform/data-access';
import { IPrcCommonReadonlyService } from '../../model/interfaces';

type prcImportResult = {
	ImportStauts:BasicsSharedImportStatus
	resultDatas: BasicsSharedImportMessage[]
}

/**
 * Provide a base implementation for procurement ImportMaterial wizard
 */
export class ProcurementCommonImportMaterialService<T extends IEntityIdentification, U extends CompleteIdentification<T>, V extends { PrcHeaderFk: number }> extends ProcurementCommonWizardBaseService<T, U, object> {
	public constructor(
		protected readonly parentService: (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>) & IPrcCommonReadonlyService<T>,
		protected readonly dataService: IEntitySelection<V>,
		protected moduleName: string,
	) {
		super({ rootDataService: parentService });
	}

	private prcHeaderFK?: number;
	private canShow = false;
	private materialXmlData?: prcImportResult;


	private readonly importDataService = inject(BasicsSharedImportXmlFileService);

	protected override async doExecuteWizard(opt?: object, bntId: StandardDialogButtonId | string = StandardDialogButtonId.Ok) {
		return true;
	}

	protected override async startWizardValidate(checkReadonly: boolean = true): Promise<boolean> {
		if (!this.config.rootDataService.hasSelection() || !this.dataService.hasSelection()) {
			await this.messageBoxService.showMsgBox('cloud.common.noCurrentSelection', 'cloud.common.errorMessage', 'ico-error');
			return false;
		}

		if (checkReadonly && (await this.config.rootDataService.isEntityReadonly())) {
			await this.messageBoxService.showMsgBox('procurement.common.errorTip.recordIsReadOnly', 'procurement.common.errorTip.recordIsReadOnlyTitle', 'ico-error');
			return false;
		}
		this.prcHeaderFK = this.dataService.getSelectedEntity()?.PrcHeaderFk;
		return true;
	}

	// protected override async showWizardDialog() {
	// 	await this.importDataService.execute(
	// 		'procurement.common.importD94.header',
	// 		async (entity?: BasicsSharedImportDataEntity) => {
	// 			if (entity) {
	// 				const result = await this.importD94Data(entity.file?.name ?? '');
	// 				this.materialXmlData = result;
	// 				entity.importResults = result.resultDatas;
	// 				if(result.ImportStauts === BasicsSharedImportStatus.Warning){
	// 					this.canShow = true;
	// 				}
	// 			}
	// 		},
	// 		undefined,
	// 		undefined,
	// 		undefined,
	// 		undefined,
	// 		async (info, entity) => {
	// 			if (entity.importResults) {
	// 				const result = await this.importD94DataForWarning();
	// 				(info.dialog.value as {items: BasicsSharedImportMessage[]}).items = result.resultDatas;
	// 				this.canShow = false;
	// 			}
	// 		},
	// 		(entity) => {
	// 			return this.canShow;
	// 		},
	// 	);
	// 	return { closingButtonId: StandardDialogButtonId.Ok };
	// }

	private importD94Data(fileName: string) {
		return this.http.get<prcImportResult>('procurement/common/wizard/importmaterial?fileName=' + fileName + '&moduleName=' + this.moduleName + '&mainItemId=' + this.prcHeaderFK);
	}

	private importD94DataForWarning() {
		const postData = {xmlData: this.materialXmlData, mainItemId: this.prcHeaderFK, moduleName: this.moduleName};
		return this.http.post<prcImportResult>('procurement/common/wizard/importmaterialforwarning', postData);
	}
}
