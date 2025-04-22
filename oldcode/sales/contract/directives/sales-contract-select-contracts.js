/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.contract').directive('salesContractSelectContracts', ['globals',
		function (globals) {

			var controller = ['_', '$translate', '$injector', '$scope', 'platformGridAPI', 'platformRuntimeDataService', 'salesContractConfigurationService', 'salesCommonUtilsService',
				function (_, $translate, $injector, $scope, platformGridAPI, platformRuntimeDataService, salesContractConfigurationService, salesCommonUtilsService) {

					// interface info to get related contracts
					var contractServiceName = _.get($scope, 'options.contractServiceName');
					var getListName = _.get($scope, 'options.getListName');

					function getColumns() {
						var columns = salesContractConfigurationService.getStandardConfigForListView().columns;

						// only specific columns & make full readonly
						columns = salesCommonUtilsService.getReadonlyColumnsSubset(columns, [
							'documenttype', 'ordstatusfk', 'rubriccategoryfk', 'code', 'descriptioninfo', 'customerfk', 'plannedstart', 'plannedend'
						]);

						// add Select-Column (marker)
						columns.push(salesCommonUtilsService.createMarkerColumn(contractServiceName, getListName, true));

						return columns;
					}

					function updateGrid(contracts) {
						_.each(contracts, salesCommonUtilsService.setMarker);
						platformGridAPI.items.data($scope.gridId, contracts);
					}

					$scope.loadData = function loadData() {
						var contractService = $injector.get(contractServiceName);
						var contractsPromise = contractService[getListName]();

						var loadingText = $translate.instant('sales.contract.wizardCWCreateWipContractsGridLoading');
						salesCommonUtilsService.addLoadingIndicator($scope, contractsPromise, loadingText);
						contractsPromise.then(function (contracts) {
							updateGrid(contracts);
							$scope.$emit('salesContractSelectContracts:reloadedGrid');
						});
					};

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

					// marker change event
					// workaround to make the marker column readonly
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						if ($scope.options.readonly) {
							item.IsMarked = !value;
						}
						// TODO: seems sometimes not to work, therefore next lines (see #135269)
						var contractService = $injector.get(contractServiceName);
						if (_.isFunction(contractService.getContracts)) {
							var contracts = contractService.getContracts();
							_.set(_.find(contracts, {Id: item.Id}), 'IsMarked', item.IsMarked);
						}

						$scope.$emit('salesContractSelectContracts:IsMarkedChanged');
					});

					// prepare and set data (preselected items will be marked initially)
					$scope.loadData();
				}];

			return {
				restrict: 'A',

				scope: {
					ngModel: '=',
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (scope/* , ele, attrs */) {
					scope.$on('reloadGrid', function () {
						scope.loadData();
					});
				}
			};
		}]
	);
})();
