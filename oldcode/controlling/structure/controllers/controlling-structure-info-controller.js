/**
 * Created by janas on 21.01.2015.
 */


(function () {
	'use strict';
	var moduleName = 'controlling.structure',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name controllingStructureInfoController
	 * @description
	 * Controller for info view in sidebar.
	 **/
	angModule.controller('controllingStructureInfoController',
		['_', '$scope', '$translate', 'cloudDesktopSidebarInfoControllerService', 'basicsLookupdataLookupDescriptorService', 'controllingStructureMainService',
			function controllingStructureInfoController(_, $scope, $translate, cloudDesktopSidebarInfoControllerService, basicsLookupdataLookupDescriptorService, controllingStructureMainService) {

				var dataConfig = [
					{
						dataService: controllingStructureMainService,
						selectedItem: 'controllingStructureItem'
					}
				];

				$scope.config = [
					{
						panelType: 'text',
						header: 'getFirstHeader()',
						model: 'controllingStructureItem',
						items: [
							{
								model: 'PlannedStart',
								iconClass: 'tlb-icons ico-date',
								description: '"' + $translate.instant('controlling.structure.entityPlannedStart') + '"',
								domain: 'date'
							},
							{
								model: 'PlannedEnd',
								iconClass: 'tlb-icons ico-date',
								description: '"' + $translate.instant('controlling.structure.entityPlannedEnd') + '"',
								domain: 'date'
							}
						]
					}
				];

				// Header
				$scope.getFirstHeader = function () {
					if ($scope.controllingStructureItem) {
						return $scope.controllingStructureItem.Code + ' - ' + _.get($scope.controllingStructureItem, 'DescriptionInfo.Translated');
					}
				};

				cloudDesktopSidebarInfoControllerService.init($scope, dataConfig);

			}]);
})();
