/**
 * Created by lnt.
 */
(function () {

	'use strict';

	let moduleName = 'qto.main';

	/**
	 * @ngdoc controller
	 * @name qtoMainHeaderLookupController
	 * @function
	 *
	 * @description
	 * Controller for the qto header lookup view.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('qtoMainHeaderLookupController',
		['$scope', '$injector', '$translate', 'platformPermissionService', 'qtoMainDetailLookupFilterService',
			function ($scope, $injector, $translate, platformPermissionService, qtoMainDetailLookupFilterService) {

				// scope variables/ functions
				$scope.selectedQtoHeader = qtoMainDetailLookupFilterService.selectedQtoHeader;
				$scope.selectedItem = null;
				$scope.entity = null;

				$scope.qtoHeaderLookupFilter = qtoMainDetailLookupFilterService.qtoHeaderLookupFilter;

				let qtoHeaderLookupService = $injector.get('qtoMainCopyHeaderLookupDataService');
				qtoHeaderLookupService.setFilter($scope.selectedQtoHeader);

				let reactOnSelectedItemChanged = function reactOnSelectedItemChanged(selectedItem) {
					if (selectedItem){
						selectedItem.Description = selectedItem.DescriptionInfo.Translated;
					}

					qtoMainDetailLookupFilterService.setSelectedQtoHeader(selectedItem);

					$scope.selectedQtoHeader = qtoMainDetailLookupFilterService.selectedQtoHeader;

					let projectId = selectedItem ? selectedItem.ProjectFk : 0;
					$injector.get('qtoMainCommonService').setLookupWithProjectId(projectId);

					$injector.get('qtoMainLineLookupService').load();
				};

				$scope.lookupOptions = {
					events: [
						{
							name: 'onSelectedItemChanged', handler: function selectedQtoHeaderChanged(e, args) {
								reactOnSelectedItemChanged(args.selectedItem);
							}
						}
					],
					dataServiceName: 'qtoMainCopyHeaderLookupDataService',
					displayMember: 'Code',
					lookupModuleQualifier: 'qtoMainCopyHeaderLookupDataService',
					lookupType: 'qtoMainCopyHeaderLookupDataService',
					showClearButton: true,
					valueMember: 'Id',
					uuid: 'd8f04424217948f4b14d19dc41fb7d86',
					disableDataCaching: true,
					filterOnSearchIsFixed: true,
					isClientSearch: true,
					filter: function (/* entity */) {
						return $scope.qtoHeaderLookupFilter;
					},
					columns: [
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							formatter: 'code',
							name$tr$: 'cloud.common.entityCode'
						},
						{
							id: 'Description',
							field: 'DescriptionInfo.Description',
							name: 'Description',
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'BasRubricCategoryFk',
							field: 'BasRubricCategoryFk',
							name: 'Rubric Category',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'QtoFormulaRubricCategory',
								displayMember: 'Description'
							},
							name$tr$: 'qto.main.BasRubricCategoryFk'
						}
					],
					popupOptions: {
						width: 350
					}
				};

				qtoMainDetailLookupFilterService.qtoHeaderFilterCleared.register(clearedQtoHeaderFilter);

				function clearedQtoHeaderFilter(){
					$scope.selectedQtoHeader = {Id: null, Code: '', Description: ''};
				}

				$scope.$on('$destroy', function () {
					qtoMainDetailLookupFilterService.qtoHeaderFilterCleared.unregister(clearedQtoHeaderFilter);
				});
			}
		]);
})();
