/**
 * $Id: boq-main-rounding-config-detail-controller.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */ 
	'use strict';

	let moduleName = 'boq.main';

	/**
	 @ngdoc controller
	 * @name boqMainColumnConfigDetailController
	 * @function
	 *
	 * @description
	 * Controller for the column configuration details view.
	 */
	angular.module(moduleName).controller('boqMainRoundingConfigDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformContextService',
		'boqMainRoundingConfigDetailUIConfigService', 'boqMainRoundingConfigDetailDataService', 'platformGridControllerService', 'boqMainRoundingConfigDataService', 'boqMainRoundingConfigDetailValidationService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, platformContextService,
			configDetailUIConfigService, boqMainRoundingConfigDetailDataService, platformGridControllerService, boqMainRoundingConfigDataService, configDetailValidationService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				skipToolbarCreation: true,
				toolbarItemsDisabled:true,
				cellChangeCallBack: function (arg) {
					boqMainRoundingConfigDetailDataService.setItemToSave(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();
			boqMainRoundingConfigDetailDataService.gridId = $scope.gridId;

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, configDetailUIConfigService, boqMainRoundingConfigDetailDataService, configDetailValidationService, myGridConfig);

				setDataSource(boqMainRoundingConfigDataService.getRoundingConfigDetail());
			}

			function setDataSource(data) {
				$scope.data = data;
				boqMainRoundingConfigDetailDataService.setDataList(data);
				setRoundingConfigDetailReadOnly(data);
				boqMainRoundingConfigDetailDataService.refreshGrid();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.boqRoundingConfigDetail);
			}

			boqMainRoundingConfigDataService.onItemChange.register(updateData);

			function getRoundingConfigDetailFields() {
				let fields = [];

				if ($scope.gridId && platformGridAPI.grids.exist($scope.gridId)) {
					var cols = platformGridAPI.columns.configuration($scope.gridId);

					if (angular.isDefined(cols) && (cols !== null) && cols.current) {
						angular.forEach(cols.current, function (col) {
							if (!_.isEmpty(col.field) && col.field !== 'indicator') {
								fields.push(col.field);
							}
						});
					}
				}

				if(_.isEmpty(fields)) {
					// As fallback use following static column array
					fields = ['ColumnId', 'UiDisplayTo', 'IsWithoutRounding', 'RoundTo', 'BasRoundToFk', 'BasRoundingMethodFk'];
				}

				return fields;
			}

			function setRoundingConfigDetailReadOnly(boqRoundingConfigDetail) {
				if (angular.isUndefined(boqRoundingConfigDetail) || (boqRoundingConfigDetail === null)) {
					return;
				}

				let readOnlyFields = getRoundingConfigDetailFields();

				if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
					let readOnly = boqMainRoundingConfigDataService.isReadOnly();
					let fields = _.map(readOnlyFields, function (field) {
						var tmpReadonly = readOnly;
						if (field === 'ColumnId' || field === 'BasRoundToFk' || field === 'BasRoundingMethodFk') {
							tmpReadonly = true; // Those two fields are always readonly
						}

						return {field: field, readonly: tmpReadonly};
					});

					var roundingConfigDetails = angular.isArray(boqRoundingConfigDetail) ? boqRoundingConfigDetail : [boqRoundingConfigDetail];
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					angular.forEach(roundingConfigDetails, function (rcDetail) {
						platformRuntimeDataService.readonly(rcDetail, fields);
					});
				}
			}

			$scope.setTools = function(tools){
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.commitAllEdits();
					platformGridAPI.grids.unregister($scope.gridId);
				}
				boqMainRoundingConfigDataService.onItemChange.unregister(updateData);
			});

			init();
		}
	]);
})();
