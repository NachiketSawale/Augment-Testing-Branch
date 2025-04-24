(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).directive('basicsCompanyCopyCompanySecondGridDirective', [
		'$translate', 'platformGridAPI', 'platformObjectHelper', 'basicsCommonDialogGridControllerService','$rootScope',
		function ($translate, platformGridAPI, platformObjectHelper, dialogGridControllerService,$rootScope) {

			return {
				restrict: 'A',
				scope: {},
				replace: false,
				templateUrl: globals.appBaseUrl + 'basics.company/partials/copy-company-selection-grid.html',
				controller: ['$scope', '_',
					'basicsCompanyCopyCompanySecondGridDataService',
					'basicsCompanyCopyCompanySecondGridUIService',
					'basicsCommonHeaderColumnCheckboxControllerService',
					controller]
			};

			function controller($scope, _,  dataService,
				uiService, basicsCommonHeaderColumnCheckboxControllerService) {
				$scope.gridUUID = 'c18198b5aaaf4eb8857f2fb18769256b';
				$scope.pageGridText=$translate.instant('basics.company.numberHeader');
				let gridConfig = {
					uuid: $scope.gridUUID,
					initCalled: false,
					columns: [],
					grouping: false,
					idProperty: 'Id',
					parentProp: 'ParentId', childProp: 'Children'
				};

				function setSelection(items, parent) {
					if (!parent || _.isEmpty(items)) {
						return;
					}
					_.forEach(items, function (item) {
						item.selection = parent.selection;
						if (!_.isEmpty(item.Children)) {
							setSelection(item.Children, item);
						}
					});
				}
				let validationService = {
					validateselection: function (item, value, model) {
						item[model] = value;
						setSelection(item.Children,item);
						dataService.gridRefresh();
					}
				};

				dialogGridControllerService.initListController($scope, uiService, dataService,  validationService, gridConfig);

				let checkboxFields = ['selection'];
				let headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: function (e) {
							let isSelected = (e.target.checked);
							let items = dataService.getList();
							angular.forEach(items,function (item) {
								if(item.Children && item.Children.length>0){
									angular.forEach(item.Children,function (child) {
										child.selection = isSelected;
									});
								}
							});
							if ($rootScope) {
								$rootScope.safeApply();
							}
						}
					}
				];
				basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, checkboxFields, headerCheckBoxEvents);
				dataService.load();
			}
		}
	]);
})(angular);
