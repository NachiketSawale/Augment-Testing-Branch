/**
 * Created by pel on 17/11/2021.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('filterBusinessPartnerSubsidiary', ['_', 'platformGridDomainService', 'basicsLookupdataLookupControllerFactory', 'platformGridAPI', 'platformTranslateService', 'platformPermissionService', 'basicsCommonDialogGridControllerService', 'filterBusinessPartnerSubsidiaryService',
		'platformLayoutByDataService', 'businesspartnerMainSubsidiaryDataService', 'businessPartnerMainSubsidiaryUIStandardService',
		function (_, platformGridDomainService, lookupControllerFactory, platformGridAPI, platformTranslateService, platformPermissionService, basicsCommonDialogGridControllerService, filterBusinessPartnerSubsidiaryService,
			platformLayoutByDataService, dataService, uiStandardService) {
			return {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/filter-business-partner-subsidiary.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: ['$scope', function ($scope) {
					var options = filterBusinessPartnerSubsidiaryService.getCtOptions();
					var gridId = filterBusinessPartnerSubsidiaryService.getCtGridId();
					$scope.modalOptions = options;
					$scope.gridId = gridId;

					$scope.grid = {
						state: $scope.gridId
					};
					$scope.data = {
						state: $scope.gridId
					};
					var gridConfig = filterBusinessPartnerSubsidiaryService.getGridConfig();
					var gridColumns = filterBusinessPartnerSubsidiaryService.getGridColumns();
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.config(gridConfig);
						platformTranslateService.translateGridConfig(gridConfig.columns);
						platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
					} else {
						platformGridAPI.columns.configuration($scope.gridId, gridColumns);
						platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);
					}
					if (!$scope.tools) {
						lookupControllerFactory.create({
							grid: true,
							dialog: true,
							search: false
						}, $scope, gridConfig);
					}
					$scope.SubsidiaryCheckValidation = function () {
						var selectedItem = $scope.modalOptions.selectedItem;
						if (!_.isNil(selectedItem)) {
							var arrayData = filterBusinessPartnerSubsidiaryService.getArrayData();
							var bpSubs = _.find(arrayData, function (data) {
								return data.bpId === selectedItem.BusinessPartnerFk;
							});
							if (!_.isNil(bpSubs)){
								bpSubs.subsId = selectedItem.Id;
							}
						}

					};
					$scope.$on('$destroy', function () {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
							platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
						}
					});
				}]
			};


			function onGridClick(e, args) {
				var gridId = 'f3b7569b3ba344768005d7b4a24f62c1';
				var selectedItem = args.grid.getDataItem(args.row);
				if (!_.isNil(selectedItem)) {
					var arrayData = filterBusinessPartnerSubsidiaryService.getArrayData();
					var bpSubs = _.find(arrayData, function (data) {
						return data.bpId === selectedItem.BusinessPartnerFk;
					});
					if (!_.isNil(bpSubs)){
						bpSubs.subsId = selectedItem.Id;
					}
					selectedItem.IsChecked = true;
					var datas = platformGridAPI.items.data(gridId);
					_.forEach(datas, function (item) {
						if(item.Id !== selectedItem.Id){
							item.IsChecked = false;
						}
					});
					platformGridAPI.items.data(gridId, datas);
				}
			}



		}]);
})(angular);