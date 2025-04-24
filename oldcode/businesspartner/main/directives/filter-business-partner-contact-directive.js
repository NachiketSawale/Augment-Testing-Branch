/**
 * Created by boom on 4/7/2021.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('filterBusinessPartnerContact', ['_', 'platformGridDomainService', 'basicsLookupdataLookupControllerFactory', 'platformGridAPI', 'platformTranslateService', 'platformPermissionService', 'basicsCommonDialogGridControllerService', 'filterBusinessPartnerContactService',
      'filterBusinessPartnerSubsidiaryService',
		function (_, platformGridDomainService, lookupControllerFactory, platformGridAPI, platformTranslateService, platformPermissionService, basicsCommonDialogGridControllerService, filterBusinessPartnerContactService,
			subsidiaryService) {
			return {
				templateUrl: globals.appBaseUrl + 'businesspartner.main/partials/filter-business-partner-contact.html',
				restrict: 'A',
				scope: {},
				replace: true,
				controller: ['$scope', function ($scope) {
					var options = filterBusinessPartnerContactService.getCtOptions();
					var gridId = filterBusinessPartnerContactService.getCtGridId();
					var isShowGrid = filterBusinessPartnerContactService.getIsShowContracts();

					$scope.modalOptions = options;
					// $scope.IsShowContracts = options.IsShowContracts;
					$scope.gridId = gridId;
					$scope.IsShowContracts = isShowGrid;
					$scope.grid = {
						state: $scope.gridId
					};
					$scope.data = {
						state: $scope.gridId
					};

					var gridColumns = filterBusinessPartnerContactService.getGridColumns();
					var gridConfig = filterBusinessPartnerContactService.getGridConfig();
					if (!platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.config(gridConfig);
						platformTranslateService.translateGridConfig(gridConfig.columns);
					} else {
						platformGridAPI.columns.configuration($scope.gridId, gridColumns);
					}
					if (!$scope.tools) {
						lookupControllerFactory.create({
							grid: true,
							dialog: true,
							search: false
						}, $scope, gridConfig);
					}

					$scope.ContactCheckValidation = function (entity, checked) {
						var selectedBranch = subsidiaryService.getSelected();
						var selectedItem = $scope.modalOptions.selectedItem;
						var contactList = selectedItem.ContactDtos;
						if(!_.isNil(selectedBranch)){
							contactList = _.filter(contactList, function (item) {
								return  item.SubsidiaryFk === selectedBranch.Id || _.isNil(item.SubsidiaryFk);
							});
						}
						for (var i = 0; i < contactList.length; i++) {
							var contact = contactList[i];
							if (contact.Id !== entity.Id) {
								if (checked) {
									if (contact.bpContactCheck) {
										contact.bpContactCheck = false;
									}
								}
							} else {
								if (checked) {
									if (!entity.bpContactCheck) {
										entity.bpContactCheck = true;
									}
								} else {
									if (entity.bpContactCheck) {
										entity.bpContactCheck = false;
									}
								}
							}
						}
						platformGridAPI.items.data($scope.gridId, contactList);

						// _.remove($scope.generateArrayData, {bpId: selectedItem.Id});
						var ArrayData = filterBusinessPartnerContactService.getArrayData();
						_.remove(ArrayData, {bpId: selectedItem.Id});
						//reset branch and contact mapping
						if(!_.isNil(selectedBranch)){
							var branchContactMap = filterBusinessPartnerContactService.getBranchContactMap();
							_.remove(branchContactMap, {branchId: selectedBranch.Id});
						}
						_.forEach(_.filter(contactList, function (item) {
							return item.bpContactCheck === true;
						}), function () {
							// $scope.generateArrayData.push({bpId: selectedItem.Id, ctId: entity.Id});
							filterBusinessPartnerContactService.pushArrayData({
								bpId: selectedItem.Id,
								ctId: entity.Id
							});
							if(!_.isNil(selectedBranch)){
								filterBusinessPartnerContactService.pushBranchContactMap({
									branchId: selectedBranch.Id,
									ctId: entity.Id
								});
							}
						});
						filterBusinessPartnerContactService.SetSelected();
					};

					$scope.$on('$destroy', function () {
						if (platformGridAPI.grids.exist($scope.gridId)) {
							platformGridAPI.grids.unregister($scope.gridId);
						}
					});
				}]
			};

			// eslint-disable-next-line no-unused-vars
			function extendGrouping(gridColumns) {
				angular.forEach(gridColumns, function (column) {
					angular.extend(column, {
						grouping: {
							title: column.name$tr$, getter: column.field, aggregators: [], aggregateCollapsed: true
						},
						formatter: column.formatter || platformGridDomainService.formatter('description')
					});
				});
				return gridColumns;
			}

			// eslint-disable-next-line no-unused-vars
			function extendTrData(gridColumns) {
				angular.forEach(gridColumns, function (column) {
					angular.extend(column, {
						__rt$data: {
							errors: {}
						}
					});
				});
				return gridColumns;
			}
		}]);
})(angular);