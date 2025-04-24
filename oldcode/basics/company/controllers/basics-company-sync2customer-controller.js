/**
 * Created by xai on 11/1/2017.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';
	var angModule = angular.module(moduleName);

	angModule.value('selectedCmpGrid', [
		{
			id: 'code', field: 'code', name$tr$: 'basics.company.entityCode',
			formatter: 'code', sortable: true, resizable: true
		},
		{
			id: 'companyname', field: 'companyname', name$tr$: 'basics.company.entityName',
			formatter: 'description', sortable: true, resizable: true
		}]);

	angModule.controller('basicsCompanySync2CustDateDialogController',
		['$http', 'globals', '$scope', '$translate', 'platformTranslateService', 'platformGridAPI', 'selectedCmpGrid', 'platformModalService', function ($http, globals, $scope, $translate, platformTranslateService, platformGridAPI, selectedCmpGrid, platformModalService) {
			$scope.gridId = '712531047B764EFC82AAE19B9116CC9A';
			$scope.headerLabel = $translate.instant('basics.company.selectedCmp');
			var hasGridData = false;
			initGrid();
			$scope.options = $scope.$parent.modalOptions;
			$scope.formOptions = {
				'fid': 'basics.company.sync2customer',  // contract header form identifier
				'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
				showGrouping: true,
				title$tr$: '',

				'groups': [
					{
						'gid': 'setting',
						'header$tr$': 'basics.company.setting',
						'header': 'Settings',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'Url',
						'gid': 'setting',
						'label$tr$': 'basics.company.entityUrl',
						'model': 'Url',
						'type': 'text'
					}, {
						'rid': 'UserName',
						'gid': 'setting',
						'label$tr$': 'basics.company.entityUrlUser',
						'model': 'UserName',
						'type': 'description'
					}, {
						'rid': 'Pwd',
						'gid': 'setting',
						'label$tr$': 'basics.company.entityUrlPassword',
						'model': 'Password',
						'type': 'password'
					}
				]
			};
			$scope.currentItem = {
				Url: '',
				UserName: '',
				Password: ''
			};
			$scope.canSync = canSync;

			function canSync() {
				var flag = false;
				var result = $scope.currentItem;
				if (result.Url === '' || result.UserNamel === '' || result.Passwordl === '') {
					flag = true;
				}
				return (hasGridData && !flag);
			}

			//translate form config.
			platformTranslateService.translateFormConfig($scope.formOptions);
			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};
			$scope.formContainerOptions.formOptions = {
				configure: $scope.formOptions,
				showButtons: [],
				validationMethod: function () {
				}
			};
			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'OK',
				headerText: 'Sync Client Company to Customer'
			};
			var modalOptionsInfo = {
				headerTextKey: $translate.instant('basics.company.modalInfo'),
				showOkButton: true,
				iconClass: 'ico-info'
			};
			$scope.modalOptions.ok = function onOK() {
				var result = $scope.currentItem;
				if (result.Urll === '' || result.UserNamel === '' || result.Passwordl === '') {
					$.extend(modalOptionsInfo, {bodyTextKey: $translate.instant('basics.company.bodyTextKey')});
					platformModalService.showDialog(modalOptionsInfo);
					return;
				} else {
					$scope.$close($scope.currentItem);
				}
			};
			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			function initGrid() {
				$scope.gridData = {
					state: $scope.gridId
				};

				var columns = selectedCmpGrid; //UIStandardService.getStandardConfigForListView().columns;
				platformTranslateService.translateGridConfig(columns);

				$scope.data = [];

				if (_.isArray($scope.options.entities) && $scope.options.entities.length > 0) {
					hasGridData = true;
					_.forEach($scope.options.entities, function (item) {
						$scope.data.push({
							id: item.Id,
							code: item.Code,
							companyname: item.CompanyName
						});
						if (_.isArray(item.Companies) && item.Companies.length > 0) {
							_.forEach(item.Companies, function (obj) {
								$scope.data.push({
									id: obj.Id,
									code: obj.Code,
									companyname: obj.CompanyName
								});
							});
						}
					});
				}
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(columns), data: null, id: $scope.gridId, lazyInit: true,
						options: {tree: false, indicator: false, idProperty: 'id'}
					};
					platformGridAPI.grids.config(grid);
				} else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
				}

				var promise = null;
				promise = $http.get(globals.webApiBaseUrl + 'basics/company/getdefaultbpconfig');
				promise.then(function (response) {
					var result = response.data;
					if (!result || result.length === 0) {
						return;
					}
					$scope.currentItem.Url = result.Url;
					$scope.currentItem.UserName = result.UserName;
					$scope.currentItem.Password = result.Password;
					platformGridAPI.items.data($scope.gridId, $scope.data);
				});
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}]);
})(angular);
