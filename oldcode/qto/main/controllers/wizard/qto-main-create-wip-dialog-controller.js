
(function (angular) {
	'use strict';
	// jshint -W072
	angular.module('qto.main').controller('qtoMainCreateWipDialogController',
		['_', '$log','globals','$http', '$timeout', '$scope', '$q', '$injector', '$translate', 'platformGridAPI', 'platformModalService', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'qtoMainCreateWipDialogService','basicsLookupdataSimpleLookupService', 'salesCommonBillTypeLookupOptions',
			function (_, $log,globals, $http,$timeout, $scope, $q, $injector, $translate, platformGridAPI, platformModalService,platformDataValidationService, platformRuntimeDataService, platformTranslateService, dialogConfigService,basicsLookupdataSimpleLookupService, salesCommonBillTypeLookupOptions) {

				let generateType = '1'; /* 1: create; 2: update */
				let salesWipValidationService = $injector.get('salesWipValidationService');
				let qtoDetailIds  =[];
				let qtoMainDetailService = $injector.get('qtoMainDetailService');
				let salesConIds = [], mapSalesConIds = [];


				$scope.qtoLinesLength =[];
				$scope.QtoScope = 3;
				$scope.options = $scope.$parent.modalOptions;
				$scope.dataItem = $scope.options.dataItem;
				let purposeType = $scope.dataItem.purposeType;
				$scope.modalOptions = {
					headerText: $scope.options.headerText,
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};


				// preserve option flag IsCollectiveWIP, we take option from service here
				// TODO: for better testing
				$scope.dataItem.IsCollectiveWip = $injector.get('salesContractCreateWipWizardDialogService').getCollectiveWIP();

				$scope.assignError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('sales.wip.AssignmentError',{param: (purposeType ==='bill')? 'Bill':'Wip'}),
					iconCol: 1,
					type: 3
				};

				$scope.qtoLineValidationError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('sales.wip.warningOfQtoLineWithValidationError'),
					iconCol: 1,
					type: 1
				};

				let warningMessageQtoScope = $translate.instant(purposeType === 'bill' ? 'qto.main.wizard.warningBillQtoScopeError' : 'qto.main.wizard.warningOfQtoScopeError');
				$scope.qtoScopeError = {
					show: false,
					messageCol: 1,
					message: warningMessageQtoScope,
					iconCol: 1,
					type: 3
				};

				function getFormConfig(purposeType) {
					let config = dialogConfigService.getFormConfig(purposeType);

					_.each($scope.options.readOnlyRows, function (rowName) {
						let row = _.find(config.rows, {rid: rowName});
						if (row) {
							row.readonly = true;
						}
					});

					// apply field visable extensions, if available
					if (!angular.isUndefined($scope.options.unvisibleRows) && $scope.options.unvisibleRows !== null) {
						_.each($scope.options.unvisibleRows, function (rowName) {
							let row = _.find(config.rows, {rid: rowName});
							if (row) {
								row.visible = false;
							}
						});
					}

					return config;
				}

				function dealQtoScope(sourceType) {
					$timeout(function () {
						let isWip = purposeType === 'wip';
						qtoDetailIds = [];
						let qtoScopeList = [];
						if ($scope.QtoScope === 1 || $scope.QtoScope === 2) {

							if (sourceType === 'updatewith') {

								if ($scope.QtoScope === 1) {
									qtoScopeList = qtoMainDetailService.getSelectedEntities();
								} else if ($scope.QtoScope === 2) {
									let grid = platformGridAPI.grids.element('id', qtoMainDetailService.getGridId());
									qtoScopeList = grid.dataView.getFilteredItems().rows;
								}
								let qtoScopeListByFilter = _.filter(qtoScopeList, function (d) {
									return isWip ? d.WipHeaderFk === $scope.dataItem.WipHeaderFk : d.BilHeaderFk === $scope.dataItem.BilHeaderFk;
								});

								if ($scope.dataItem.updateWith === '3') {
									qtoDetailIds = _.map(qtoScopeList, 'Id');
								} else if ($scope.dataItem.updateWith === '1') {
									qtoDetailIds = _.map(qtoScopeListByFilter, 'Id');
								}

							} else if ($scope.dataItem && ($scope.dataItem.WipHeaderFk || $scope.dataItem.BilHeaderFk)) {
								let promise = isWip ? dialogConfigService.getQtoCountByWipId($scope.dataItem.WipHeaderFk) : dialogConfigService.getQtoCountByBillId($scope.dataItem.BilHeaderFk);
								promise.then(function (response) {
									qtoScopeList = [];
									if ($scope.QtoScope === 1) {
										qtoScopeList = qtoMainDetailService.getSelectedEntities();
									} else if ($scope.QtoScope === 2) {
										let grid = platformGridAPI.grids.element('id', qtoMainDetailService.getGridId());
										qtoScopeList = grid.dataView.getFilteredItems().rows;
									}
									let qtoScopeListByFilter = _.filter(qtoScopeList, function (d) {
										return isWip ? d.WipHeaderFk === $scope.dataItem.WipHeaderFk : d.BilHeaderFk === $scope.dataItem.BilHeaderFk;
									});
									$scope.qtoScopeError.show = false;
									if (!(response && response.data && response.data > 0 && response.data !== qtoScopeListByFilter.length)) {

										if ($scope.dataItem.updateWith === '3') {
											qtoDetailIds = _.map(qtoScopeList, 'Id');
										} else if ($scope.dataItem.updateWith === '1') {
											qtoDetailIds = _.map(qtoScopeListByFilter, 'Id');
										}

									} else {
										$scope.qtoScopeError.show = true;
									}
								});
							} else {
								$scope.qtoScopeError.show = true;
							}
						} else {
							$scope.qtoScopeError.show = isWip ? !$scope.dataItem.WipHeaderFk : !$scope.dataItem.BilHeaderFk;
						}
					});
				}

				// translate form config.
				let formConfig = getFormConfig(purposeType);
				let gridOptions = _.get(_.find(formConfig.rows, {rid: 'contractsGrid'}), 'options');

				$scope.onSelectionChanged = function (newValue) {
					$scope.dataItem.BilHeaderFk = null;
					$scope.dataItem.WipHeaderFk = null;
					generateType = newValue;
					$scope.dataItem.Code = '';
					let validationService = $injector.get('salesWipValidationService');
					validationService.removeError($scope.dataItem, 'Code');
					_.forEach(formConfig.rows, function (row) {
						if (row.rid === 'UpdateWith') {
							row.visible = newValue === '2';
						}

						if (row.rid === 'code') {
							if (generateType === '1') {
								if (purposeType === 'bill') {
									row.label$tr$ = 'qto.main.entityBillNo';
									row.model = 'Code';
									row.type = 'code';
									row.label = 'Bill No';
									row.required= true;
								} else {
									row.label = 'Code';
									row.model = 'Code';
									row.type = 'code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.required= true; // TODO: why false? see #127248 (remaining part)
								}
							} else {
								if (purposeType === 'bill') {
									row.label$tr$ = 'qto.main.entityBillNo';
									row.model = 'Code';
									row.type = 'directive';
									row.label = 'Bill No';
									row.directive = 'sales-billing-no-selector';
									row.options.filterKey = 'qto-sales-billing-no-filter';
									row.options.events = [{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let selectedItem = args.entity;
											let selectedLookupItem = args.selectedItem;

											if (selectedItem && selectedLookupItem) {
												selectedItem.PreviousBillFk = selectedLookupItem.PreviousBillFk;
											}

											dialogConfigService.onCodeChage.fire();
											dialogConfigService.loadSalesContracts.fire();
										}
									}
									];
									row.asyncValidator = null;

								} else {
									row.type = 'directive';
									row.label = 'Code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.directive = 'qto-main-wip-code-grid-selector';
									row.options.filterKey = 'qto-sales-wip-code-filter';
									row.validator = salesWipValidationService.validateCode;
									row.asyncValidator = null;
									row.required=  true;
								}
							}

							if (newValue === '2') {
								dialogConfigService.cancelCodeFieldReadonly($scope.dataItem);
							} else {
								dialogConfigService.setCodeFieldReadOnlyByRubricCategory($scope.dataItem, $scope.dataItem.RubricCategoryFk);
							}
						}

						if (row.rid === 'ordheaderfk' && $scope.options.readOnlyRows.indexOf(row.rid) === -1) {
							row.readonly = newValue === '2';
						}

						if (row.rid === 'PreviousBillFk') {
							row.readonly = newValue === '2';
							$scope.dataItem.PreviousBillFk = null;
						}

						if (row.rid === 'PreviousWipFk') {
							row.readonly = newValue === '2';
							$scope.dataItem.PreviousWipFk = null;
						}
					});

					$scope.assignError.show = false;

					if(!$scope.dataItem.IsForQto){
						return;
					}

					if (newValue === '1') {
						let qtoScopeList = qtoMainDetailService.getSelectedEntities();
						if ($scope.QtoScope === 1 && qtoScopeList && !qtoScopeList.length) {
							$scope.assignError.show = true;

						}else {
							dialogConfigService.getListByQtoHeaderId(purposeType).then(function (response) {
								$scope.assignError.show = true;
								$scope.qtoLinesLength = response.data.qtoLinesLength;
								console.log(response.data.timeStr);
								if (response.data.hasEmtpyQtos) {
									$scope.assignError.show = false;
								}
							});
						}

						if(purposeType === 'wip') {
							platformRuntimeDataService.readonly ($scope.dataItem, [{
								field: 'IsCollectiveWip',
								readonly: false
							}]);

							if ($scope.dataItem.OrdHeaderFk) {
								suggestPreviousWipId($scope.dataItem.OrdHeaderFk,$scope.dataItem.BoqHeaderFk);
							}
						} else {
							if ($scope.dataItem.OrdHeaderFk) {
								suggestPreviousBillId($scope.dataItem.OrdHeaderFk,$scope.dataItem.BoqHeaderFk);
							}
						}
						$scope.qtoScopeError.show = false;
					}else{
						if(!$scope.qtoLinesLength){
							$scope.assignError.show = true;
						}
						dealQtoScope();

						if(purposeType === 'wip') {
							$scope.dataItem.IsCollectiveWip = false;
							platformRuntimeDataService.readonly ($scope.dataItem, [{
								field: 'IsCollectiveWip',
								readonly: true
							}]);
						}
					}

					$scope.qtoLineValidationError.show = false;
					if(!$scope.assignError.show){
						let qtoLines = qtoMainDetailService.getList();

						_.forEach(qtoLines,function(qtoLine){
							if(qtoLine.__rt$data.errors){
								_.forEach(qtoLine.__rt$data.errors, function(error){
									if(error && !_.isEmpty(error)){
										$scope.qtoLineValidationError.show = true;
									}
								});
							}
						});
					}

					$scope.$parent.$broadcast('form-config-updated', {});
				};
				platformTranslateService.translateFormConfig(formConfig);

				$scope.$watch('dataItem.IsCollectiveWip', function (newIsCollectiveWip) {
					// toggle grid readonly
					if(purposeType === 'wip' &&  dialogConfigService.getContractGridId ()) {
						let contractGrid = platformGridAPI.grids.element ('id', dialogConfigService.getContractGridId ());
						if (contractGrid) {
							contractGrid.dataView.setItems([]);
						}
						gridOptions.readonly = newIsCollectiveWip;
						dialogConfigService.setCollectiveWIP (newIsCollectiveWip);
					}
				});

				$scope.formContainerOptions = {
					statusInfo: function () {
					}
				};

				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};

				$scope.hasErrors = function checkForErrors() {
					let hasError = false;
					if ($scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors) {
						let errors = $scope.dataItem.__rt$data.errors;
						for (let prop in errors) {
							if (errors[prop] !== null) {
								hasError = true;
								break;
							}
						}
					}

					if(dialogConfigService.getContractGridId ()) {
						let contractGrid = platformGridAPI.grids.element ('id', dialogConfigService.getContractGridId ());
						if (contractGrid) {
							let contracts = contractGrid.dataView.getItems ();
							hasError = true;
							if (contracts && contracts.length) {
								let markedContracts = _.filter (contracts,function (d){
									return d.IsMarked;
								});

								hasError =(markedContracts && markedContracts.length<=0);
							}
						}
					}

					if(_.isEmpty($scope.dataItem.Code)){
						hasError = true;
					}

					return hasError || $scope.assignError.show || $scope.qtoScopeError.show;
				};

				let attributes = {
					OrdHeaderFk: {
						mandatory: true,
						required: true,
						errorParam: $translate.instant('sales.common.Contract')
					},
					Code: {
						mandatory: true,
						required: true,
						errorParam: $translate.instant('cloud.common.entityCode')
					},
					ClerkFk: {
						mandatory: true,
						required: true,
						errorParam: $translate.instant('basics.clerk.entityClerk')
					}
				};

				function handlerError() {
					let dataItem = $scope.dataItem;
					for (let attr in attributes) {
						if (attr === 'Code' && generateType === '1') {
							continue;
						}

						if (_.has(attributes, attr)) {
							if (attributes[attr].required) {
								let errParam = attributes[attr].errorParam ? {fieldName: attributes[attr].errorParam} : null;
								let validateResult = platformDataValidationService.isMandatory(dataItem[attr], attr, errParam);
								platformRuntimeDataService.applyValidationResult(validateResult, dataItem, attr);
							}
						}
					}
				}

				function getDefaultBillingType() {
					return basicsLookupdataSimpleLookupService.getDefault(salesCommonBillTypeLookupOptions);
				}

				function getDefaultConctract() {
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let param = {
						projectId:$scope.dataItem.ProjectFk,
						boqHeaderFk:qtoHeader.BoqHeaderFk
					};
					return $http.post(globals.webApiBaseUrl + 'sales/contract/GetContractByBaseBoqHeaderId',param);
				}

				function int(){
					dialogConfigService.setPurposeType(purposeType);

					_.forEach(formConfig.rows, function (row) {
						if(row.rid === 'typefk'){
							row.visible = purposeType === 'bill';
						}

						if (row.rid === 'code') {
							if (generateType === '1') {
								if (purposeType === 'bill') {
									row.label$tr$ = 'qto.main.entityBillNo';
									row.model = 'Code';
									row.type = 'code';
									row.label = 'Bill No';
								} else {
									row.label = 'Code';
									row.model = 'Code';
									row.type = 'code';
									row.label$tr$ = 'cloud.common.entityCode';
								}
							} else {
								if (purposeType === 'bill') {
									row.label$tr$ = 'qto.main.entityBillNo';
									row.model = 'Code';
									row.type = 'directive';
									row.label = 'Bill No';
									row.directive = 'sales-billing-no-selector';
									row.options.filterKey = 'qto-sales-billing-no-filter';
									row.asyncValidator = null;
									row.readonly = false;
								} else {
									row.type = 'directive';
									row.label = 'Code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.directive = 'qto-main-wip-code-grid-selector';
									row.options.filterKey = 'qto-sales-wip-code-filter';
									row.validator = salesWipValidationService.validateCode;
									row.asyncValidator = null;
									row.readonly = false;
								}
							}
						}

						if(row.rid === 'UpdateWith'){
							if(row.options && row.options.items && row.options.items.length) {
								if (purposeType === 'bill') {
									row.options.items[0].Description =  $translate.instant('qto.main.wizard.create.bill.allQtoSelected');
									row.options.items[1].Description= $translate.instant('qto.main.wizard.create.bill.allAbove');
								} else {
									row.options.items[0].Description =  $translate.instant('qto.main.wizard.create.wip.allQtoSelected');
									row.options.items[1].Description= $translate.instant('qto.main.wizard.create.wip.allAbove');
								}
							}
						}
					});

					// set default rubric category
					let lookupService = 'basicsMasterDataRubricCategoryLookupDataService';
					let rubricCategoryDataService = $injector.get(lookupService);

					if (purposeType === 'bill') {
						rubricCategoryDataService.setFilter(7);
						getDefaultBillingType().then(function (typeEntity) {
							$scope.dataItem.TypeFk = _.get(typeEntity, 'Id') || $scope.dataItem.TypeFk;
						});
					} else {
						rubricCategoryDataService.setFilter(17);
					}
					rubricCategoryDataService.getList({lookupType: lookupService}).then(function (data) {
						let defaultItem = _.find(data, {IsDefault: true});
						$scope.dataItem.RubricCategoryFk = _.get(defaultItem, 'Id') || 0;
					});
					$scope.$parent.$broadcast('form-config-updated', {});
				}

				function filterOrdHeader(salesConIds, qtoLines) {
					if (!qtoLines) {
						qtoLines = qtoMainDetailService.getList();
					}

					let ordHeaderFkSet = new Set(qtoLines.map(function(line) {
						return line.OrdHeaderFk;
					}));

					let ordHeaderFkList = Array.from(ordHeaderFkSet);

					if (ordHeaderFkList.includes(null)) {
						return salesConIds;
					} else {
						return ordHeaderFkList;
					}
				}

				function  suggestPreviousWipId(ordHeaderId,boqHeaderFk){
					$http.get(globals.webApiBaseUrl + 'qto/main/createwip/getpreviouswipid?boqHeaderFk=' + boqHeaderFk+'&contractId='+ordHeaderId).then(function (response) {
						if (response && response.data && response.data > 0) {
							$scope.dataItem.PreviousWipFk = response.data;
						} else {
							$scope.dataItem.PreviousWipFk = null;
						}
					});
				}

				function suggestPreviousBillId(ordHeaderId,boqHeaderFk){
					$http.get(globals.webApiBaseUrl + 'qto/main/createwip/getpreviousbillid?boqHeaderFk=' + boqHeaderFk+'&contractId='+ordHeaderId).then(function (response) {
						if (response && response.data && response.data > 0) {
							$scope.dataItem.PreviousBillFk = response.data;
						} else {
							$scope.dataItem.PreviousBillFk = null;
						}
					});
				}

				int();

				$scope.onPrevious = function (){
					let selectHeadersService = $injector.get('qtoMainSelectHeadersService');
					$injector.get('qtoMainCreateWipWizardService').showQtoHeaderScopeDialog(selectHeadersService.visibleAdditionRows, selectHeadersService.qtoHeaderSelected, selectHeadersService.purposeType);
					$scope.$close({});
				};

				$scope.onOK = function () {
					handlerError();
					if (!$scope.hasErrors()) {

						let contractGrid = platformGridAPI.grids.element('id', dialogConfigService.getContractGridId());
						if (contractGrid) {
							let contracts = contractGrid.dataView.getItems();
							if (contracts && contracts.length) {
								let isMarkedCons = _.filter(contracts, {'IsMarked': true});
								if(isMarkedCons.length > 0) {
									let mainContracts = _.filter(isMarkedCons, function (d) {
										return !d.OrdHeaderFk;
									});

									let markedContract = _.first(isMarkedCons);
									$scope.dataItem.OrdHeaderFk = markedContract.Id;
									$scope.dataItem.ContractTypeFk = markedContract.ContractTypeFk;
									$scope.dataItem.BusinessPartnerFk = markedContract.BusinesspartnerFk;
									$scope.dataItem.SubsidiaryFk = markedContract.SubsidiaryFk;
									$scope.dataItem.CustomerFk = markedContract.CustomerFk;
									$scope.dataItem.ResponsibleCompanyFk = markedContract.CompanyResponsibleFk;

									if (mainContracts.length === 0) {
										// if no main contract be selected ,then take the main contract of the child contract
										$scope.dataItem.OrdHeaderFk = markedContract.OrdHeaderFk;
									}
									$scope.dataItem.OrdHeaderFks = _.map(isMarkedCons, 'Id');
								}
							}
						}

						$scope.dataItem.GenerateType = generateType;
						$scope.dataItem.PurposeType = purposeType;
						$scope.dataItem.QtoScope = $scope.QtoScope;
						$scope.dataItem.QtoDetailIds = qtoDetailIds;
						$scope.$close({ok: true, data: $scope.dataItem});
					}
				};

				$scope.onCancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.dataItem.__rt$data.errors = null;
					$scope.$close(false);
				};

				$scope.onSelectionChanged(generateType);

				$scope.isForQto = function () {
					return $scope.dataItem.IsForQto;
				};

				//$scope.HiddenQtoScope = purposeType === 'bill';

				$scope.onQtoScopeChange = function (value) {
					let isWip = purposeType === 'wip';
					let isAllowCU = $scope.dataItem.AllowCUWipBillWithoutWipBillAssginment;

					$scope.QtoScope = value;

					let qtoList = qtoMainDetailService.getSelectedEntities();

					if (generateType === '2') {
						if (value === 1) { //  HighlightedQto
							if (qtoList) {
								qtoDetailIds = _.map(qtoList, 'Id');
							}
							dealQtoScope();
						} else if (value === 2) { //  ResultSet
							let grid = platformGridAPI.grids.element('id', qtoMainDetailService.getGridId());
							qtoDetailIds = _.map(grid.dataView.getFilteredItems().rows, 'Id');
							dealQtoScope();
						} else { //   EntireQto
							qtoDetailIds = [];
							$scope.qtoScopeError.show = isWip ? !$scope.dataItem.WipHeaderFk : !$scope.dataItem.BilHeaderFk;
						}
					} else {
						if (value === 1) { //  HighlightedQto
							if (qtoList) {
								qtoList = _.filter(qtoList, function (d) {
									let isAllow = isWip ? isAllowCU && !d.WipHeaderFk : isAllowCU && !d.BilHeaderFk;
									return isAllow || (!d.WipHeaderFk && !d.BilHeaderFk);
								});

								// reset contracts by qto scope change
								resetContractsByQtoScopeChange(qtoList, isWip);

								$scope.assignError.show = !qtoList.length;
								qtoDetailIds = _.map(qtoList, 'Id');
							}
						} else if (value === 2) { //  ResultSet
							let grid = platformGridAPI.grids.element('id', qtoMainDetailService.getGridId());
							qtoList = grid.dataView.getFilteredItems().rows;
							qtoList = _.filter(qtoList, function (d) {
								let isAllow = isWip ? isAllowCU && !d.WipHeaderFk : isAllowCU && !d.BilHeaderFk;
								return isAllow || (!d.WipHeaderFk && !d.BilHeaderFk);
							});

							// reset contracts by qto scope change
							resetContractsByQtoScopeChange(qtoList, isWip);

							$scope.assignError.show = !qtoList.length;
							qtoDetailIds = _.map(qtoList, 'Id');

						} else {
							qtoDetailIds = [];
							// reset contracts by qto scope change
							qtoList = qtoMainDetailService.getList();
							resetContractsByQtoScopeChange(qtoList, isWip);

							dialogConfigService.getListByQtoHeaderId(purposeType).then(function (response) {
								$scope.assignError.show = true;
								$scope.qtoLinesLength = response.data.qtoLinesLength;

								if (response.data.hasEmtpyQtos) {
									$scope.assignError.show = false;
								}
							});
						}
					}
				};
				$scope.onQtoScopeChange($scope.QtoScope);

				function resetContractsByQtoScopeChange(qtoList, isWip) {
					qtoList = _.filter(qtoList, function (d) {
						return isWip ? !d.WipHeaderFk : !d.BilHeaderFk;
					});
					mapSalesConIds = filterOrdHeader(salesConIds, qtoList);
					dialogConfigService.setSalesConIds(mapSalesConIds);

					let ordGrid = dialogConfigService.getContractGridId();
					if (ordGrid) {
						loadSalesContracts(qtoList);
					}
				}

				function loadSalesContracts(qtoList) {
					let qtoHeader = $injector.get('qtoMainHeaderDataService').getSelected();
					let isWip = purposeType === 'wip';
					let params = {
						projectId: $scope.dataItem.ProjectFk,
						isCollectiveWip: generateType === '2' ? false : $scope.dataItem.IsCollectiveWip,
						ordHeaderFk: qtoHeader.OrdHeaderFk ?? (generateType === '2' ? (isWip ? null : $scope.dataItem.OrdHeaderFk) : qtoHeader.OrdHeaderFk),
						wipHeaderFk: isWip && generateType === '2' ? ($scope.dataItem.WipHeaderFk ? $scope.dataItem.WipHeaderFk : -1) : null,
						boqHeaderFk: qtoHeader.BoqHeaderFk
					};

					let hasNoContracts = isWip ? (generateType === '2' && !$scope.dataItem.WipHeaderFk) : (generateType === '2' && !$scope.dataItem.BilHeaderFk);

					let contractsPromise = hasNoContracts ? $q.when([]) : dialogConfigService.getContractsFromServer(params);

					let loadingText = $translate.instant('sales.contract.wizardCWCreateWipContractsGridLoading');
					$injector.get('salesCommonUtilsService').addLoadingIndicator($scope, contractsPromise, loadingText);

					contractsPromise.then (function (response) {
						let ordGrid = dialogConfigService.getContractGridId();
						let data = response.data;
						if (data && data.length) {
							if ($scope.dataItem.IsCollectiveWip) {
								_.forEach(data, function (d) {
									d.IsMarked = true;
								});
							} else if (generateType === '2') {
								if (isWip) {
									let psotParam = {PKey1: $scope.dataItem.WipHeaderFk};
									$http.post(globals.webApiBaseUrl + 'sales/contract/contractsbyWipId', psotParam).then(function (orderResponse) {
										if (orderResponse.data && orderResponse.data.length > 0) {
											_.forEach(data, function (d) {
												_.forEach(orderResponse.data, function (order) {
													if (d.Id === order.Id) {
														d.IsMarked = true;
														d.IsKeepMarked = true;
													}
												});
											});
											platformGridAPI.items.data(ordGrid, data);
										}
									});
								} else {
									data[0].IsMarked = true;
									data[0].IsKeepMarked = true;
									platformGridAPI.items.data(ordGrid, data);
								}
							} else {
								salesConIds = _.map(data, 'Id');
								if (!qtoList) {
									qtoList = qtoMainDetailService.getSelectedEntities();
									let isAllowCU = $scope.dataItem.AllowCUWipBillWithoutWipBillAssginment;
									if ($scope.QtoScope === 1) {
										qtoList = _.filter(qtoList, function (d) {
											let isAllow = isWip ? isAllowCU && !d.WipHeaderFk : isAllowCU && !d.BilHeaderFk;
											return isAllow || (!d.WipHeaderFk && !d.BilHeaderFk);
										});
									} else if ($scope.QtoScope === 2) {
										let grid = platformGridAPI.grids.element('id', qtoMainDetailService.getGridId());
										qtoList = grid.dataView.getFilteredItems().rows;
										qtoList = _.filter(qtoList, function (d) {
											let isAllow = isWip ? isAllowCU && !d.WipHeaderFk : isAllowCU && !d.BilHeaderFk;
											return isAllow || (!d.WipHeaderFk && !d.BilHeaderFk);
										});
									} else {
										qtoList = _.filter(qtoMainDetailService.getList(), function (d) {
											let isAllow = isWip ? isAllowCU && !d.WipHeaderFk : isAllowCU && !d.BilHeaderFk;
											return isAllow || (!d.WipHeaderFk && !d.BilHeaderFk);
										});
									}
								}
								mapSalesConIds = filterOrdHeader(salesConIds, qtoList);
								data = _.filter(data, function (d) {
									return mapSalesConIds.includes(d.Id) || (!!d.OrdHeaderFk && mapSalesConIds.includes(d.OrdHeaderFk));
								});

								if (data.length > 0) {
									let firstCon = data[0];
									firstCon.IsMarked = true;
									$scope.dataItem.OrdHeaderFk = firstCon.Id;
									if (!isWip) {
										// suggest default previous Bill from Contract Id
										suggestPreviousBillId(firstCon.Id,$scope.dataItem.BoqHeaderFk);
									}else{
										suggestPreviousWipId(firstCon.Id,$scope.dataItem.BoqHeaderFk);
									}

									let firstGroupCons = _.filter(data, {'OrdHeaderFk': firstCon.Id});
									_.forEach(firstGroupCons, function (d) {
										d.IsMarked = true;
									});
								}
							}
						}
						platformGridAPI.items.data(ordGrid, data);
					});
				}

				if(dialogConfigService.onCodeChage){
					dialogConfigService.onCodeChage.register(dealQtoScope);
				}

				dialogConfigService.loadSalesContracts.register(loadSalesContracts);

				dialogConfigService.salesContractIsMarkedChanged.register(loadSalesContractIsMarkedChanged);
				function loadSalesContractIsMarkedChanged(item){
					$timeout(function (){
						if (item.IsMarked) {
							let ordGrid = dialogConfigService.getContractGridId();
							if (ordGrid) {
								let contractGrid =platformGridAPI.grids.element('id', dialogConfigService.getContractGridId());
								if (contractGrid) {
									let contracts = contractGrid.dataView.getItems();
									if (contracts.length > 1) {
										_.forEach(contracts, function (d) {
											if (item.OrdHeaderFk) {
												if (d.IsMarked && d.Id !== item.OrdHeaderFk && item.OrdHeaderFk !== d.OrdHeaderFk) {
													d.IsMarked = false;
												}
											}
											else {
												if (d.IsMarked && d.Id !== item.Id && item.Id !== d.OrdHeaderFk) {
													d.IsMarked = false;
												}
											}
										});

										let markedContracts = _.filter(contracts, {'IsMarked': true});
										if (markedContracts.length > 0){
											let firstCon = markedContracts[0];
											if (firstCon.IsMarked) {
												$scope.dataItem.OrdHeaderFk = firstCon.Id;
												// suggest default previous Bill from Contract Id

												if(purposeType === 'bill'){
													suggestPreviousBillId(firstCon.Id,$scope.dataItem.BoqHeaderFk);
												}else {
													suggestPreviousWipId(firstCon.Id,$scope.dataItem.BoqHeaderFk);
												}
											}
										}
									}

									platformGridAPI.items.data(ordGrid, contracts);
								}
							}
						}else{
							$scope.dataItem.OrdHeaderFk =null;
						}
					});
				}

				$scope.$on('$destroy', function () {
					if(dialogConfigService.onCodeChage) {
						dialogConfigService.onCodeChage.unregister(dealQtoScope);
					}
					dialogConfigService.loadSalesContracts.unregister(loadSalesContracts);
					dialogConfigService.salesContractIsMarkedChanged.unregister(loadSalesContractIsMarkedChanged);
				});
			}
		]
	);
})(angular);
