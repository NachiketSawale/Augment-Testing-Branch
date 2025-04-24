(function (angular) {
	'use strict';

	let moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonAddressGeolocationConvertController',
		['$scope', '$q', '$timeout', '$translate', 'platformGridAPI', 'platformTranslateService', 'platformModalService', 'basicsCommonAddressService',
			'_',
			function ($scope, $q, $timeout, $translate, platformGridAPI, platformTranslateService, platformModalService, basicsCommonAddressService,
				_) {

				$scope.currentItem = {
					convertOnlyEmpty: true,
					isConverted: false,
					convertIsStart: false,
					addresses: []
				};

				let statusEnum = {
					waiting: 0,
					success: 1,
					error: 2,
					notConvert: 3
				};

				$scope.settings = function () {
					platformModalService.showDialog({
						templateUrl: 'basics.common/templates/dialog-map-settings.html'
					});
				};

				$scope.showMap = false;
				$scope.toggleMap = function () {
					$scope.showMap = !$scope.showMap;
					resizeGrid();
				};

				$scope.getOkText = function () {
					return $scope.currentItem.isConverted ? 'basics.common.button.close' : 'basics.common.ok';
				};

				function isNullOrUndefined(value) {
					return typeof value === 'undefined' || value === null;
				}

				$scope.ok = function ok() {
					if ($scope.currentItem.isConverted) {
						return $scope.modalOptions.ok();
					}
					$scope.currentItem.convertIsStart = true;
					let tasks = [];
					angular.forEach($scope.modalOptions.data, function (entityAddress) {
						let condition = $scope.currentItem.convertOnlyEmpty ?
							(entityAddress.status !== statusEnum.success && entityAddress.status !== statusEnum.notConvert) :
							true;
						if (condition && entityAddress.status !== statusEnum.waiting) {
							entityAddress.status = statusEnum.waiting;
							entityAddress.message = '';
							platformGridAPI.grids.invalidate($scope.gridId);
						}
					});
					angular.forEach($scope.modalOptions.data, function (entityAddress) {
						if (entityAddress.status === statusEnum.waiting) {
							let condition = $scope.currentItem.convertOnlyEmpty ?
								(entityAddress.address && (isNullOrUndefined(entityAddress.address.latitude) || isNullOrUndefined(entityAddress.address.longitude))) :
								true;
							if (condition) {
								let task = basicsCommonAddressService.getAddressGeoLocation(entityAddress.address).then(function (result) {
									entityAddress.status = result.success === true ? 1 : 2;
									entityAddress.message = result.message;
									if (result.success === true) {
										entityAddress.address.latitude = result.address.latitude;
										entityAddress.address.longitude = result.address.longitude;
									}

									$scope.currentItem.addresses.push(entityAddress.address);

									platformGridAPI.grids.invalidate($scope.gridId);
								});
								tasks.push(task);
							} else {
								entityAddress.status = statusEnum.notConvert;
								entityAddress.message = $translate.instant('basics.common.geographicLocationInfo.status.notConvert');
								platformGridAPI.grids.invalidate($scope.gridId);
							}
						}
					});

					$q.all(tasks).then(function () {
						$scope.currentItem.isConverted = true;
						return platformModalService.showMsgBox('basics.common.geographicLocationInfo.convertComplete',
							'basics.common.geographicLocationInfo.title', 'ico-info');
					});
				};

				$scope.cancel = function () {
					if ($scope.currentItem.isConverted || $scope.currentItem.convertIsStart) {
						$scope.modalOptions.ok();
					} else {
						$scope.$close(false);
					}

				};

				$scope.modalOptions.cancel = function () {
					$scope.cancel();
				};

				$scope.gridId = 'daf1d414c0484e16a53f1d3aa6fe2c19';

				$scope.gridData = {
					state: $scope.gridId
				};

				function formatStatus(row, cell, value) {
					if (value === 0) {
						return createFormat('gray', 'basics.common.geographicLocationInfo.status.waiting');
					} else if (value === 1) {
						return createFormat('green', 'basics.common.geographicLocationInfo.status.success');
					} else if (value === 2) {
						return createFormat('red', 'basics.common.geographicLocationInfo.status.error');
					} else if (value === 3) {
						return createFormat('yellow', 'basics.common.geographicLocationInfo.status.notConvert');
					}
				}

				function createFormat(color, message) {
					message = $translate.instant(message);
					return '<div class="block-image" style="border-radius:50%;background-color: ' + color + ' "></div>' +
						'<span style="margin-left: 5px;">' + message + '</span>';
				}

				function setupMappingGrid() {

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						let columns = [
							{
								id: 'status',
								field: 'status',
								name$tr$: 'cloud.common.entityStatus',
								name: 'Status',
								formatter: formatStatus,
								width: 120
							},
							{
								id: 'message',
								field: 'message',
								name: 'Error Message',
								name$tr$: 'cloud.common.errorMessage',
								formatter: 'remark',
								width: 120
							},
							{
								id: 'address',
								field: 'address.address',
								name: 'Address',
								name$tr$: 'cloud.common.entityAddress',
								formatter: 'remark',
								width: 200
							},
							{
								id: 'longitude',
								field: 'address.longitude',
								name: 'Longitude',
								name$tr$: 'cloud.common.AddressDialogLongitude',
								formatter: 'decimal',
								width: 100
							},
							{
								id: 'latitude',
								field: 'address.latitude',
								name: 'Latitude',
								name$tr$: 'cloud.common.AddressDialogLatitude',
								formatter: 'decimal',
								width: 100
							}];

						if (angular.isArray($scope.modalOptions.additionalColumns) && $scope.modalOptions.additionalColumns.length > 0) {
							_.forEach($scope.modalOptions.additionalColumns, function (item) {
								columns.splice(2, 0, item);
							});
						}

						platformTranslateService.translateGridConfig(columns);
						let grid = {
							columns: columns,
							data: [],
							id: $scope.gridId,
							lazyInit: true,
							options: {
								indicator: true,
								editable: false,
								idProperty: 'id',
								iconClass: ''
							}
						};

						platformGridAPI.grids.config(grid);
					}

				}

				function resizeGrid() {
					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					}, 10);
				}

				function updateGridData(dataList) {
					platformGridAPI.items.data($scope.gridId, dataList);
					platformGridAPI.grids.invalidate($scope.gridId);
				}

				function init() {
					setupMappingGrid();
					updateGridData($scope.modalOptions.data);
					resizeGrid();
				}

				init();

				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);