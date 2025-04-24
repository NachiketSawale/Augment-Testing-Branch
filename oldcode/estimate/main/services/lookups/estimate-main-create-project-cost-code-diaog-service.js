/**
 * $Id: estimate-main-create-project-cost-codes-dialog-service.js 124509 2022-11-10 04:36:06Z winjit.deshkar $
 * Copyright (c) RIB Software SE
 */

(function () {

	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCreateProjectCostCodeDialogService
	 * @function
	 *
	 * @description
	 * estimateMainCreateProjectCostCodeDialogService provides child cost code creation
	 */
	angular.module(moduleName).factory('estimateMainCreateProjectCostCodeDialogService', ['$http', '$injector','$translate', 'basicsLookupdataConfigGenerator', 'platformGridAPI', 'projectCostCodesMainService', 'platformDataValidationService', 'platformModalFormConfigService', 'platformTranslateService',
		function ($http, $injector, $translate, basicsLookupdataConfigGenerator, platformGridAPI, projectCostCodesMainService, platformDataValidationService, platformModalFormConfigService, platformTranslateService) {

			// Object presenting the service
			let service = {};
			let newLookupJson = [];

			service.layout = {};

			service.create = function create(item,$scope) {
				$scope.gridId = '353cb6c50ba84ca9b82e695911fa6cdb';
				let lookupService = $injector.get('basicsLookupdataLookupDescriptorService');

				let newCreatedItem = angular.copy(item);
				newLookupJson = [
					{
						gid: 'ProjectCostCode',
						rid: 'Code',
						model:'Code',
						id: 'Code',
						field: 'Code',
						label: 'Code',
						formatter: 'code',
						width: 70,
						label$tr$: 'cloud.common.entityCode',
						searchable: true,
						type: 'code',
						readonly: false,
						required: true,
						cssClass: 'text-left',
						validator:function(entity, value, model){
							let items = lookupService.getData('prjCostCodesByJob');
							let res = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, items, service, projectCostCodesMainService);
							if(res.valid){
								if(entity && entity.__rt$data && entity.__rt$data.errors) {
									if(entity.__rt$data.errors.Code === null || entity.__rt$data.errors.Code) {
										delete entity.__rt$data.errors.Code;
										delete entity.__rt$data.errors;
									}
								}
							}
							return res;
						}
					},
					{
						gid: 'ProjectCostCode',
						rid: 'Description',
						model: 'DescriptionInfo',
						id: 'Description',
						field: 'DescriptionInfo',
						label: 'Description',
						formatter: 'translation',
						width: 100,
						label$tr$: 'cloud.common.entityDescription',
						searchable: true,
						type: 'translation',
						readonly: false,
						required: true,
						cssClass: 'text-left'
					},
					{
						directive: 'basics-lookupdata-uom-lookup',
						gid: 'ProjectCostCode',
						rid: 'UomFk',
						model: 'UomFk',
						id: 'UomFk',
						field: 'UomFk',
						label: 'Uom',
						width: 50,
						label$tr$: 'basics.costcodes.uoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						},
						readonly:false,
						type: 'directive',
						required: false,
						cssClass: 'text-left'
					},
					{
						gid: 'ProjectCostCode',
						rid: 'Rate',
						model: 'Rate',
						id: 'Rate',
						field: 'Rate',
						label: 'Rate',
						formatter: 'money',
						width: 70,
						label$tr$: 'basics.costcodes.unitRate',
						type: 'money',
						required: false,
						cssClass: 'text-left'
					},
					{
						gid: 'AdditionalInfo',
						rid: 'IsBudget',
						model: 'IsBudget',
						id: 'IsBudget',
						field: 'IsBudget',
						label: 'Budget',
						formatter: 'boolean',
						width: 70,
						label$tr$: 'basics.costcodes.budget',
						type: 'boolean',
						readonly: true,
						required: false
					}, {
						gid: 'AdditionalInfo',
						rid: 'IsCost',
						model: 'IsCost',
						id: 'IsCost',
						field: 'IsCost',
						label: 'Cost',
						formatter: 'boolean',
						width: 70,
						label$tr$: 'basics.costcodes.isCost',
						type: 'boolean',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'IsEditable',
						model: 'IsEditable',
						id: 'IsEditable',
						field: 'IsEditable',
						label: 'Is Editable',
						formatter: 'boolean',
						width: 70,
						label$tr$: 'basics.costcodes.isEditable',
						type: 'boolean',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'IsDefault',
						model: 'IsDefault',
						id: 'IsDefault',
						field: 'IsDefault',
						label: 'Is Default',
						formatter: 'boolean',
						width: 70,
						label$tr$: 'basics.costcodes.isDefault',
						type: 'boolean',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'IsProjectChildAllowed',
						model: 'IsProjectChildAllowed',
						id: 'IsProjectChildAllowed',
						field: 'IsProjectChildAllowed',
						label: 'Child Allowed',
						formatter: 'boolean',
						width: 30,
						label$tr$: 'basics.costcodes.isChildAllowed',
						type: 'boolean',
						readonly: true,
						required: false
					},
					{
						directive:'basics-lookupdata-currency-combobox',
						gid: 'AdditionalInfo',
						rid: 'CurrencyFk',
						model: 'CurrencyFk',
						id: 'CurrencyFk',
						field: 'CurrencyFk',
						label: 'Currency',
						width: 50,
						label$tr$: 'cloud.common.entityCurrency',
						searchable: true,
						type: 'directive',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},
					{
						gid: 'AdditionalInfo',
						rid: 'IsLabour',
						model: 'IsLabour',
						id: 'IsLabour',
						field: 'IsLabour',
						label: 'Labour',
						formatter: 'boolean',
						width: 50,
						label$tr$: 'estimate.main.isLabour',
						searchable: true,
						type: 'boolean',
						readonly: true,
						required: false
					},

					{
						gid: 'AdditionalInfo',
						rid: 'IsRate',
						model: 'IsRate',
						id: 'IsRate',
						field: 'IsRate',
						label: 'Is Rate',
						formatter: 'boolean',
						width: 30,
						label$tr$: 'estimate.main.isRate',
						type: 'boolean',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'FactorCosts',
						model: 'FactorCosts',
						id: 'FactorCosts',
						field: 'FactorCosts',
						label: 'FactorCosts',
						formatter: 'factor',
						width: 70,
						label$tr$: 'basics.costcodes.factorCosts',
						searchable: true,
						type: 'factor',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},
					{
						gid: 'AdditionalInfo',
						rid: 'FactorHour',
						model: 'FactorHour',
						id: 'FactorHour',
						field: 'FactorHour',
						label: 'FactorHour',
						formatter: 'factor',
						width: 70,
						label$tr$: 'basics.costcodes.factorHour',
						searchable: true,
						type: 'factor',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},
					{
						gid: 'AdditionalInfo',
						rid: 'RealFactorCosts',
						model: 'RealFactorCosts',
						id: 'RealFactorCosts',
						field: 'RealFactorCosts',
						label: 'RealFactorCosts',
						formatter: 'factor',
						width: 70,
						label$tr$: 'basics.costcodes.realFactorCosts',
						type: 'factor',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},

					{
						gid: 'AdditionalInfo',
						rid: 'FactorQuantity',
						model: 'FactorQuantity',
						id: 'FactorQuantity',
						field: 'FactorQuantity',
						label: 'FactorQuantity',
						formatter: 'factor',
						width: 70,
						label$tr$: 'basics.costcodes.factorQuantity',
						searchable: true,
						type: 'factor',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},

					{
						gid: 'AdditionalInfo',
						rid: 'RealFactorQuantity',
						model: 'RealFactorQuantity',
						id: 'RealFactorQuantity',
						field: 'RealFactorQuantity',
						label: 'RealFactorQuantity',
						formatter: 'factor',
						width: 70,
						label$tr$: 'basics.costcodes.realFactorQuantity',
						searchable: true,
						type: 'factor',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},

					{
						gid: 'AdditionalInfo',
						rid: 'CostCodeTypeFk',
						model: 'CostCodeTypeFk',
						id: 'CostCodeTypeFk',
						field: 'CostCodeTypeFk',
						label: 'Type',
						width: 70,
						label$tr$: 'basics.costcodes.entityType',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false,
						cssClass: 'text-left'
					},

					{
						gid: 'AdditionalInfo',
						rid: 'EstCostTypeFk',
						model: 'EstCostTypeFk',
						id: 'EstCostTypeFk',
						field: 'EstCostTypeFk',
						label: 'Type',
						width: 70,
						label$tr$: 'basics.costcodes.costType',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					},

					{
						gid: 'AdditionalInfo',
						rid: 'DayWorkRate',
						model: 'DayWorkRate',
						id: 'DayWorkRate',
						field: 'DayWorkRate',
						label: 'DW/T+M Rate',
						formatter: 'money',
						width: 70,
						label$tr$: 'basics.costcodes.dayWorkRate',
						searchable: true,
						type: 'money',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'Remark',
						model: 'Remark',
						id: 'Remark',
						field: 'Remark',
						label: 'remarks',
						formatter: 'remark',
						width: 100,
						label$tr$: 'cloud.common.entityRemark',
						searchable: true,
						type: 'comment',
						readonly: true,
						required: false
					},
					{
						gid: 'AdditionalInfo',
						rid: 'AbcClassificationFk',
						model: 'AbcClassificationFk',
						id: 'AbcClassificationFk',
						field: 'AbcClassificationFk',
						label: 'Abc Classification',
						formatter: 'AbcClassificationFk',
						width: 100,
						label$tr$: 'cloud.common.abcClassificationFk',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					}, {
						gid: 'AdditionalInfo',
						rid: 'CostCodePortionsFk',
						model: 'CostCodePortionsFk',
						id: 'CostCodePortionsFk',
						field: 'CostCodePortionsFk',
						label: 'CostCode Portions',
						formatter: 'CostCodePortionsFk',
						width: 100,
						label$tr$: 'cloud.common.costCodePortionsFk',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					}, {
						gid: 'AdditionalInfo',
						rid: 'CostGroupPortionsFk',
						model: 'CostGroupPortionsFk',
						id: 'CostGroupPortionsFk',
						field: 'CostGroupPortionsFk',
						label: 'CostGroup Portions',
						formatter: 'CostGroupPortionsFk',
						width: 100,
						label$tr$: 'cloud.common.costGroupPortionsFk',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					}, {
						directive: 'basics-lookupdata-lookup-composite',
						gid: 'AdditionalInfo',
						rid: 'PrcStructureFk',
						model: 'PrcStructureFk',
						id: 'PrcStructureFk',
						field: 'PrcStructureFk',
						label: 'Procurement Structure',
						formatter: 'PrcStructureFk',
						width: 100,
						label$tr$: 'cloud.common.prcStructureFk',
						searchable: true,
						type: 'directive',
						readonly: true,
						options: {
							lookupDirective: 'basics-procurementstructure-structure-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								showClearButton: true
							}
						},
						required: false
					},{
						gid: 'AdditionalInfo',
						rid: 'EfbType221Fk',
						model: 'EfbType221Fk',
						id: 'EfbType221Fk',
						field: 'EfbType221Fk',
						label: 'EFB type 221',
						formatter: 'EfbType221Fk',
						width: 100,
						label$tr$: 'cloud.common.efbType221Fk',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					}, {
						gid: 'AdditionalInfo',
						rid: 'EfbType222Fk',
						model: 'EfbType222Fk',
						id: 'EfbType222Fk',
						field: 'EfbType222Fk',
						label: 'Efb Type 222',
						formatter: 'EfbType222Fk',
						width: 100,
						label$tr$: 'cloud.common.efbType222Fk',
						searchable: true,
						type: 'description',
						readonly: true,
						required: false
					}

				];
				let userDefinedService = $injector.get($scope.lookupOptions.userDefinedConfigService);
				let userDefinedColumns = userDefinedService.getDynamicColumnsForLookUp();
				_.forEach(userDefinedColumns, function (col) {
					col.type = col.editor !== null ? col.editor : col.formatter;
					col.readonly = true;
					col.label = col.name;
					col.label$tr$ = col.name$tr$;
					col.gid = 'AdditionalInfo';
					col.rid = col.id;
					col.model = col.field;
					col.required = false;
					col.cssClass = 'text-left';
				});

				newLookupJson = newLookupJson.concat(userDefinedColumns);

				let costCodeTypeConfig = _.find(newLookupJson, function (item) {
					return item.id === 'CostCodeTypeFk';
				});

				let costTypeConfig = _.find(newLookupJson, function (item) {
					return item.id === 'EstCostTypeFk';
				});

				let abcConfig = _.find(newLookupJson, function (item) {
					return item.id === 'AbcClassificationFk';
				});

				let costcodeportionsConfig = _.find(newLookupJson, function (item) {
					return item.id === 'CostCodePortionsFk';
				});

				let costgroupportionsConfig = _.find(newLookupJson, function (item) {
					return item.id === 'CostGroupPortionsFk';
				});

				let efbtype1Config = _.find(newLookupJson, function (item) {
					return item.id === 'EfbType221Fk';
				});
				let efbtype2Config = _.find(newLookupJson, function (item) {
					return item.id === 'EfbType222Fk';
				});

				angular.extend(costCodeTypeConfig, basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description').detail);
				angular.extend(costTypeConfig, basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description').detail);
				angular.extend(abcConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.abcclassification', 'Description').detail);
				angular.extend(costcodeportionsConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costcodeportions', 'Description').detail);
				angular.extend(costgroupportionsConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.costcodes.costgroupportions', 'Description').detail);
				angular.extend( efbtype1Config, basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description').detail);
				angular.extend( efbtype2Config, basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.efbtype', 'Description').detail);


				let resourceData = $injector.get('estimateMainResourceService').getSelected() || {};
				let jobFk = $injector.get('estimateMainService').getLgmJobId(resourceData);
				let projectId = $injector.get('estimateMainService').getSelectedProjectId() || 0;
				let costCodeLookupService = $injector.get('estimateMainJobCostcodesLookupService');

				if(newCreatedItem.UomFk){
					let uom = _.find(newLookupJson, {id: 'UomFk'});
					uom.readonly = true;
				}

				generateCode(newCreatedItem, projectId, jobFk, false).then(function (data) {
					newCreatedItem.Code = data.Item1 ?? '';
					newCreatedItem.IsChildAllowed = false;
					newCreatedItem.IsProjectChildAllowed = false;

					lookupService.updateData('prjCostCodesByJob', data.Item2 || []);

					service.layout = {
						title: $translate.instant('estimate.main.createNewCostCode'),
						dataItem: newCreatedItem,
						dialogOptions: {
							height: '500px',
							width: '650px',
							disableOkButton: function disableOkButton() {
								let result = false;
								if(newCreatedItem.DescriptionInfo.Translated === null || newCreatedItem.DescriptionInfo.Translated === '' || !_.isNil(newCreatedItem.__rt$data.errors) || newCreatedItem.Code === ''){
									result = true;
								}
								return result;
							},
						},
						showOkButton: true,
						resizeable: true,
						formConfiguration:getDialogConfig(),
						handleOK: function handleOK(result) {
							result.data.Description = result.data.DescriptionInfo.Translated;
							let updateData = {
								'ProjectId': projectId,
								'ParentCostCode': result.data,
								'JobFk': jobFk,
								'MdcCostCodeId': result.data.OriginalId,
								'IsProjectCostCode':result.data.IsOnlyProjectCostCode
							};
	
							$http.post(globals.webApiBaseUrl + 'project/costcodes/createnewprjcostcode', updateData)
								.then(function (response) {
									let newPrjcostCodeItem = $injector.get('estimateMainJobCostcodesLookupService').sortNewCreatedItem(response.data);
									newPrjcostCodeItem.CostCodeParentFk = updateData.ParentCostCode.Id;
									newPrjcostCodeItem.IsOnlyProjectCostCode = true;
									newPrjcostCodeItem.IsProjectChildAllowed = newPrjcostCodeItem.IsChildAllowed;
									newPrjcostCodeItem.DescriptionInfo = result.data.DescriptionInfo;
									newPrjcostCodeItem.Description2Info = result.data.Description2Info || { Translated: '', Description: '' };
									newPrjcostCodeItem.DescriptionInfo.Translated = newPrjcostCodeItem.Description;
									newPrjcostCodeItem.Description2Info.Translated = newPrjcostCodeItem.Description;
									newPrjcostCodeItem.DescriptionInfo.Description = newPrjcostCodeItem.Description;
									newPrjcostCodeItem.Description2Info.Description = newPrjcostCodeItem.Description;
									
									$injector.get('platformRuntimeDataService').readonly(newPrjcostCodeItem, [
										{  field: 'CurrencyFk',readonly: true }
									]);
									
									costCodeLookupService.addLookupItem(newPrjcostCodeItem, updateData.JobFk);		
									lookupService.attachData({'prjCostCodesByJob': [newPrjcostCodeItem]});
								
									platformGridAPI.grids.invalidate($scope.gridId);
									platformGridAPI.items.data($scope.gridId, costCodeLookupService.getTree());
									platformGridAPI.grids.refresh($scope.gridId);
									platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, newPrjcostCodeItem);
									
								}).catch(function (error) {
									console.error('Error generating code:', error);
								});
						}
					};

					platformTranslateService.translateFormConfig(service.layout.formConfiguration);
					platformModalFormConfigService.showDialog(service.layout);

				}).catch(function (error) {
					console.error('Error generating code:', error);
				});

			};

			function getDialogConfig() {
				return {
					fid: 'estimate.main.createNewCostCode',
					version: '1.0',
					showGrouping: true,
					groups: [
						{
							gid: 'ProjectCostCode',
							header$tr$:'esimate.main.basicInfo',
							header: 'Basic Information',
							isOpen: true
						},
						{
							gid: 'AdditionalInfo',
							header$tr$:'estimate.main.additionalInfo',
							header: 'Additional Information',
							isOpen: false
						}
					],
					rows: newLookupJson
				};
			}

			function generateCode(newCreatedItem, prjId, currentJobId, isPrjAssembly) {				
				let data = {
					NewCreatedItem: {
						...newCreatedItem,
						Id: newCreatedItem.OriginalId
					},
					ProjectId : prjId,
					JobId : currentJobId,
					IsPrjAssembly : isPrjAssembly
				}
				
				return $http.post(globals.webApiBaseUrl + 'project/costcodes/generatenewcode', data)
					.then(function (response) {
						return response.data;
					});				
			}

			return service;
		}]);
})();
