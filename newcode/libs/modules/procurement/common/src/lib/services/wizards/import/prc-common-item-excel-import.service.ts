/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedCalculateOverGrossService, BasicsSharedImportExcelService, BasicsSharedImportOptions } from '@libs/basics/shared';
import { ITEM_IMPORT_MAPPING_FIELDS } from './prc-common-item-import-mapping-field.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { ValidationResult } from '@libs/platform/data-access';
import { IPrcCommonItemImportParam } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonItemExcelImportService {
	private readonly translateService = inject(PlatformTranslateService);
	private readonly basicsShareImportExcelService = inject(BasicsSharedImportExcelService);
	private readonly overGrossService = inject(BasicsSharedCalculateOverGrossService);

	public async showImportDialog(param: IPrcCommonItemImportParam) {
		const option = this.getImportOption(param.moduleName);
		option.ImportDescriptor.CustomSettings = {
			PrcHeaderFk: param.PrcHeaderFk,
			IsImportPriceAfterTax: this.overGrossService.isOverGross,
			BpdVatGroupFk: param.BpdVatGroupFk,
			HeaderTaxCodeFk: param.HeaderTaxCodeFk
		};
		if (param.MainId) {
			option.ImportDescriptor.MainId = param.MainId;
		}
		if (param.SubMainId) {
			option.ImportDescriptor.SubMainId = param.SubMainId;
		}
		return await this.basicsShareImportExcelService.showImportDialog(option);
	}

	public getImportOption(moduleName: string) {
		const option: BasicsSharedImportOptions = {
			moduleName: moduleName,
			checkDuplicationPage: {skip: true},
			fileSelectionPage: {
				excelProfileContexts: ['MatBidder']
			},
			fieldMappingsPage: {
				skip: false,
				mapFieldValidator: (info) => {
					if (!info.entity.MappingName && 'ITEMNO,BAS_UOM_FK,REQ_CODE'.split(',').includes(info.entity.PropertyName.toUpperCase())) {
						const translated = this.translateService.instant('procurement.common.emptyErrorMessage', {DisplayName: info.entity.DisplayName});
						const result = new ValidationResult(translated.text);
						result.apply = false;
						return result;
					}
					return new ValidationResult();
				}
			},
			editImportDataPage: {skip: false},
			previewResultPage: {skip: false},
			nextStepPreprocessFn: (dialog) => {
				if (dialog.currentStep.id === 'customSettingsPage' && dialog.dataItem && dialog.dataItem.ImportDescriptor && dialog.dataItem.ImportDescriptor.CustomSettings) {
					const isPriceAfterTax = 'IsImportPriceAfterTax' in dialog.dataItem.ImportDescriptor.CustomSettings
						? dialog.dataItem.ImportDescriptor.CustomSettings.IsImportPriceAfterTax as boolean
						: false;
					const priceMappings = {
						'PRICE_OC': isPriceAfterTax,
						'PRICE_OC_GROSS': !isPriceAfterTax,
						'TARGET_PRICE': isPriceAfterTax,
						'TARGET_PRICE_GROSS': !isPriceAfterTax,
						'DISCOUNT_ABSOLUTE_OC': isPriceAfterTax,
						'DISCOUNT_ABSOLUTE_GROSS_OC': !isPriceAfterTax,
					};
					dialog.dataItem.ImportDescriptor.Fields.forEach(item => {
						if (Object.prototype.hasOwnProperty.call(priceMappings, item.PropertyName)) {
							item['notShowInMappingGrid'] = priceMappings[item.PropertyName as keyof typeof priceMappings];
						}
					});
				}
				return Promise.resolve(true);
			},
			customSettingsPage: {
				skip: false,
				config: {
					showGrouping: false,
					groups: [
						{
							groupId: 'priceAfterTaxImport',
							header: '',
							open: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [{
						groupId: 'priceAfterTaxImport',
						id: 'IsImportPriceAfterTax',
						label: this.translateService.instant('basics.import.entityIsImportPriceAfterTax').text,
						type: FieldType.Boolean,
						model: 'IsImportPriceAfterTax',
						visible: true,
						sortOrder: 1
					}]
				}
			},
			ImportDescriptor: {
				DoubletFindMethods: [],
				Fields: ITEM_IMPORT_MAPPING_FIELDS,
				CustomSettings: {}
			},
			showInTabAfterImport: false
		};
		//TODO wait [estimate.main: basicsCostGroupAssignment] costGroupColumns: procurementCommonPrcItemCostGroupColumnsService.getPrcItemCostGroupColumns()
		return option;
	}
}
