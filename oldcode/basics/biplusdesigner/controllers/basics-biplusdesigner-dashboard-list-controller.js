
(function (angular) {
	'use strict';

	var moduleName = 'basics.biplusdesigner';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsBiPlusDesignerDashboardController',
		['$scope', '_', 'platformGridControllerService','basicsBiPlusDesignerService',
			'basicsBiPlusDesignerDashboardUIStandardService','basicsBiPlusDesignerDashboardValidationService', '$timeout', 'platformPermissionService', 'permissions', '$http', 'basicsBiPlusDesignerDashboardParameterDataService', 'platformDialogService', '$q',
			function ($scope, _,  gridControllerService, dataService, gridColumns, validationService, $timeout, platformPermissionService, permissions, $http, parametersDataService, platformDialogService, $q) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					toolbarBtnState:{
						copyPasteBtnHidden:true
					}
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				var refreshButton = {
					id: 'syncdashboards',
					type: 'item',
					caption: 'basics.biplusdesigner.toolbarSyncBtn',
					iconClass: 'tlb-icons ico-refresh',
					sort:-4,
					fn: function () {

						var importDialogConfig = {
							headerText$tr$: 'basics.biplusdesigner.import.dialogTitle',
							bodyTemplateUrl: globals.appBaseUrl + 'basics.biplusdesigner/templates/basics-biplusdesigner-import-dialog.html',
							showCancelButton: false,
							showCloseButton:false,
							showNoButton: false,
							showOkButtom: false,
							resizeable: true,
							width: '700px',
							minWidth: '700px',
							buttons: []
						};

						return platformDialogService.showDialog(importDialogConfig).then(function (response) {
							return response;
						}, function importDialogClosed() {
							return {cancel: true};
						});
					}
				};

				var divider0 = {
					id: 'tdDv0',
					type: 'divider',
					sort:-5
				};

				platformPermissionService.loadPermissions(['2ec68681903544bfbe5f159382a61d70']).then(function () {
					console.log();
					if (platformPermissionService.has('2ec68681903544bfbe5f159382a61d70', permissions.write) || platformPermissionService.has('90105e745ddf4afc866001aed14e581f', permissions.create) || platformPermissionService.has('90105e745ddf4afc866001aed14e581f', permissions.delete)) {
						$scope.addTools([refreshButton, divider0]);
						$timeout($scope.tools.update, 0, true);
					}
				});
			}
		]);
})(angular);