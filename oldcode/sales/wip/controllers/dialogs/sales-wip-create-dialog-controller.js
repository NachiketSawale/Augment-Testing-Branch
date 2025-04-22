/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// jshint -W072
	angular.module('sales.wip').controller('salseWipCreateDialogController',
		['_', '$log', '$timeout', '$scope', '$injector', '$translate', 'platformDataValidationService', 'platformRuntimeDataService', 'platformTranslateService', 'salesWipCreateWipDialogService','basicsLookupdataSimpleLookupService', 'salesCommonBillTypeLookupOptions',
			function (_, $log, $timeout, $scope, $injector, $translate, platformDataValidationService, platformRuntimeDataService, platformTranslateService, dialogConfigService,basicsLookupdataSimpleLookupService, salesCommonBillTypeLookupOptions) {

				let generateType = '1'; /* 1: create; 2: update */
				let salesWipValidationService = $injector.get('salesWipValidationService');
				let qtoDetailIds  =[];
				let qtoMainDetailService = $injector.get('qtoMainDetailService');


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

				$scope.qtoScopeError = {
					show: false,
					messageCol: 1,
					message: $translate.instant('qto.main.wizard.warningOfQtoScopeError'),
					iconCol: 1,
					type: 3
				};

				// set readonly rows and unvisbile rows
				function getFormConfig() {
					let config = dialogConfigService.getFormConfig();

					// apply field read only extensions, if available
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

				function dealQtoScope(sourceType){
					$timeout(function() {
						if (purposeType === 'wip') {
							qtoDetailIds =[];
							let qtoScopeList = [];
							if ($scope.QtoScope === 1 || $scope.QtoScope === 2) {

								if(sourceType ==='updatewith'){

									if ($scope.QtoScope === 1) {
										qtoScopeList = qtoMainDetailService.getSelectedEntities();
									} else if ($scope.QtoScope === 2) {
										let grid = $injector.get('platformGridAPI').grids.element('id', qtoMainDetailService.getGridId());
										qtoScopeList = grid.dataView.getFilteredItems().rows;
									}
									let qtoScopeListByFilter = _.filter(qtoScopeList, function (d) {
										return d.WipHeaderFk === $scope.dataItem.WipHeaderFk;
									});

									if($scope.dataItem.updateWith ==='3'){
										qtoDetailIds = _.map(qtoScopeList, 'Id');
									}else if($scope.dataItem.updateWith ==='1'){
										qtoDetailIds = _.map(qtoScopeListByFilter, 'Id');
									}

								}else if ($scope.dataItem && $scope.dataItem.WipHeaderFk) {

									dialogConfigService.getQtoCountByWipId($scope.dataItem.WipHeaderFk).then(function (response) {
										qtoScopeList = [];
										if ($scope.QtoScope === 1) {
											qtoScopeList = qtoMainDetailService.getSelectedEntities();
										} else if ($scope.QtoScope === 2) {
											let grid = $injector.get('platformGridAPI').grids.element('id', qtoMainDetailService.getGridId());
											qtoScopeList = grid.dataView.getFilteredItems().rows;
										}
										let qtoScopeListByFilter = _.filter(qtoScopeList, function (d) {
											return d.WipHeaderFk === $scope.dataItem.WipHeaderFk;
										});
										$scope.qtoScopeError.show = false;
										if (!(response && response.data && response.data>0  && response.data !== qtoScopeListByFilter.length)) {

											if($scope.dataItem.updateWith ===3){
												qtoDetailIds = _.map(qtoScopeList, 'Id');
											}else if($scope.dataItem.updateWith ===1){
												qtoDetailIds = _.map(qtoScopeListByFilter, 'Id');
											}

										} else {
											$scope.qtoScopeError.show = true;
										}
									});
								}else {
									$scope.qtoScopeError.show = true;
								}
							} else {
								$scope.qtoScopeError.show = !$scope.dataItem.WipHeaderFk;
							}
						}
					});
				}

				// translate form config.
				let formConfig = getFormConfig();

				// contracts grid
				var gridOptions = _.get(_.find(formConfig.rows, {rid: 'contractsGrid'}), 'options');
				$scope.$watch('dataItem.OrdHeaderFk', function (newOrdHeaderFk/* , oldOrdHeaderFk */) {
					// set readonly state and reload grid
					gridOptions.readonly = newOrdHeaderFk === null;
					$scope.$broadcast('reloadGrid');
				});
				// end contract grid

				$scope.onSelectionChanged = function (newValue) {
					$scope.dataItem.BilHeaderFk = null;
					$scope.dataItem.WipHeaderFk = null;
					$scope.dataItem.Description = null;
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
								} else {
									row.label = 'Code';
									row.model = 'Code';
									row.type = 'code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.required= false; // TODO: why false? see #127248 (remaining part)
								}
							} else {
								if (purposeType === 'bill') {
									row.label$tr$ = 'qto.main.entityBillNo';
									row.model = 'Code';
									row.type = 'directive';
									row.label = 'Bill No';
									row.directive = 'sales-billing-no-selector';
									row.options.filterKey = 'qto-sales-billing-no-filter';
									// row.validator = salesBillingValidationService.validateBillNo;
									row.asyncValidator = null;

								} else {
									row.type = 'directive';
									row.label = 'Code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.directive = 'sales-wip-code-grid-selector';
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

						if (row.rid === 'previousbillfk' && purposeType === 'bill' && $scope.options.readOnlyRows.indexOf(row.rid) === -1) {
							row.visible = newValue === '2';
							$scope.dataItem.PreviousBillFk = null;
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
							dialogConfigService.getListByQtoHeaderId ().then (function (response) {
								$scope.assignError.show = true;
								$scope.qtoLinesLength = response.data.qtoLinesLength;
								console.log (response.data.timeStr);
								if (response.data.hasEmtpyQtos) {
									$scope.assignError.show = false;
								}
							});
						}

						$scope.qtoScopeError.show = false;
					}else{
						if(!$scope.qtoLinesLength){
							$scope.assignError.show = true;
						}
						dealQtoScope();
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
					if ($scope.dataItem.OrdHeaderFk === null || $scope.dataItem.OrdHeaderFk === 0
						|| $scope.dataItem.ProjectFk === null || $scope.dataItem.ProjectFk === 0
						|| $scope.dataItem.RubricCategoryFk === null || $scope.dataItem.RubricCategoryFk === 0
						|| $scope.dataItem.ContractTypeFk === null || $scope.dataItem.ContractTypeFk === 0
						|| $scope.dataItem.ResponsibleCompanyFk === null || $scope.dataItem.ResponsibleCompanyFk === 0
						|| $scope.dataItem.ClerkFk === null || $scope.dataItem.ClerkFk === 0) {
						hasError = true;
					}
					if ($scope.dataItem.__rt$data && $scope.dataItem.__rt$data.errors) {
						let errors = $scope.dataItem.__rt$data.errors;
						for (let prop in errors) {
							if (errors[prop] !== null) {
								hasError = true;
								break;
							}
						}
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


				function int(){
					dialogConfigService.setPurposeType(purposeType);

					$scope.dataItem.IsOrdQuantityOnly = !!$scope.dataItem.OrdHeaderFk;

					_.forEach(formConfig.rows, function (row) {

						if(row.rid === 'isOrdQuantityOnly'){
							row.readonly = !!$scope.dataItem.OrdHeaderFk;
						}

						if(row.rid === 'typefk' || row.rid === 'previousbillfk'){
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
									// row.validator = salesBillingValidationService.validateBillNo;
									row.asyncValidator = null;
									row.readonly = false;
								} else {
									row.type = 'directive';
									row.label = 'Code';
									row.label$tr$ = 'cloud.common.entityCode';
									row.directive = 'sales-wip-code-grid-selector';
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

				int();

				$scope.onOK = function () {
					handlerError();
					if (!$scope.hasErrors()) {
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

				$scope.HiddenQtoScope = purposeType === 'bill';

				$scope.onQtoScopeChange = function (value) {
					if(purposeType !== 'wip'){
						return;
					}
					$scope.QtoScope = value;
					let qtoList = qtoMainDetailService.getSelectedEntities();

					if (generateType === '2') {
						if(value === 1){ //  HighlightedQto
							if(qtoList){
								qtoDetailIds = _.map(qtoList,'Id');
							}
							dealQtoScope();
						}else if(value === 2){ //  ResultSet
							let grid = $injector.get('platformGridAPI').grids.element('id',qtoMainDetailService.getGridId());
							qtoDetailIds = _.map(grid.dataView.getFilteredItems().rows,'Id');
							dealQtoScope();
						}else{ //   EntireQto
							qtoDetailIds = [];
							$scope.qtoScopeError.show = !$scope.dataItem.WipHeaderFk;
						}
					}else{
						if(value === 1){ //  HighlightedQto
							if(qtoList) {
								qtoList = _.filter(qtoList, function (d) {
									return !d.WipHeaderFk  && !d.BilHeaderFk;
								});
								$scope.assignError.show = !qtoList.length;
								qtoDetailIds = _.map(qtoList,'Id');
							}
						}else if(value === 2){ //  ResultSet
							let grid = $injector.get('platformGridAPI').grids.element('id',qtoMainDetailService.getGridId());
							qtoList = grid.dataView.getFilteredItems().rows;
							qtoList = _.filter(qtoList,function (d) {
								return !d.WipHeaderFk && !d.BilHeaderFk;
							});
							$scope.assignError.show = !qtoList.length;
							qtoDetailIds = _.map(qtoList,'Id');

						}else {
							qtoDetailIds =[];
							dialogConfigService.getListByQtoHeaderId().then (function (response) {
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

				if(dialogConfigService.onCodeChage){
					dialogConfigService.onCodeChage.register(dealQtoScope);
				}

				$scope.$on('$destroy', function () {
					if(dialogConfigService.onCodeChage) {
						dialogConfigService.onCodeChage.unregister(dealQtoScope);
					}
				});
			}
		]
	);
})(angular);
