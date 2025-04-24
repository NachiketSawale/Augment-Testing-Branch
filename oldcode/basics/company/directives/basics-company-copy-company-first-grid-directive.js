(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).directive('basicsCompanyCopyCompanyFirstGridDirective', [
		'$translate', 'platformGridAPI', 'platformObjectHelper', 'basicsCommonDialogGridControllerService',
		function ($translate, platformGridAPI, platformObjectHelper, dialogGridControllerService) {
			return {
				restrict: 'A',
				scope: {},
				replace: false,
				templateUrl: globals.appBaseUrl + 'basics.company/partials/copy-company-selection-grid.html',
				controller: ['$scope', '_', '$rootScope',
					'basicsCompanyCopyCompanyFirstGridDataService',
					'basicsCompanyCopyCompanyFirstGridUIService',
					'basicsCommonHeaderColumnCheckboxControllerService',
					'$injector',
					controller]
			};
			function controller($scope, _, $rootScope, dataService,
				uiService, basicsCommonHeaderColumnCheckboxControllerService,
				$injector) {
				$scope.pageGridText=$translate.instant('basics.company.copyCompany.targetCompany');
				$scope.gridUUID = 'b85af5b55eb14df8ac99b38731e9c3ae';
				dataService.setSourceCompanyId($scope.$parent.companyItems.sourceCompanyId);
				let gridConfig = {
					uuid: $scope.gridUUID,
					initCalled: false,
					columns: [],
					grouping: false,
					idProperty: 'Id',
					parentProp: 'CompanyFk', childProp: 'Companies',

				};

				dialogGridControllerService.initListController($scope, uiService, dataService, {}, gridConfig);

				let checkboxFields = ['selection'];
				let headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: function (e) {
							let isSelected = (e.target.checked);
							let items = dataService.getList();
							angular.forEach(items,function (item) {
								if (item.Id !== $scope.$parent.companyItems.sourceCompanyId) {
									item.selection = isSelected;
								}
								else {
									item.selection = false;
								}
							});
							if ($rootScope) {
								$rootScope.safeApply();
							}
						}
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);
				// parse permission
				// It is a bad practice to override 'setTools' and 'getTools' function, for example, here missing some permission data transform lead to 'Grid Layout' config button disappear.
				function parsePermission(tool) {
					if (_.isString(tool.permission)) {
						let splits = tool.permission.split('#');
						tool.permission = {};
						tool.permission[splits[0]] = $injector.get('platformPermissionService').permissionsFromString(splits[1]);
					}
				}
				_.forEach($scope.tools.items, function (item) {
					parsePermission(item);
					if (item.list && item.list.items && _.isArray(item.list.items)) {
						_.each(item.list.items, function (subTool) {
							parsePermission(subTool);
						});
					}
				});
				dataService.load();
			}
		}
	]);
})(angular);
