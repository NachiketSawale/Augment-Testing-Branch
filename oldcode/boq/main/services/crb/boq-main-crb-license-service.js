(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	/**
	 * @ngdoc boqMainCrbLicenseService
	 * @name
	 * @function
	 * @description
	 */
	angularModule.factory('boqMainCrbLicenseService', ['$http', 'platformDialogService',
		function ($http, platformDialogService) {
			var service = {};
			var crbBaseRoute = globals.webApiBaseUrl + 'boq/main/crb/';

			service.start = function () {
				$http.get(crbBaseRoute + 'license/services')
					.then(function (response) {
						if (response.data) {
							var modalOptions =
								{
									headerText$tr$: 'basics.customize.crbServices',
									bodyTemplate: ['<section class="modal-body">',
										'<div data-ng-controller="boqMainCrbLicenseCustomizeController">',
										'<div class="modal-wrapper" style="margin-top:10px">',
										'<div data-platform-form data-form-options="formOptions" entity="entity"></div>',
										'</div>',
										'</div>',
										'</section>'].join(''),
									customButtons: [{id: 'logoff', caption$tr$: 'basics.customize.crbLicenseLogoff'}, {id: 'test', caption$tr$: 'basics.customize.crbLicenseTest'}],
									showOkButton: true,
									showCancelButton: true,
									resizeable: true,
									minHeight: '400px',
									minWidth: '400px',
									data: response.data
								};
							platformDialogService.showDialog(modalOptions);
						}
					});
			};

			service.logoutLicenseService = function() {
				$http.post(crbBaseRoute + 'license/logout');
			};

			return service;
		}
	]);

	angularModule.controller('boqMainCrbLicenseCustomizeController', ['$http', '$scope', '$translate', 'platformDialogService', 'platformLongTextDialogService',
		function ($http, $scope, $translate, platformDialogService, platformLongTextDialogService) {
			var crbServices = $scope.dialog.modalOptions.data;

			$scope.entity = {crbServices};
			$scope.formOptions = {
				configure: {
					showGrouping: true,
					groups: [
						{gid: 'url', header: $translate.instant('basics.customize.crbUrls'), isOpen: true},
						{gid: 'lic', header: $translate.instant('basics.customize.crbLicenses'), isOpen: true}
					],
					rows: [{gid: 'url', rid: 'url1', label: $translate.instant('basics.customize.crbServiceLicense'), type: 'url', model: 'crbServices[0].Url'},
						{gid: 'url', rid: 'url2', label: $translate.instant('basics.customize.crbServicePartner'), type: 'url', model: 'crbServices[3].Url'},
						{gid: 'url', rid: 'url3', label: $translate.instant('basics.customize.crbServicePrdPartner'), type: 'url', model: 'crbServices[4].Url'},
						{gid: 'url', rid: 'url4', label: $translate.instant('basics.customize.crbServicePrdProductCatalog'), type: 'url', model: 'crbServices[5].Url'},
						{gid: 'url', rid: 'url5', label: $translate.instant('basics.customize.crbServiceContextData'), type: 'url', model: 'crbServices[6].Url' },
						{gid: 'url', rid: 'url6', label: $translate.instant('basics.customize.crbServiceSiaTest'), type: 'url', model: 'crbServices[7].Url' },
						{gid: 'lic', rid: 'lic1', label: $translate.instant('basics.customize.crbLicenseCustomer'), type: 'description', model: 'crbServices[0].Customer'},
						{gid: 'lic', rid: 'lic2', label: $translate.instant('basics.customize.crbLicenseFull'), type: 'description', model: 'crbServices[0].License'},
						{gid: 'lic', rid: 'lic3', label: $translate.instant('basics.customize.crbLicenseReadonly'), type: 'description', model: 'crbServices[1].License'},
						{gid: 'lic', rid: 'lic4', label: $translate.instant('basics.customize.crbLicenseEBkp'), type: 'description', model: 'crbServices[2].License'}]
				}
			};

			$scope.dialog.getButtonById('ok').fn = function () {
				crbServices[2].Customer = crbServices[1].Customer = crbServices[0].Customer;
				crbServices[2].Url = crbServices[1].Url = crbServices[0].Url;
				$http.post(globals.webApiBaseUrl + 'boq/main/crb/license/saveservices', $scope.entity.crbServices);
				$scope.$close({ok: true});
			};

			$scope.dialog.getButtonById('logoff').fn = function () {
				$http.get(globals.webApiBaseUrl + 'boq/main/crb/license/usedlicenses')
					.then(function (response) {
						if (response.data) {
							var modalOptions =
								{
									headerText$tr$: 'basics.customize.crbLicenseLogoff',
									bodyTemplate: ['<section class="modal-body">',
										'<div data-ng-controller="boqMainCrbLicenseLogoffController">',
										'<div class="modal-wrapper" style="margin-top:10px">',
										'<div class="modal-wrapper grid-wrapper_ subview-container">',
										'<platform-Grid data="gridData" />',
										'</div>',
										'</div>',
										'</div>',
										'</section>'].join(''),
									showOkButton: true,
									showCancelButton: true,
									resizeable: true,
									minHeight: '300px',
									minWidth: '300px',
									data: response.data
								};
							platformDialogService.showDialog(modalOptions);
						}
					});
			};

			$scope.dialog.getButtonById('test').fn = function () {
				$http.post(globals.webApiBaseUrl + 'boq/main/crb/license/test', $scope.entity.crbServices)
					.then(function (response) {
						if (response.data) {
							if (response.data.ErrorText) {
								platformDialogService.showErrorBox(response.data.ErrorText, 'cloud.common.errorMessage');
							} else {
								platformLongTextDialogService.showDialog(
									{
										headerText$tr$: 'basics.customize.crbValidLicenses',
										codeMode: true,
										hidePager: true,
										dataSource: new function () {
											platformLongTextDialogService.LongTextDataSource.call(this);
											this.current = response.data.LicenseUnlockInfos;
										}
									});
							}
						}
					});
			};
		}
	]);

	angularModule.controller('boqMainCrbLicenseLogoffController', ['$http', '$scope', '$translate', 'platformGridAPI',
		function ($http, $scope, $translate, platformGridAPI) {
			var users;
			var uniqueId = 0;
			var licenseInfo;
			var licenseInfos = [];

			// Inits the grid columns
			var gridColumns = [{id: 'LicenceID', field: 'LicenceID', name: $translate.instant('basics.customize.crbLicense'), width: 100},
				{id: 'user', field: 'user', name: $translate.instant('basics.customize.crbLicenseUser'), width: 200}];

			// Inits the grid rows
			users = $scope.dialog.modalOptions.data.Users;
			_.forEach($scope.dialog.modalOptions.data.UsedLicenses, function (license) {
				licenseInfo = license.LicenseInfo;
				licenseInfo.Id = uniqueId++;
				licenseInfo.workStations = [];
				_.forEach(license.WorkStations, function (workStation) {
					var user = _.find(users, {'Id': workStation.id});
					licenseInfo.workStations.push({'Id': uniqueId++, 'userId': workStation.id, 'user': user ? user.Name : workStation.id, 'parentId': licenseInfo.LicenceID});
				});
				licenseInfos.push(license.LicenseInfo);
			});

			// Inits the grid
			$scope.gridId = '177FF9649EF4407DBF6A9ABC975D67F8';
			$scope.gridData = {state: $scope.gridId};
			platformGridAPI.grids.config({'id': $scope.gridId, 'options': {idProperty: 'Id', tree: true, parentProp: 'parentId', childProp: 'workStations', collapsed: true}, 'columns': gridColumns});
			platformGridAPI.items.data($scope.gridId, licenseInfos);

			// Handles the log off
			var okButton = $scope.dialog.getButtonById('ok');
			okButton.disabled = function () {
				var selectedItems = platformGridAPI.rows.selection({'gridId': $scope.gridId, 'wantsArray': true});
				var selectedLicenseUsages = _.filter(selectedItems, 'parentId');
				return !(_.some(selectedLicenseUsages) && selectedItems.length === selectedLicenseUsages.length);
			};
			okButton.fn = function () {
				var licenseUsages = [];
				_.forEach(platformGridAPI.rows.selection({'gridId': $scope.gridId, 'wantsArray': true}), function (selectedItem) {
					licenseUsages.push({'Item1': selectedItem.parentId, 'Item2': selectedItem.userId});
				});

				$scope.$close({ok: true});
				$http.post(globals.webApiBaseUrl + 'boq/main/crb/license/deletelicenseusages' + '?licenseUsages=' + JSON.stringify(licenseUsages));
			};
		}
	]);
})();
