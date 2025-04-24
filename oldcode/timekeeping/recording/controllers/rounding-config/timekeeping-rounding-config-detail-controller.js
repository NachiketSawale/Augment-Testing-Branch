(function () {
	/* global _ */
	'use strict';

	let moduleName = 'timekeeping.recording';

	/**
	 @ngdoc controller
	 * @name timekeepingColumnConfigDetailController
	 * @function
	 *
	 * @description
	 * Controller for the column configuration details view.
	 */
	angular.module(moduleName).controller('timekeepingRoundingConfigDetailController', [
		'$scope', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid', 'platformContextService',
		'timekeepingRoundingConfigDetailUIConfigService', 'timekeepingRoundingConfigDetailDataService', 'platformGridControllerService', 'timekeepingRoundingConfigDataService', 'timekeepingRoundingConfigDetailValidationService',
		function ($scope, $timeout, $injector, platformGridAPI, platformCreateUuid, platformContextService,
			configDetailUIConfigService, timekeepingRoundingConfigDetailDataService, platformGridControllerService, timekeepingRoundingConfigDataService, configDetailValidationService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				skipToolbarCreation: true,
				toolbarItemsDisabled:true,
				cellChangeCallBack: function (arg) {
					timekeepingRoundingConfigDetailDataService.setItemToSave(arg.item);
				}
			};

			$scope.gridId = platformCreateUuid();
			timekeepingRoundingConfigDetailDataService.gridId = $scope.gridId;

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, configDetailUIConfigService, timekeepingRoundingConfigDetailDataService, configDetailValidationService, myGridConfig);

				setDataSource(timekeepingRoundingConfigDataService.getRoundingConfigDetail());
			}

			function setDataSource(data) {
				$scope.data = data;
				timekeepingRoundingConfigDetailDataService.setDataList(data);
				setRoundingConfigDetailReadOnly(data);
				timekeepingRoundingConfigDetailDataService.refreshGrid();
			}

			function updateData(currentItem) {
				setDataSource(currentItem.tksRoundingConfigDetail);
			}

			timekeepingRoundingConfigDataService.onItemChange.register(updateData);

			function getRoundingConfigDetailFields() {
				let fields = [];

				if ($scope.gridId && platformGridAPI.grids.exist($scope.gridId)) {
					let cols = platformGridAPI.columns.configuration($scope.gridId);

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

			function setRoundingConfigDetailReadOnly(tksRoundingConfigDetail) {
				if (angular.isUndefined(tksRoundingConfigDetail) || (tksRoundingConfigDetail === null)) {
					return;
				}

				let readOnlyFields = getRoundingConfigDetailFields();

				if (angular.isDefined(readOnlyFields) && (readOnlyFields !== null)) {
					let readOnly = timekeepingRoundingConfigDataService.isReadOnly();
					let fields = _.map(readOnlyFields, function (field) {
						let tmpReadonly = readOnly;
						if (field === 'ColumnId' || field === 'BasRoundToFk' || field === 'BasRoundingMethodFk') {
							tmpReadonly = true; // Those two fields are always readonly
						}

						return {field: field, readonly: tmpReadonly};
					});

					let roundingConfigDetails = angular.isArray(tksRoundingConfigDetail) ? tksRoundingConfigDetail : [tksRoundingConfigDetail];
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
				timekeepingRoundingConfigDataService.onItemChange.unregister(updateData);
			});

			init();
		}
	]);
})();
