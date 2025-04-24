/**
 * Created by chi on 5/23/2016.
 */
(function(angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMainInstanceParameterDefaultInputDialogController', constructionSystemMainInstanceParameterDefaultInputDialogController);
	constructionSystemMainInstanceParameterDefaultInputDialogController.$inject = [
		'_',
		'$scope',
		'$translate',
		'constructionSystemMainInstanceParameterDefaultInputDialogService',
		'basicsCommonDialogGridControllerService',
		'constructionSystemMasterParameterUIStandardService',
		'parameterDataTypes'
	];
	function constructionSystemMainInstanceParameterDefaultInputDialogController(
		_,
		$scope,
		$translate,
		constructionSystemMainInstanceParameterDefaultInputDialogService,
		basicsCommonDialogGridControllerService,
		constructionSystemMasterParameterUIStandardService,
		parameterDataTypes
	) {

		var UUID = 'b6fbe438cd5542798af9699e7db90e2a';
		var gridConfig = {
			initCalled: false,
			grouping: [],
			uuid: UUID
		};

		basicsCommonDialogGridControllerService.initListController(
			$scope,
			getUIStandard(),
			constructionSystemMainInstanceParameterDefaultInputDialogService,
			{},
			gridConfig
		);

		// load the grid data
		if (constructionSystemMainInstanceParameterDefaultInputDialogService.load) {
			constructionSystemMainInstanceParameterDefaultInputDialogService.load();
		}

		var originalAllDataList = angular.copy(constructionSystemMainInstanceParameterDefaultInputDialogService.getOriginalDataList());

		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item.iconClass === 'tlb-icons ico-search' || item.iconClass === 'tlb-icons ico-settings' || item.iconClass === 'tlb-icons ico-group-columns'; // keep toolbar 'search/setting'
		});

		$scope.currentData = constructionSystemMainInstanceParameterDefaultInputDialogService.getCurrentData();

		$scope.htmlTranslate = {
			parameter: $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialog.parameters'),
			templateCheckBox: $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialog.templateCheckBox'),
			nextButton: $translate.instant('constructionsystem.main.nextButton'),
			previousButton: $translate.instant('constructionsystem.main.previousButton'),
			headerText: $translate.instant('constructionsystem.main.createCosInstanceDefaultInputDialogTitle'),
			actionButtonText: $translate.instant('cloud.common.ok'),
			cancelButtonText: $translate.instant('cloud.common.cancel')
		};

		$scope.changeSelectedTemplate = changeSelectedTemplate;
		$scope.cancel = cancel;
		$scope.ok = ok;
		$scope.next = next;
		$scope.previous = previous;

		$scope.modalOptions = {
			headerText: $scope.htmlTranslate.headerText,
			cancel: cancel
		};

		var unwatch1 = $scope.$watch(constructionSystemMainInstanceParameterDefaultInputDialogService.getCurrentData, resetCurrentData);

		var unwatch2 = $scope.$watch(constructionSystemMainInstanceParameterDefaultInputDialogService.getDataPosition, resetControlStatus);

		$scope.$on('$destroy', function () {
			if (unwatch1) {
				unwatch1();
			}
			if (unwatch2) {
				unwatch2();
			}
			constructionSystemMainInstanceParameterDefaultInputDialogService.resetData();
		});

		initControlStatus();

		// ///////////////////////////////
		function getUIStandard() {
			var listConfig = angular.copy(constructionSystemMasterParameterUIStandardService.getStandardConfigForListView());

			var columns = listConfig.columns;

			columns = _.filter(columns, function (col) {
				return col.field !== 'Sorting' && col.field !== 'BasFormFieldFk' && col.field !== 'IsLookup' && col.field !== 'CosDefaultTypeFk';
			});

			_.forEach(columns, function (col) {
				if (col.field !== 'DefaultValue' && col.field !== 'PropertyName' && col.field !== 'QuantityQuery') {
					if (col.editor) {
						delete col.editor;
					}
					if (col.editorOptions) {
						delete col.editorOptions;
					}
				}
			});

			var foundPropertyName = _.find(columns, {field: 'PropertyName'});
			// if (foundPropertyName) {
			//    foundPropertyName.id = 'modelpropertyfk';
			//    foundPropertyName.formatter = 'lookup';
			//    foundPropertyName.editor = 'lookup';
			//    foundPropertyName.field = 'ModelPropertyFk';
			//    foundPropertyName.sortable = true;
			//    foundPropertyName.editorOptions = {
			//       directive: 'construction-system-main-instance-parameter-property-name-combobox',
			//       lookupOptions: {
			//           filterKey: 'instanceparameter-property-name-default-input-dialog-filter'
			//       }
			//    };
			//    foundPropertyName.formatterOptions = {
			//       lookupType: 'CosMainInstanceParameterPropertyName',
			//       displayMember: 'PropertyName'
			//    };
			//    foundPropertyName.grouping = {
			//       title: foundPropertyName.name,
			//       getter: 'ModelPropertyFk',
			//       aggregators: [],
			//       aggregateCollapsed: true
			//    };
			//    foundPropertyName.validator = constructionSystemMainInstanceParameterDefaultInputDialogService.validatePropertyName;
			//    foundPropertyName.searchable = false;
			// }
			if (foundPropertyName) {
				foundPropertyName.editor = 'lookup';
				foundPropertyName.editorOptions = {
					directive: 'construction-system-main-instance-parameter-property-name-combobox',
					lookupOptions: {
						filterKey: 'instanceparameter-property-name-default-input-dialog-filter',
						showClearButton: true,
						isTextEditable: true
					}
				};
				foundPropertyName.validator = constructionSystemMainInstanceParameterDefaultInputDialogService.validatePropertyName;
			}

			var found = _.find(columns, {field: 'DefaultValue'});
			if (found) {
				found.validator = constructionSystemMainInstanceParameterDefaultInputDialogService.validateParameterValue;
				found.name = 'Parameter Value';
				found.name$tr$ = 'basics.customize.parametervalue';
				found.domain = function (item, column) { /* jshint -W074 */
					var domain = null;
					var parameterItem = item;
					if (parameterItem) {
						column.field = 'DefaultValue';
						if (parameterItem.IsLookup === true) {
							domain = 'lookup';
							column.editorOptions = {
								lookupDirective: 'construction-system-main-instance-parameter-dialog-parameter-value-lookup',
								lookupType: 'CosMainInstanceParameterValue',
								valueMember: 'Id',
								displayMember: 'Description'
							};

							column.formatterOptions = {
								lookupType: 'CosMainInstanceParameterValue',
								displayMember: 'Description',
								'valueMember': 'Id'
							};
						}
						else {
							column.DefaultValue = null;
							column.editorOptions = null;
							column.formatterOptions = null;

							switch (item.CosParameterTypeFk) {
								case parameterDataTypes.Integer:
									domain = 'integer';
									break;
								case parameterDataTypes.Decimal1:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 1 };
									column.formatterOptions = { decimalPlaces: 1 };
									break;
								case parameterDataTypes.Decimal2:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 2 };
									column.formatterOptions = { decimalPlaces: 2 };
									break;
								case parameterDataTypes.Decimal3:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 3 };
									column.formatterOptions = { decimalPlaces: 3 };
									break;
								case parameterDataTypes.Decimal4:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 4 };
									column.formatterOptions = { decimalPlaces: 4 };
									break;
								case parameterDataTypes.Decimal5:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 5 };
									column.formatterOptions = { decimalPlaces: 5 };
									break;
								case parameterDataTypes.Decimal6:
									domain = 'decimal';
									column.editorOptions = { decimalPlaces: 6 };
									column.formatterOptions = { decimalPlaces: 6 };
									break;
								case 7:
								case 8:
								case 9:
									break;
								case parameterDataTypes.Boolean:
									domain = 'boolean';
									break;
								case parameterDataTypes.Date:
									domain = 'dateutc';
									break;
								case parameterDataTypes.Text:
									domain = 'description';
									break;
								default:
									domain = 'description';
									break;
							}
						}
					}

					return domain;
				};
			}

			listConfig.columns = columns;

			return {
				getStandardConfigForListView: function getStandardConfigForListView() {
					return listConfig;
				}
			};
		}

		function initControlStatus() {
			$scope.ctlStatus = {};
			$scope.ctlStatus.disabledPreviousBtn = true;

			var allData = constructionSystemMainInstanceParameterDefaultInputDialogService.getDataList();
			if (!allData || allData.length === 0 || allData.length === 1) {
				$scope.ctlStatus.disabledNextBtn = true;
				$scope.ctlStatus.disabledPreviousBtn = true;
				return;
			}

			$scope.ctlStatus.disabledNextBtn = (allData.length <= 1);
		}

		function changeSelectedTemplate(selectedTemplateId) {
			constructionSystemMainInstanceParameterDefaultInputDialogService.resetParameterListByTemplateId(selectedTemplateId);
		}

		function next() {
			constructionSystemMainInstanceParameterDefaultInputDialogService.next();
		}

		function previous() {
			constructionSystemMainInstanceParameterDefaultInputDialogService.previous();
		}

		function cancel() {
			$scope.$close({isOk: false});
		}

		function ok() {
			var allData = angular.copy(constructionSystemMainInstanceParameterDefaultInputDialogService.getDataList());
			if (allData) {
				_.forEach(allData, function(item) {
					_.forEach(item.parameterList, function(param) {
						if (param.ModelPropertyFk !== null && angular.isDefined(param.ModelPropertyFk) && param.modifiedValue === null) {
							param.DefaultValue = null;
						}
					});
				});
			}
			$scope.$close({isOk: true, dataList: allData});
		}

		function resetCurrentData(currentData) {
			$scope.currentData = currentData;
		}

		function resetControlStatus (position) {
			if (position !== null && angular.isDefined(position)) {
				if (position < 0) {
					$scope.ctlStatus.disabledNextBtn = true;
					$scope.ctlStatus.disabledPreviousBtn = true;
				}

				var length = originalAllDataList.length;

				if (length === 1) {
					$scope.ctlStatus.disabledNextBtn = true;
					$scope.ctlStatus.disabledPreviousBtn = true;
				} else if (position === 0) {
					$scope.ctlStatus.disabledNextBtn = false;
					$scope.ctlStatus.disabledPreviousBtn = true;
				} else if (position === length - 1) {
					$scope.ctlStatus.disabledNextBtn = true;
					$scope.ctlStatus.disabledPreviousBtn = false;
				} else {
					$scope.ctlStatus.disabledNextBtn = false;
					$scope.ctlStatus.disabledPreviousBtn = false;
				}
			}
		}
	}
})(angular);