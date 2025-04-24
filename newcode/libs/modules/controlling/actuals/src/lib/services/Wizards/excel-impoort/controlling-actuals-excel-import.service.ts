/**
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BasicsSharedImportEditorType, BasicsSharedImportExcelService, BasicsSharedImportOptions } from '@libs/basics/shared';
import { FieldType } from '@libs/ui/common';
import { ContextService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ValidationResult } from '@libs/platform/data-access';
import { find, forEach } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ControllingActualExcelImportService{

	private readonly basicsShareImportExcelService = inject(BasicsSharedImportExcelService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly contextService = ServiceLocator.injector.get(ContextService);

	public execute(){

		const importOptions: BasicsSharedImportOptions ={
			moduleName: 'controlling.actuals',
			checkDuplicationPage: {skip: true},
			ImportDescriptor : {
				DoubletFindMethods: [],
				Fields: [
					{
						Id: 0,
						PropertyName: 'Code',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('cloud.common.entityCode').text,
						DomainName: 'code',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'Code',
						type: FieldType.Code,
						sortable: false
					},
					{
						Id: 1,
						PropertyName: 'CompanyYear',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityCompanyYearServiceFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						// defaultMappingFun: function (excelHeaders){
						// 	let mappingName = '';
						//
						// 	forEach(excelHeaders, function (value, key){
						// 		if(key === 'reportingdate'){
						// 			mappingName = excelHeaders[key];
						// 		}
						// 	});
						//
						// 	if(mappingName){
						// 		return mappingName;
						// 	}
						//
						// 	forEach(excelHeaders, function (value, key){
						// 		if(key.indexOf('date') >= 0){
						// 			mappingName = excelHeaders[key];
						// 		}
						// 	});
						// 	return mappingName;
						// },
						model: 'CompanyYear',
						type: FieldType.DateTime,
						sortable: false
					},
					{
						Id: 2,
						PropertyName: 'CompanyPeriod',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityCompanyTradingPeriodFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						// defaultMappingFun: function (excelHeaders){
						// 	let mappingName = '';
						//
						// 	forEach(excelHeaders, function (value, key){
						// 		if(key === 'reportingdate'){
						// 			mappingName = excelHeaders[key];
						// 		}
						// 	});
						//
						// 	if(mappingName){
						// 		return mappingName;
						// 	}
						//
						// 	forEach(excelHeaders, function (value, key){
						// 		if(key.indexOf('date') >= 0){
						// 			mappingName = excelHeaders[key];
						// 		}
						// 	});
						// 	return mappingName;
						// },
						model: 'CompanyPeriod',
						type: FieldType.DateTime,
						sortable: false
					},
					{
						Id: 3,
						PropertyName: 'ValueType',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityValueTypeFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'ValueType',
						type: FieldType.Description,
						sortable: false
					},
					{
						Id: 4,
						PropertyName: 'ProjectNumber',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityProjectFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'ProjectNumber',
						type: FieldType.Description,
						sortable: false
					},
					{
						Id: 5,
						PropertyName: 'HasCostCode',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityHasCostCode').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'HasCostCode',
						type: FieldType.Boolean,
						sortable: false
					},
					{
						Id: 6,
						PropertyName: 'HasContCostCode',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityHasControllingCostCode').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'HasContCostCode',
						type: FieldType.Boolean,
						sortable: false
					},
					{
						Id: 7,
						PropertyName: 'HasAccount',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityHasAccount').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'HasAccount',
						type: FieldType.Boolean,
						sortable: false
					},
					{
						Id: 8,
						PropertyName: 'IsFinal',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.isFinal').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'IsFinal',
						type: FieldType.Boolean,
						sortable: false
					},
					{
						Id: 9,
						PropertyName: 'HeaderComment',
						EntityName: 'CompanyCostHeaderEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityCommentText').text,
						DomainName: 'comment',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'HeaderComment',
						type: FieldType.Comment,
						sortable: false
					},
					{
						Id: 10,
						PropertyName: 'ControllingUnitCode',
						DisplayName: this.translateService.instant('controlling.actuals.entityControllingUnitFk').text,
						EntityName: 'CompanyCostDataEntity',
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'ControllingUnitCode',
						type: FieldType.Code,
						sortable: false
					},
					{
						Id: 11,
						PropertyName: 'MdcCostCode',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityCostCodeFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'MdcCostCode',
						type: FieldType.Code,
						sortable: false
					},
					{
						Id: 12,
						PropertyName: 'ControllingCostCode',
						DisplayName: this.translateService.instant('controlling.actuals.entityControllingCodeFk').text,
						EntityName: 'CompanyCostDataEntity',
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'ControllingCostCode',
						type: FieldType.Code,
						sortable: false
					},
					{
						Id: 13,
						PropertyName: 'AccountCode',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityAmountCode').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'AccountCode',
						type: FieldType.Code,
						sortable: false
					},
					{
						Id: 14,
						PropertyName: 'Quantity',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityQuantity').text,
						DomainName: 'quantity',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'Quantity',
						type: FieldType.Quantity,
						sortable: false
					},
					{
						Id: 15,
						PropertyName: 'Amount',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityAmount').text,
						DomainName: 'money',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'Amount',
						type: FieldType.Money,
						sortable: false
					},
					{
						Id: 16,
						PropertyName: 'Currency',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('basics.company.entityCurrencyFk').text,
						DomainName: 'description',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'Currency',
						type: FieldType.Description,
						sortable: false
					},
					{
						Id: 17,
						PropertyName: 'AmountOc',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityAmountOc').text,
						DomainName: 'money',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'AmountOc',
						type: FieldType.Money,
						sortable: false
					},
					{
						Id: 18,
						PropertyName: 'DataComment',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.entityCommentText').text,
						DomainName: 'comment',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'DataComment',
						type: FieldType.Comment,
						sortable: false
					},
					{
						Id: 19,
						PropertyName: 'Uom',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('cloud.common.entityUoM').text,
						DomainName: 'integer',
						LookupQualifier: 'basics.uom',
						Editor: BasicsSharedImportEditorType.simplelookup,
						DisplayMember: 'UOM',
						model: 'Uom',
						type: FieldType.Integer,
						sortable: false
					},
					{
						Id: 20,
						PropertyName: 'NominalDimension1',
						EntityName: 'CompanyCostDataEntity',
						DisplayName: this.translateService.instant('controlling.actuals.nominalDimension1').text,
						DomainName: 'comment',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'NominalDimension1',
						type: FieldType.Comment,
						sortable: false
					},
					{
						Id: 21,
						PropertyName: 'NominalDimension2',
						DisplayName: this.translateService.instant('controlling.actuals.nominalDimension2').text,
						EntityName: 'CompanyCostDataEntity',
						DomainName: 'comment',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'NominalDimension2',
						type: FieldType.Comment,
						sortable: false
					},
					{
						Id: 22,
						PropertyName: 'NominalDimension3',
						DisplayName: this.translateService.instant('controlling.actuals.nominalDimension3').text,
						EntityName: 'CompanyCostDataEntity',
						DomainName: 'comment',
						Editor: BasicsSharedImportEditorType.domain,
						model: 'NominalDimension3',
						type: FieldType.Comment,
						sortable: false
					}
				],
				CustomSettings:{
					Overwrite: false,
					CreateNew: true,
					UpdateOld: true,
					HomeCurrency: false,
					ForeignCurrency: false,
					NoteText: this.translateService.instant('controlling.actuals.wizard.excelImport.currencyInfo').text
				},
				FieldProcessor: (model) => {
					const fields = model.ImportDescriptor.Fields;
					forEach(fields, (field)=> {
						if((field.PropertyName === 'CompanyYear' || field.PropertyName === 'CompanyPeriod') && model.ImportFileHeaders){
							let mappingName: string | null  = null;
							forEach(model.ImportFileHeaders, function (title){
								if(title === 'reportingdate'){
									mappingName = title;
								}
							});

							if(mappingName){
								field.MappingName = mappingName;
							}else{
								forEach(model.ImportFileHeaders, function (key){
									if(key.indexOf('date') >= 0){
										mappingName = key;
									}
								});

								field.MappingName = mappingName || field.PropertyName;
							}
						}
					});
				}
			},
			customSettingsPage: {
				skip: (entity) => {
					if(entity.ImportDescriptor && entity.ImportDescriptor.Fields){
						const currencyField =  find(entity.ImportDescriptor.Fields, function (item){
							return item.PropertyName === 'Currency';
						});
						return !currencyField;
					}
					return false;
				},
				config: {
					showGrouping: false,
					rows: [
						{
							groupId: 'actualExcelImport',
							id: 'homeCurrency',
							label: this.translateService.instant('controlling.actuals.wizard.excelImport.currencyConvert'),
							type: FieldType.Boolean,
							model: 'HomeCurrency',
							validator:() => this.overrideValidtor(),
							visible: true,
							sortOrder: 4
						},
						{
							groupId: 'actualExcelImport',
							id: 'note',
							label: this.translateService.instant('controlling.actuals.wizard.excelImport.note'),
							type: FieldType.Comment,
							model: 'NoteText',
							readonly: true,
							visible: true,
							sortOrder: 5
						}
					]
				}
			},
			preOpenImportDialogFn: () =>{
				const context = this.contextService.getContext();
				if(context){
					importOptions.ImportDescriptor.MainId = context.clientId || 0;
				}
				return Promise.resolve(true);
			},
			showInTabAfterImport: true,
			// nextStepPreprocessFn: () => {
			// 	return true;
			// }
		};

		this.basicsShareImportExcelService.showImportDialog(importOptions);
	}

	private overrideValidtor() :ValidationResult{

		return new ValidationResult();
	}

}