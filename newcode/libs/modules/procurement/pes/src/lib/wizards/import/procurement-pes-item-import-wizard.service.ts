/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';
import { IPesHeaderEntity } from '../../model/entities';
import { PesCompleteNew } from '../../model/complete-class/pes-complete-new.class';
import { BasicsSharedImportExcelService, BasicsSharedImportOptions } from '@libs/basics/shared';
import { MODULE_INFO_PROCUREMENT, ProcurementCommonWizardBaseService } from '@libs/procurement/common';
import { PES_ITEM_IMPORT_FIELDS } from './prc-pes-item-import-mapping-field';
import { ValidationResult } from '@libs/platform/data-access';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ProcurementQuoteExcelImportWizardService extends ProcurementCommonWizardBaseService<IPesHeaderEntity, PesCompleteNew, IPesHeaderEntity> {
	protected readonly basicsShareImportExcelService = inject(BasicsSharedImportExcelService);

	public constructor() {
		super({
			rootDataService: inject(ProcurementPesHeaderDataService)
		});
	}

	protected override async showWizardDialog() {
		const entity = this.config.rootDataService.getSelectedEntity();
		const option = this.getImportOption();
		option.ImportDescriptor.MainId = entity?.Id;
		await this.basicsShareImportExcelService.showImportDialog(option);
		return undefined;
	}

	private getImportOption() {
		const option: BasicsSharedImportOptions = {
			moduleName: MODULE_INFO_PROCUREMENT.ProcurementPesModuleName,
			checkDuplicationPage: {skip: true},
			fieldMappingsPage: {
				skip: false,
				mapFieldValidator: (info) => {
					if (info.entity.PropertyName === 'PrcItem_Code') {
						//TODO platformRuntimeDataService.readonly(item, [{field: 'MappingName', readonly: true}]);
					}
					return new ValidationResult();
				}
			},
			editImportDataPage: {skip: false},
			previewResultPage: {skip: false},
			nextStepPreprocessFn: (dialog) => {
				return Promise.resolve(true);
			},
			customSettingsPage: {skip: true},
			ImportDescriptor: {
				DoubletFindMethods: [],
				Fields: PES_ITEM_IMPORT_FIELDS,
				CustomSettings: {},
				FieldProcessor: (model, oldProfile) => {
					const fields = model.ImportDescriptor.Fields;
					const codeItem = fields.find(f => f.PropertyName === 'PrcItem_Code' && !isNil(f.MappingName));
					const materialItem = fields.find(f => f.PropertyName === 'MDC_MATERIAL_FK');
					if (materialItem) {
						materialItem.readonly = !!codeItem?.MappingName;
					}
				}
			},
			showInTabAfterImport: false
		};
		return option;
	}
}