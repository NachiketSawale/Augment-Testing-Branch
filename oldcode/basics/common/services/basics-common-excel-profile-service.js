(function (angular) {
	'use strict';

	const angularModule = angular.module('basics.common');

	angularModule.factory('basicsCommonExcelProfileService', ['$http', 'platformDialogService', 'globals',
		function ($http, platformDialogService, globals) {
			let service = {};
			let currentExcelProfile;

			function showDialog() {
				if (currentExcelProfile.Version > 0) {
					$http.get(globals.webApiBaseUrl + 'basics/common/excelprofile/profiledetails?profileId=' + currentExcelProfile.Id)
						.then(function (response) {
							if (response.data) {
								let modalOptions =
									{
										headerText$tr$: 'basics.common.excelProfileDetails',
										bodyTemplate: ['<section class="modal-body">',
											'<div data-ng-controller="basicsCommonExcelProfileController">',
											'<div class="modal-wrapper" style="margin-top:10px">',
											'<div class="modal-wrapper grid-wrapper_ subview-container">',
											'<platform-Grid data-data="gridData" />',
											'</div>',
											'</div>',
											'</div>',
											'</section>'].join(''),
										showOkButton: true,
										showCancelButton: true,
										resizeable: true,
										minHeight: '800px',
										minWidth: '500px',
										data: response.data
									};
								platformDialogService.showDialog(modalOptions);
							}
						});
				}
			}

			service.start = function (excelProfile, entityTypeService) {
				currentExcelProfile = excelProfile;

				if (excelProfile.Id < 100) {
					platformDialogService.showDialog({
						headerText$tr$: 'cloud.common.infoBoxHeader',
						iconClass: 'info',
						bodyText: 'The current data record cannot be customized',
						showOkButton: true
					});
				} else if (excelProfile.Version === 0) {
					entityTypeService.updateAndExecute(showDialog);
				} else {
					showDialog();
				}
			};

			return service;
		}
	]);

	angularModule.controller('basicsCommonExcelProfileController', ['globals', '$http', '$scope', '$translate', 'platformSchemaService', 'platformGridAPI', '_',
		function (globals, $http, $scope, $translate, platformSchemaService, platformGridAPI, _) {
			let gridColumns = [];
			const domainSchema = platformSchemaService.getSchemaFromCache({
				moduleSubModule: 'Basics.Common',
				typeName: 'ExcelProfileDetailDto'
			});

			function createGridColumn(fieldName, uiName) {
				const gridColumn = {
					'id': fieldName,
					'field': fieldName,
					'name': $translate.instant(uiName),
					'width': fieldName.includes('FieldName') ? 250 : 70
				};

				if (Object.prototype.hasOwnProperty.call(domainSchema.properties, fieldName)) {
					gridColumn.formatter = gridColumn.editor = domainSchema.properties[fieldName].domain;
					gridColumn.required = domainSchema.properties[fieldName].mandatory;
					gridColumn.maxLength = domainSchema.properties[fieldName].maxlen;
				}

				return gridColumn;
			}

			// Inits the grid columns
			gridColumns.push(createGridColumn('InternalFieldName', 'cloud.desktop.formConfigLabelName'));
			gridColumns.push(createGridColumn('IsLive', 'basics.customize.islive'));
			gridColumns.push(createGridColumn('Sorting', 'basics.config.sorting'));
			gridColumns.push(createGridColumn('Width', 'basics.customize.width'));

			// Inits the grid
			$scope.gridId = '6854CAA708D84811ABF2102EC999A750';
			$scope.gridData = {state: $scope.gridId};
			platformGridAPI.grids.config({'id': $scope.gridId, 'options': {idProperty: 'Id'}});
			setTimeout(function() {
				platformGridAPI.columns.configuration($scope.gridId, gridColumns);
				platformGridAPI.items.data($scope.gridId, $scope.dialog.modalOptions.data);
				_.forEach($scope.dialog.modalOptions.data, function (excelProfile) {
					excelProfile.__rt$data = excelProfile.__rt$data || {};
					if (excelProfile.IsReadonly) {
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: excelProfile, field: 'IsLive'});
						platformGridAPI.cells.readonly({gridId: $scope.gridId, item: excelProfile, field: 'Sorting'});
					}
				});
				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.grids.refresh($scope.gridId);
			}, 50);

			// Handles the saving
			$scope.dialog.getButtonById('ok').fn = function () {
				$scope.$close({ok: true});
				$http.post(globals.webApiBaseUrl + 'basics/common/excelprofile/saveprofiledetails', $scope.dialog.modalOptions.data);
			};
		}
	]);

})(angular);
