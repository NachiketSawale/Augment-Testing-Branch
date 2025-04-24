/**
 * Created by alm on 13/11/2017.
 */
/**
 * @ngdoc controller
 * @name procurementCommonReplaceNeutralMaterialWizardController
 * @function
 *
 * @description
 * Controller for the wizard dialog used to to replace neutral material
 **/
(function (angular) {

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonReplaceNeutralMaterialWizardController', ['$scope', '$translate', 'WizardHandler', 'platformTranslateService', 'platformGridAPI', 'procurementCommonReplaceNeutralMaterialService', 'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService', 'platformRuntimeDataService', 'platformModalService', 'procurementContextService', 'procurementCommonPrcItemDataService', 'procurementCommonPriceConditionService','platformManualGridService','basicsLookupdataLookupDataService',
		function ($scope, $translate, WizardHandler, platformTranslateService, platformGridAPI, procurementCommonReplaceNeutralMaterialService,
			basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService, platformRuntimeDataService, platformModalService, moduleContext, procurementCommonPrcItemDataService, procurementCommonPriceConditionService,platformManualGridService,basicsLookupdataLookupDataService) {
			$scope.wizard = $scope.modalOptions.value.wizard;
			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.steps = [
				{number: 0, identifier: 'basicOption', skip: false},
				{number: 1, identifier: 'replacement', skip: false}
			];
			$scope.selectStep = angular.copy($scope.steps[0]);
			$scope.matchingMaterialTitle = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.matchingMaterial');
			$scope.modalOptions.headerText=$translate.instant('procurement.common.wizard.replaceNeutralMaterial.title');
			$scope.isShowAIFunction = true;
			$scope.gridId='C10DDE19ED424A19AF345ABCD5785686';
			$scope.replaceCriteriaResult = {
				state: $scope.gridId
			};
			function setupCriteriaGrid(){
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var criteriaData = [{
						id: 1,
						selected: true,
						name: $translate.instant('procurement.common.wizard.replaceNeutralMaterial.byNeutralMaterialAssignment')
					},
					{
						id: 2,
						selected: true,
						name: $translate.instant('procurement.common.wizard.replaceNeutralMaterial.byIdenticalMaterialCode')
					},
					{
						id: 3,
						selected: true,
						name: $translate.instant('procurement.common.wizard.replaceNeutralMaterial.byProcurementStructure')
					}];
					var gridColumns = [
						{
							id: 'selected',
							field: 'selected',
							editor: 'boolean',
							formatter: 'boolean',
							name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.checked',
							width: 70
						},
						{

							id: 'name',
							field: 'name',
							name: 'name',
							name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.replaceCriteria',
							readonly: true,
							width: 200,
							formatter: 'description'
						}];
					var gridConfig = {
						columns: angular.copy(gridColumns),
						data: criteriaData,
						id: $scope.gridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: false,
							idProperty: 'id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridColumns);
				}
			}

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						sort: 0,
						caption: 'cloud.common.toolbarMoveUp',
						type: 'item',
						iconClass: 'tlb-icons ico-grid-row-up',
						fn: function () {
							platformManualGridService.moveRowInGrid($scope.gridId, 'up');
						}
					},
					{
						id: 't2',
						sort: 10,
						caption: 'cloud.common.toolbarMoveDown',
						type: 'item',
						fn: function () {
							platformManualGridService.moveRowInGrid($scope.gridId, 'down');
						},
						iconClass: 'tlb-icons ico-grid-row-down'
					}
				]
			};

			$scope.getCurrentStepNumber = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.currentStepNumber();
				} else {
					return '';
				}
			};

			$scope.getTotalStepCount = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.totalStepCount();
				} else {
					return '';
				}
			};

			$scope.getEnabledSteps = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.getEnabledSteps();
				} else {
					return [];
				}
			};

			function setCurrentStep(step) {
				$scope.selectStep = angular.copy($scope.steps[step]);
			}



			$scope.isLastStep = function () {
				if ($scope.selectStep) {
					return $scope.selectStep.number === $scope.steps.length - 1;
				} else {
					return true;
				}
			};


			$scope.getButtonText = function () {
				if ($scope.isLastStep()) {
					return $translate.instant('procurement.common.wizard.replaceNeutralMaterial.replace');
				}

				return $translate.instant('basics.common.button.nextStep');
			};

			$scope.mmcLookupOptions = {
				filterKey: 'basics-material-dis-neture-filter',
				events: [{
					name: 'onSelectedItemChanged', handler: function selectedMMCChanged(e, args) {
						if (args.selectedItem) {
							$scope.entity = args.selectedItem;
							$scope.haveCatalog = true;
						}
					}
				}]
			};

			var filters = [{
				key: 'basics-material-dis-neture-filter',
				serverSide: true,
				fn: function () {
					// return 'ISNEUTRAL =false';
					return '';
				}
			}, {
				key: 'procurement-common-neutral-mdcmaterial-filter',
				serverSide:true,
				fn:function(dataItem,searchOptions) {
					if (dataItem && dataItem.StructureId) {
						searchOptions.Filter = {
							PrcStructureId: dataItem.StructureId
						};
					}
					searchOptions.MaterialTypeFilter = {
						IsForProcurement: true
					};
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);


			$scope.refresh = function () {
				findSimulation(false);
			};

			$scope.aiItemAlternative = function () {
				findSimulation(true);
			};

			var parentService = $scope.modalOptions.value.parentService;
			var leadData = parentService.getSelected();
			var serviceName = parentService.getServiceName();
			var currentText = '';
			var allCurrentText = '';

			var project = _.find(basicsLookupdataLookupDescriptorService.getData('project'), {Id: leadData.ProjectFk});
			var projectName = '';
			$scope.noProject = true;
			if (project) {
				projectName = project.ProjectName;
				$scope.noProject = false;
			}
			var fromFlg = 0;
			var noObjectFound ='';
			if (serviceName.indexOf('Package') !== -1) {
				$scope.isShowAIFunction = false;
				currentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.currentPackage');
				noObjectFound = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noPackageFound');
				allCurrentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.allFromPackage') + ':' + projectName;
				fromFlg = 0;
			}
			else if (serviceName.indexOf('Requisition') !== -1) {
				currentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.currentRequsition');
				noObjectFound = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noRequsitionFound');
				allCurrentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.allFromRequisition') + ':' + projectName;
				fromFlg = 1;
			} else if (serviceName.indexOf('Contract') !== -1) {
				currentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.currentContract');
				noObjectFound = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noContractFound');
				allCurrentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.allFromContract') + ':' + projectName;
				fromFlg = 2;
			}else if (serviceName.indexOf('Quote') !== -1) {
				currentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.currentQuote');
				noObjectFound = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noQuoteFound');
				allCurrentText = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.allFromQuote') + ':' + projectName;
				fromFlg = 3;
			}

			$scope.currentScopeText = currentText;
			$scope.allCurrentScopeText = allCurrentText;

			$scope.resultFlg = 1;
			$scope.catalogFlg = 1;
			$scope.criteriaChooseArr = [1,2,3];
			// $scope.criteriaChooseArr.push(1);
			$scope.haveCatalog = true;
			$scope.haveCriteriaChooseArr = true;
			$scope.noMaterial = true;
			$scope.prcItemId = -1;
			$scope.dialogLoading = false;
			$scope.loadingInfo = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.loadingInfo');
			var prcItem = procurementCommonPrcItemDataService.getService().getSelected();
			if (prcItem && prcItem.MdcMaterialFk) {
				$scope.noMaterial = false;
				$scope.prcItemId = prcItem.Id;
			}

			$scope.onResult = function (param) {
				$scope.resultFlg = param;
			};
			$scope.onCatalogResult = function (param) {
				$scope.catalogFlg = param;
				if (0 === param) {
					$scope.haveCatalog = !!$scope.entity;
				}
				else {
					$scope.haveCatalog = true;
				}
			};
			/*
            $scope.onCriteriaChooseChange = function (param) {
                if ($scope.criteriaChooseArr.indexOf(param) >= 0) {
                    $scope.criteriaChooseArr.splice($scope.criteriaChooseArr.indexOf(param), 1);
                }
                else {
                    $scope.criteriaChooseArr.push(param);
                }
                if ($scope.criteriaChooseArr.length > 0) {
                    $scope.haveCriteriaChooseArr = true;
                }
                else {
                    $scope.haveCriteriaChooseArr = false;
                }
            };
            $scope.isCriteriaCheck = function (param) {
                return $scope.criteriaChooseArr.indexOf(param) >= 0;
            };
            */

			var simulationGridId = '17060CA12C09451FA5D20AF9608083A8';
			var resultMaterialGridId = '2794F1645E604F26AD1BE6BA3EF47FDA';

			function findSimulation(aiFlg) {
				// if (!checkCriteriaChooseArr($scope.criteriaChooseArr)) {
				//   return;
				// }

				var projectId = leadData.ProjectFk;
				var companyId = leadData.CompanyFk;
				var specificCatalogFk = 0;
				if (!$scope.catalogFlg) {
					specificCatalogFk = $scope.entity.Id;
				}
				var matchItems = {
					resultFlg: $scope.resultFlg,
					Id: leadData.Id,
					projectId: projectId,
					catalogFlg: !!$scope.catalogFlg,
					specificCatalogFk: specificCatalogFk,
					criteriaChooseArr: $scope.criteriaChooseArr,
					companyId: companyId,
					fromFlg: fromFlg,
					aiFlg: aiFlg,
					prcItemId: $scope.prcItemId
				};
				$scope.dialogLoading = true;
				procurementCommonReplaceNeutralMaterialService.getSimulation(matchItems).then(function (result) {
					if (aiFlg){
						$scope.matchingMaterialTitle = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.matchingMaterialByAI');
					}
					else
					{
						$scope.matchingMaterialTitle = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.matchingMaterial');
					}

					$scope.dialogLoading = false;
					var data = result.data;
					if (!platformGridAPI.grids.exist(simulationGridId)) {
						setupSimulationGrid();
					}
					if (data.main) {
						updateSimulationGrid(result.data.main);
					}
					if (!platformGridAPI.grids.exist(resultMaterialGridId)) {
						setupResultMaterialGrid();
					}

				}, function (error) {
					$scope.dialogLoading = false;
					window.console.error(error);
				});
			}

			setupCriteriaGrid();
			// $scope.nextDisableFlg=false;
			// $scope.nextDisableFlg1=false;
			$scope.nextStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				var projectId = leadData.ProjectFk;

				switch ($scope.selectStep.number) {
					case 0:
						var companyId = leadData.CompanyFk;
						var specificCatalogFk = 0;
						if (!$scope.catalogFlg) {
							specificCatalogFk = $scope.entity.Id;
						}
						var  grid = platformGridAPI.grids.element('id', $scope.gridId);
						var gridDatas = grid.dataView.getRows();
						var criteriaChooseArr=[];
						_.forEach(gridDatas,function(item){
							if(item.selected===true){
								criteriaChooseArr.push(item.id);
								$scope.criteriaChooseArr = criteriaChooseArr;
							}
						});
						if (!checkCriteriaChooseArr(criteriaChooseArr)) {
							break;
						}
						var matchItems = {
							resultFlg: $scope.resultFlg,
							Id: leadData.Id,
							projectId: projectId,
							catalogFlg: !!$scope.catalogFlg,
							specificCatalogFk: specificCatalogFk,
							criteriaChooseArr: criteriaChooseArr,
							companyId: companyId,
							fromFlg: fromFlg,
							prcItemId: $scope.prcItemId
						};
						$scope.dialogLoading = true;
						procurementCommonReplaceNeutralMaterialService.getSimulation(matchItems).then(function (result) {
							$scope.dialogLoading = false;
							var data = result.data;
							if (data.status === 1) {
								return platformModalService.showMsgBox(noObjectFound, 'Info', 'ico-info');
							}
							else if (data.status === 2) {
								return platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.noItemFound'), 'Info', 'ico-info');
							}
							else {
								var mainData = data.main;
								if (mainData.length === 0) {
									return platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.noNeutralFound'), 'Info', 'ico-info');
								}
								else {

									$scope.$parent.$parent.$parent.options.width = '1100px';
									wz.next();
									setCurrentStep($scope.selectStep.number + 1);

									setupSimulationGrid(mainData);
									setupResultMaterialGrid();
									updateSimulationGrid(mainData);

								}
							}
						}, function (error) {
							$scope.dialogLoading = false;
							window.console.error(error);
						});
						break;
					case 1:

						var simulationGrid = platformGridAPI.grids.element('id', simulationGridId);
						var simulationGridDatas = simulationGrid.dataView.getRows();
						var companyCurrencyId = moduleContext.companyCurrencyId;
						var selectGridDatas =[];
						_.forEach(simulationGridDatas,function(item){
							if(item.Selected&&item.MathingMaterialCode>0) {
								var obj = {
									Id: item.Id,
									MathingMaterialCode: item.MathingMaterialCode,
									Status:item.Status
								};
								selectGridDatas.push(obj);
							}

						});
						// var selectGridDatas = _.filter(gridDatas, {Selected: true});
						var param = {
							fromFlg: fromFlg,
							companyCurrencyId: companyCurrencyId,
							projectId: projectId,
							gridDatas: selectGridDatas,
							ParentTaxCodeFk: leadData.TaxCodeFk ? leadData.TaxCodeFk : -1,
							ParentVatGroupFk: leadData.BpdVatGroupFk
						};

						$scope.dialogLoading = true;
						procurementCommonReplaceNeutralMaterialService.goReplace(param).then(function (result) {
							$scope.modalOptions.cancel();
							$scope.dialogLoading = false;
							if (result.data) {
								platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.replaceSuccess'), 'Info', 'ico-info');
								procurementCommonPrcItemDataService.getService().loadSubItemsList().then(function () {
									procurementCommonPrcItemDataService.getService().goToFirst();
									var selectEntity = procurementCommonPrcItemDataService.getService().getSelected();
									if (selectEntity) {
										var priceConditionService = procurementCommonPriceConditionService.getService();
										priceConditionService.clearCache();
										priceConditionService.reload(selectEntity, selectEntity.PrcPriceConditionFk).then(function() {
											parentService.update();
										});
									}

								});
							}
							else {
								platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.replaceFailure'), 'Info', 'ico-info');
							}
						});
						wz.next();
						break;
				}
				if ($scope.selectStep.number > 0) {
					setCurrentStep($scope.selectStep.number + 1);
				}
			};

			$scope.previousStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				wz.previous();
				$scope.$parent.$parent.$parent.options.width = '650px';
				switch ($scope.selectStep.number) {
					case 1:
						setupCriteriaGrid();
						setCurrentStep($scope.selectStep.number - 1);
						break;
				}
			};


			$scope.simulationAndReplacement = {
				state: simulationGridId
			};

			$scope.resultMaterial = {
				state: resultMaterialGridId
			};

			$scope.disableReplace = true;
			function checkAll() {
				var gridData = platformGridAPI.items.data(simulationGridId);
				_.forEach(gridData, function (item) {
					if (0 === item.Status) {
						item.Selected = false;
					}
				});
				platformGridAPI.items.data(simulationGridId, gridData);
				$scope.$apply(function () {
					canReplace();
				});
			}

			function onSelectedRowsChanged(e, args) {
				var grid = args.grid,
					row = args.rows[0],
					dataItem = grid.getDataItem(row);
				if (dataItem) {
					updateResultMaterialGrid(dataItem.ReplaceMaterials);
				}
				else {
					updateResultMaterialGrid([]);
				}
			}

			function canReplace() {
				var gridData = platformGridAPI.items.data(simulationGridId);
				var find = _.find(gridData, {Selected: true});
				$scope.disableReplace = !find;
			}

			$scope.$watch(function () {
				canReplace();
			});


			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(simulationGridId)) {
					platformGridAPI.events.unregister(simulationGridId, 'onHeaderCheckboxChanged', checkAll);
					platformGridAPI.events.unregister(simulationGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.grids.unregister(simulationGridId);
				}
				if (platformGridAPI.grids.exist(resultMaterialGridId)) {
					platformGridAPI.grids.unregister(resultMaterialGridId);
				}
			});

			var failedTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.failedTranslate');
			var passedTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.passedTranslate');
			var passedConvertedTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.passedConvertedTranslate');
			var noSelectedOptionTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noSelectedOptionTranslate');

			function setupSimulationGrid(arrData) {
				if (platformGridAPI.grids.exist(simulationGridId)) {
					platformGridAPI.events.unregister(simulationGridId, 'onHeaderCheckboxChanged', checkAll);
					platformGridAPI.events.unregister(simulationGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
					platformGridAPI.grids.unregister(simulationGridId);
				}
				if (!platformGridAPI.grids.exist(simulationGridId)) {
					var titleFailed = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.QuantityUomCannotConvertibleTip');
					var noFoundTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.noFoundTranslate');
					var simulationGridColumns = [{
						id: 'Selected',
						field: 'Selected',
						name: 'All',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.all',
						editor: 'boolean',
						headerChkbox: true,
						formatter: 'boolean',
						cssClass: 'cell-center',
						width: 50
					},
					{
						id: 'Status',
						field: 'Status',
						name: 'Status',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.replaceStatus',
						readonly: true,
						width: 120,
						sortable: true,
						formatter: function (row, cell, value) {
							var status = 'Failed';
							if (1 === value) {
								status = passedTranslate;
							}
							else if (2 === value) {
								status = passedConvertedTranslate;
							}
							else if (3 === value) {
								status = '<span title="' + titleFailed + '!" class="invalid-cell">' + failedTranslate + '</span>';
							}
							else if (5 === value) {
								status = noSelectedOptionTranslate;
							}
							else {
								status = noFoundTranslate;
							}
							return status;
						}
					},
					{
						id: 'MaterialCode',
						field: 'MaterialCode',
						name: 'Material Code',
						width: 100,
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						sortable: true,
						readonly: true
					},
					{
						id: 'MaterialDescription',
						field: 'MaterialCode',
						width: 120,
						name: 'Material Description',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'DescriptionInfo.Translated'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialDescripton',
						sortable: true,
						readonly: true
					},
					{
						id: 'MaterialUoM',
						field: 'MaterialCode',
						width: 120,
						name: 'Material UoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'UomInfo.Translated'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialUoM',
						sortable: true,
						readonly: true
					},
					{
						id: 'MaterialCurrentPrice',
						field: 'CurrentPrice',
						width: 140,
						name: 'Material Current Price',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialCurrentPrice',
						readonly: true,
						sortable: true,
						formatter: 'money'
					},
					{
						id: 'MathingMaterialCode',
						field: 'MathingMaterialCode',
						width: 130,
						name: 'Mathing Mat.Code',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.mathingMaterialCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						sortable: true,
						editor: 'lookup',
						validator: function (item, value/* , model */) {
							var oldMathingMaterialCode = item.MathingMaterialCode;
							if (!_.isNil(value)) {
								procurementCommonReplaceNeutralMaterialService.getHomePrice(value, item.Id).then(function (result) {
									basicsLookupdataLookupDataService.getItemByKey('MaterialCommodity', value).then(function (response) {
										var param = {
											entity: item,
											selectedItem: response,
											homePrice: (result.data === 0 ? null : result.data)
										};
										onMaterialFilterSelectedItemChanged(param, false);
									});

								}, function () {
									item.MathingMaterialCode = oldMathingMaterialCode;
									updateSimulationGridSelectedRow();
								});
							}
							else {
								var param = {
									entity: item,
									selectedItem: null
								};
								onMaterialFilterSelectedItemChanged(param, false);
							}
						},

						editorOptions: {
							lookupOptions: {
								filterKey: 'procurement-common-neutral-mdcmaterial-filter',
								showClearButton: true
							},
							directive: 'basics-material-material-lookup'
						}
					},
					{
						id: 'MathingMaterialDescripton',
						field: 'MathingMaterialCode',
						width: 150,
						name: 'Mathing Mat.Descripton',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.mathingMaterialDescripton',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'DescriptionInfo.Translated'
						},
						sortable: true,
						readonly: true
					},
					{
						id: 'MathingMaterialSupplier',
						field: 'MathingSupplier',
						width: 140,
						name: 'Mathing Mat.Supplier',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.mathingSupplier',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						sortable: true,
						readonly: true
					},
					{
						id: 'MathingMaterialPrice',
						field: 'MatchingPrice',
						width: 140,
						name: 'Mathing Mat.Price',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.mathingPrice',
						readonly: true,
						sortable: true,
						formatter: 'money'
					},
					{
						id: 'Variance',
						field: 'Variance',
						width: 140,
						name: 'Variance',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.variance',
						readonly: true,
						sortable: true,
						formatter: 'money'
					},
					{
						id: 'VariancePercent',
						field: 'VariancePercent',
						width: 140,
						name: 'Variance Percent',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.variancePercent',
						readonly: true,
						sortable: true,
						formatter: 'percent'
					}
					];
					var simulationGridConfig = {
						columns: angular.copy(simulationGridColumns),
						data: arrData||[],
						id: simulationGridId,
						lazyInit: true,
						enableConfigSave: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: '',
							multiSelect: false
						}
					};
					platformGridAPI.grids.config(simulationGridConfig);
					platformTranslateService.translateGridConfig(simulationGridConfig.columns);
					platformGridAPI.events.register(simulationGridId, 'onHeaderCheckboxChanged', checkAll);
					platformGridAPI.events.register(simulationGridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				}
			}

			function setupResultMaterialGrid() {
				if (platformGridAPI.grids.exist(resultMaterialGridId)){
					platformGridAPI.grids.unregister(resultMaterialGridId);
				}
				if (!platformGridAPI.grids.exist(resultMaterialGridId)) {
					var neutralTypeTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.neutralTypeTranslate');
					var codeTypeTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.codeTypeTranslate');
					var structureTypeTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.structureTypeTranslate');
					var aiTypeTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.aiTypeTranslate');
					var uomCantConvertTranslate = $translate.instant('procurement.common.wizard.replaceNeutralMaterial.uomCantConvertTranslate');
					var resultMaterialGridColumns = [{
						id: 'Selected',
						field: 'Selected',
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center',
						validator: resultMaterialGridSelectedColomnValidator,
						width: 50
					},
					{
						id: 'Status',
						field: 'Status',
						name: 'Status',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.status',
						sortable: true,
						width: 120,
						formatter: function (row, cell, value) {
							var status = 'Failed';
							if (1 === value) {
								status = passedTranslate;
							}
							else if (2 === value) {
								status = passedConvertedTranslate;
							}
							else {
								status = uomCantConvertTranslate;
							}

							return status;
						}
					},
					{
						id: 'Type',
						name: 'Type',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.type',
						field: 'Type',
						width: 80,
						sortable: true,
						formatter: function (row, cell, value) {
							var type = '';
							if ('Neutral' === value) {
								type = neutralTypeTranslate;
							}
							else if ('Code' === value) {
								type = codeTypeTranslate;
							}
							else if ('Structure' === value) {
								type = structureTypeTranslate;
							}
							else if ('AI' === value) {
								type = aiTypeTranslate;
							}
							return type;
						}
					},
					{
						id: 'MaterialCode',
						field: 'MaterialCode',
						name: 'Material Code',
						width: 100,
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialCode',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						sortable: true,
						readonly: true
					},
					{
						id: 'MaterialDescription',
						field: 'MaterialCode',
						width: 120,
						name: 'Material Description',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'DescriptionInfo.Translated'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialDescripton',
						sortable: true,
						readonly: true
					},
					{
						id: 'MaterialPrice ',
						field: 'MaterialPrice',
						width: 150,
						name: 'Price',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.materialPrice',
						sortable: true,
						readonly: true,
						formatter: 'money'
					},
					{
						id: 'MaterialUoM',
						field: 'MaterialCode',
						width: 120,
						name: 'UoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'UomInfo.Translated'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.matchingMaterialUoM',
						sortable: true,
						readonly: true
					},
					{
						id: 'ConvertPrice ',
						field: 'ConvertPrice',
						width: 150,
						name: 'Convert Price',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.convertPrice',
						sortable: true,
						readonly: true,
						formatter: 'money'
					},
					{
						id: 'SubstitutePrice ',
						field: 'SubstitutePrice',
						width: 150,
						name: 'Substitute Price',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.substitutePrice',
						sortable: true,
						readonly: true,
						formatter: 'money'
					},
					{
						id: 'SubstituteUoM',
						field: 'SubstituteMaterialId',
						width: 120,
						name: 'Substitute UoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'UomInfo.Translated'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.substituteUoM',
						sortable: true,
						readonly: true
					},
					{
						id: 'Variance',
						field: 'Variance',
						width: 140,
						name: 'Variance',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.variance',
						sortable: true,
						readonly: true,
						formatter: 'money'
					},
					{
						id: 'VariancePercent',
						field: 'VariancePercent',
						width: 140,
						name: 'Variance Percent',
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.variancePercent',
						sortable: true,
						readonly: true,
						formatter: 'percent'
					},
					{
						id: 'BpdSupplierFk',
						field: 'BpdBusinesspartnerFk',
						width: 120,
						name: 'supplier',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'BusinessPartner',
							displayMember: 'BusinessPartnerName1'
						},
						name$tr$: 'procurement.common.wizard.replaceNeutralMaterial.supplier',
						sortable: true,
						readonly: true
					}
					];
					var resultMaterialGridConfig = {
						columns: angular.copy(resultMaterialGridColumns),
						data: [],
						id: resultMaterialGridId,
						lazyInit: true,
						enableConfigSave: true,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(resultMaterialGridConfig);
					platformTranslateService.translateGridConfig(resultMaterialGridConfig.columns);
				}
			}

			function updateSimulationGrid(data) {
				_.forEach(data, function (item) {
					if (1 === item.Status || 2 === item.Status) {
						setReadOnly(item, 'Selected', false);
					}
					else {
						setReadOnly(item, 'Selected', true);
					}

				});
				platformGridAPI.items.data(simulationGridId, data);
			}

			function updateResultMaterialGrid(data) {
				_.forEach(data, function (item) {
					if (1 === item.Status || 2 === item.Status) {
						setReadOnly(item, 'Selected', false);
					}
					else {
						setReadOnly(item, 'Selected', true);
					}

				});
				platformGridAPI.items.data(resultMaterialGridId, data);
			}

			function setReadOnly(item, model, flg) {
				platformRuntimeDataService.readonly(item, [{
					field: model,
					readonly: flg
				}]);
			}

			function resultMaterialGridSelectedColomnValidator(entity, value/* , model */) {
				var selectedMaterial = setResultMaterialGridSelectedRow(entity, value);
				var simulationGrid = platformGridAPI.grids.element('id', simulationGridId).instance;
				var row = simulationGrid.getSelectedRows();
				var parentItem = simulationGrid.getDataItem(row);
				if (parentItem) {
					var args = {
						selectedItem: selectedMaterial,
						entity: parentItem,
						homePrice: entity.ConvertPrice
					};
					onMaterialFilterSelectedItemChanged(args, true);
				}
			}

			function onMaterialFilterSelectedItemChanged(args, isSelectFromGrid) {
				var selectedItem = args.selectedItem;
				if (selectedItem) {
					var param = {
						prcItemId: args.entity.Id,
						materialId: selectedItem.Id
					};
					args.entity.MathingMaterialCode = selectedItem.Id;
					args.entity.MathingSupplier = selectedItem.BpdBusinesspartnerFk;
					args.entity.MatchingPrice = args.homePrice;
					if (_.isNil(args.entity.MatchingPrice)) {
						args.entity.Variance = null;
					}
					else {
						args.entity.Variance = args.entity.MatchingPrice - args.entity.CurrentPrice;
					}
					if (!_.isNil(args.entity.Variance)&& args.entity.CurrentPrice !== 0) {
						args.entity.VariancePercent = (args.entity.Variance / args.entity.CurrentPrice) * 100;
					}
					else {
						args.entity.VariancePercent = null;
					}
					procurementCommonReplaceNeutralMaterialService.canReplace(param).then(function (result) {
						var data = result.data;
						args.entity.Status = data.Status;
						args.entity.Selected = data.Selected;
						if (3 !== data.Status) {
							setReadOnly(args.entity, 'Selected', false);
						}
						else {
							setReadOnly(args.entity, 'Selected', true);
						}

						updateSimulationGridSelectedRow();
						if (!isSelectFromGrid) {
							linkageResultMaterialGrid(selectedItem.Id, true);
						}
					});
				} else {
					args.entity.MathingMaterialCode = null;
					args.entity.MathingSupplier = null;
					args.entity.Selected = false;
					// var havePass=_.find(args.entity.ReplaceMaterials,function(item){return item.Status==1||item.Status==2});
					args.entity.Status = args.entity.ReplaceMaterials.length>0?5:0;
					args.entity.MatchingPrice = null;
					args.entity.Variance = null;
					args.entity.VariancePercent = null;
					setReadOnly(args.entity, 'Selected', true);
					if (isSelectFromGrid) {
						updateSimulationGridSelectedRow();
					}
					else {
						linkageResultMaterialGrid(null, false);
					}
				}
			}

			function updateSimulationGridSelectedRow() {
				var simulationGrid = platformGridAPI.grids.element('id', simulationGridId).instance;
				if (simulationGrid) {
					var row = simulationGrid.getSelectedRows();
					simulationGrid.updateRow(row);
				}
			}

			function clearResultMaterialGridSelectedRow(ResultMaterialGridData) {
				_.forEach(ResultMaterialGridData, function (item) {
					item.Selected = false;
				});
			}

			function linkageResultMaterialGrid(materialId, isSelected) {
				var resultMaterialGridData = platformGridAPI.items.data(resultMaterialGridId);
				var entity = _.find(resultMaterialGridData, {MaterialCode: materialId});
				if (entity) {
					setResultMaterialGridSelectedRow(entity, isSelected);
				}
				else {
					clearResultMaterialGridSelectedRow(resultMaterialGridData);
				}
				updateResultMaterialGrid(resultMaterialGridData);
			}

			function setResultMaterialGridSelectedRow(entity, value) {
				var selectedMaterial;
				if (value) {
					var resultMaterialGridData = platformGridAPI.items.data(resultMaterialGridId);
					clearResultMaterialGridSelectedRow(resultMaterialGridData);
					entity.Selected = value;
					// selectedMaterial = entity.MaterialCommodity;
					selectedMaterial=entity;
					updateResultMaterialGrid(resultMaterialGridData);
				}
				else {
					entity.Selected = value;
					selectedMaterial = null;
				}
				return selectedMaterial;
			}

			function checkCriteriaChooseArr(criteriaChooseArr) {
				if (criteriaChooseArr.length === 0) {
					platformModalService.showMsgBox($translate.instant('procurement.common.wizard.replaceNeutralMaterial.errorNoReplaceCriteriaSelected'), 'Info', 'ico-info');
					return false;
				}
				return true;
			}

		}]);

})(angular);
