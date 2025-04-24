(function () {
	'use strict';
	let moduleName = 'controlling.generalcontractor';
	angular.module(moduleName).factory('createAdditionalExpenseWizardDialogService',['_', '$', '$timeout', '$q','globals', '$injector','$http', 'basicsLookupdataLookupFilterService', '$translate', 'platformTranslateService', 'platformModalService', 'controllingGeneralcontractorCostControlDataService', 'cloudDesktopPinningContextService',
		function (_,$,$timeout,$q, globals, $injector, $http, basicsLookupdataLookupFilterService, $translate, platformTranslateService, platformModalService, controllingGeneralcontractorCostControlDataService, cloudDesktopPinningContextService) {
			let service = {};
			let initDataItem = {};
			let projectContext = {};
			let isEditable = true;
			let isUnique = true;
			let readData = {};

			service.resetToDefault = function init () {
				projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
				let id = controllingGeneralcontractorCostControlDataService.getSelected() ? Math.abs(controllingGeneralcontractorCostControlDataService.getSelected().Id) : null;
				initDataItem = {
					ProjectFk: null,
					MdcControllingUnitFk:id,
					Code:'',
					Description:'',
					Amount:'',
					PrcPackageFk:null,
					ConHeaderFk:null,
					Comment:''
				};

				if(projectContext){
					initDataItem.ProjectFk = projectContext.id;
				}
			};

			service.getIsEditable = function getIsEditable() {
				return isEditable;
			};

			service.getIsUnique = function getIsUnique() {
				return isUnique;
			};

			function setFocus(){
				$timeout (function () {
					let elem = $('.domain-type-description');
					if (elem) {
						elem.focus().select();
					}
				},200);
			}

			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'gcc-additional-expense-package-filter',
					fn: function (contract, entity) {
						return entity.ProjectFk;
					}
				},
				{
					key: 'gcc-additional-expense-contract-filter',
					fn: function (contract, entity) {
						return entity.ProjectFk;
					}
				}
			]);

			service.getFormConfig = function getFormConfig () {
				return {
					fid: 'sales.wip.createAdditionalExpenseModal',
					version: '0.0.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'mdccontrollingunitfk', 'code', 'description', 'amount', 'prcpackagefk', 'conheaderfk', 'comment'
							]
						}
					],
					rows:[
						{
							gid: 'baseGroup',
							rid: 'mdccontrollingunitfk',
							model: 'MdcControllingUnitFk',
							sortOrder: 1,
							label: 'MdcControllingUnitFk',
							label$tr$: 'controlling.generalcontractor.ControllingUnitFk',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							readonly: true,
							options: {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'sales-common-controlling-unit-filter',
									showClearButton: true
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'code',
							model: 'Code',
							sortOrder: 2,
							label: 'Code',
							label$tr$: 'controlling.generalcontractor.Code',
							type: 'code',
							domain: 'code',
							readonly: 'true',
							asyncValidator: function (entity, value) {
								let defer = $q.defer();
								projectContext = _.find(cloudDesktopPinningContextService.getContext(), {token: 'project.main'});
								readData.ProjectFk = projectContext.id;
								readData.Code = value;
								$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/isExistCodeByProject', readData).then(function (response) {
									if (response && response.data) {
										isUnique = false;
										return defer.resolve({
											apply: true,
											valid: false,
											error$tr$: 'controlling.generalcontractor.uniqueValueErrorMessage',
										});
									} else {
										isUnique = true;
										return defer.resolve(true);
									}
								});
								return defer.promise;
							}
						},
						{
							gid: 'baseGroup',
							rid: 'description',
							model: 'Description',
							sortOrder: 3,
							label: 'Description',
							label$tr$: 'controlling.generalcontractor.Description',
							type: 'description',
							domain: 'description',
							required: 'true',
						},
						{
							gid: 'baseGroup',
							rid: 'amount',
							model: 'Amount',
							sortOrder: 4,
							label: 'Amount',
							label$tr$: 'controlling.generalcontractor.Amount',
							type: 'money',
							domain: 'amount',
							required: true,
						},
						{
							gid: 'baseGroup',
							rid: 'prcpackagefk',
							model: 'PrcPackageFk',
							sortOrder: 5,
							label: 'Package',
							label$tr$: 'controlling.generalcontractor.Package',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-general-contractor-additional-expense-package-lookup-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'gcc-additional-expense-package-filter',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												let selectedItem = args.entity;
												let selectedLookupItem = args.selectedItem;

												// pre-assign project from selected contract
												if (selectedItem && selectedLookupItem) {
													selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
												}
											}
										}
									]
								}
							}
						},
						{
							gid: 'baseGroup',
							rid: 'conheaderfk',
							model: 'ConHeaderFk',
							sortOrder: 6,
							label: 'Contract',
							type: 'directive',
							label$tr$: 'controlling.generalcontractor.Contract',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'controlling-general-contractor-additional-expense-contract-lookup-dialog',
								descriptionMember: 'Description',
								lookupOptions: {
									filterKey: 'gcc-additional-expense-contract-filter',
									showClearButton: true,
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												let selectedItem = args.entity;
												let selectedLookupItem = args.selectedItem;

												// pre-assign project from selected contract
												if (selectedItem && selectedLookupItem) {
													selectedItem.ProjectFk = selectedLookupItem.ProjectFk;
												}
											}
										}
									]
								}
							}
						},
						{
							gid: 'baseGroup',
							fid: 'comment',
							model: 'Comment',
							sortOrder: 7,
							label: 'Comment',
							label$tr$: 'controlling.generalcontractor.Comment',
							type: 'comment',
							domain: 'comment',
						}
					]
				};
			};

			service.CreateAdditionalExpenses =  function CreateAdditionalExpense(creationDatas){
				$http({
					method: 'POST',
					url:globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/createAdditionalExpenseStructure',
					data:creationDatas
				}).success(function (response) {
					if(response){
						if(response.NoDefaultJob){
							platformModalService.showMsgBox('controlling.generalcontractor.noDefaultJob', 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard', 'info');
						}else {
							console.log(response.timeStr.m_StringValue);
							platformModalService.showMsgBox ('controlling.generalcontractor.AdditionalExpenseWizardResult', 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard', 'info');
							$injector.get ('controllingGeneralcontractorCostControlDataService').refresh();
						}
					}
				}).error(function () {
					$injector.get ('controllingGeneralcontractorCostControlDataService').refresh();
				});
			};

			service.showDialog = function createAdditionalExpensesStructureWizard () {
				projectContext = _.find (cloudDesktopPinningContextService.getContext (), {token: 'project.main'});
				if(_.isNull(initDataItem.MdcControllingUnitFk)){
					platformModalService.showMsgBox('controlling.generalcontractor.NoControlingUnit', 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard', 'ico-info');
				} else {
					let searchData = {
						ProjectId: projectContext ? projectContext.id : -1,
						FixRateCheckType: 2
					};
					$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getProjectCostCodesIsEditable', searchData).then(function (response) {
						if(response && response.data){
							if(response.data.noGCCOrderSetting){
								platformModalService.showMsgBox('controlling.generalcontractor.noGCCOrderSetting', 'cloud.common.informationDialogHeader', 'info');
							}else if(!response.data.fixedRate){
								isEditable = response.data.isEditableShow;

								$http.post(globals.webApiBaseUrl + 'Controlling/GeneralContractor/GCAdditionalExpensesController/getEstimateHeaderByProject',searchData).then(function (response) {
									if(!response.data){
										platformModalService.showMsgBox($translate.instant('controlling.generalcontractor.NonexistentGCEstimateHeader'), $translate.instant('controlling.generalcontractor.CreateAdditionalExpensesStructureWizard'), 'ico-info');
										return;
									}

									if(response.data.IsReadOnly){
										platformModalService.showMsgBox ('controlling.generalcontractor.estHeaderIsReadOnly', 'cloud.common.informationDialogHeader', 'info');
										return;
									}

									initDataItem.Code = $translate.instant('controlling.generalcontractor.CodeDefault');
									let config = {
										title: $translate.instant ('controlling.generalcontractor.CreateAdditionalExpensesStructureWizard'),
										dataItem: initDataItem,
										formConfiguration: service.getFormConfig(),
										handleOK: function handleOK(result) {
											let creationDatas = [];
											let creationData = {
												MdcControllingUnitFk:result.data.MdcControllingUnitFk,
												Code: result.data.Code,
												Description: result.data.Description,
												Amount: result.data.Amount,
												PrcPackageFk: result.data.PrcPackageFk,
												ConHeaderFk: result.data.ConHeaderFk,
												Comment: result.data.Comment
											};
											creationDatas.push(creationData);
											let gccAddExpenseComplete = {
												ProjectId: projectContext ? projectContext.id : -1,
												GccAddExpenseItemDtos: creationDatas
											};
											service.CreateAdditionalExpenses(gccAddExpenseComplete);
										}
									};

									platformTranslateService.translateFormConfig(config.formConfiguration);

									let headerText = $translate.instant('controlling.generalcontractor.CreateAdditionalExpensesStructureWizard');

									platformModalService.showDialog({
										headerText: $translate.instant(headerText),
										dataItem: initDataItem,
										templateUrl: globals.appBaseUrl + 'controlling.generalcontractor/templates/create-additional-expense-dialog-template.html',
										backdrop: false,
										width: '700px',
										uuid: '806a245fa16642ec862525fea795a8e7'
									}).then(function (result) {
										if(result.ok){
											config.handleOK(result);
										} else {
											if (config.handleCancel) {
												config.handleCancel (result);
											}
										}
									});

									setFocus();
								});
							} else {
								platformModalService.showMsgBox('controlling.generalcontractor.AdditionalExpenseIsFixRate', 'controlling.generalcontractor.CreateAdditionalExpensesStructureWizard', 'info');
							}
						}
					});
				}
			};

			return service;
		}]);
})();