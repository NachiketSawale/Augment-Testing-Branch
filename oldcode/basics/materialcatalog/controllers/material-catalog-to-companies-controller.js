/**
 * Created by lvy on 5/15/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.materialcatalog';
	angular.module(moduleName).controller('basicsMaterialCatalogCatToCompaniesController',
		['$scope', 'platformGridAPI', 'basicsMaterialCatalogToCompaniesService', 'platformGridControllerService', 'basicsMaterialCatalogToCompaniesUIStandardService',
			function ($scope, platformGridAPI, dataService, platformGridControllerService, basicsMaterialCatalogToCompanysUIStandardService) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'CompanyFk',
					childProp: 'Companies',
					addValidationAutomatically: false
				};


				platformGridControllerService.initListController($scope, basicsMaterialCatalogToCompanysUIStandardService, dataService, null, myGridConfig);

				function onGridCellClicked(e, args) {

					if (args.item.Companies && args.item.Companies.length > 0)   // node has child items
					{
						setStateRecursive(args.item, args.item.IsOwner, args.item.CanEdit, args.item.CanLookup);
					}

					platformGridAPI.grids.invalidate($scope.gridId);

				}
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onGridCellClicked);


				function setStateRecursive(item, newIsOwnerState, newCanEditState, newCanLookupState) {

					item.IsOwner = newIsOwnerState;
					item.CanEdit = newCanEditState;
					item.CanLookup = newCanLookupState;
					dataService.markItemAsModified(item);

					var len = item.Companies ? item.Companies.length : 0;
					for (var i = 0; i < len; i++){
						setStateRecursive(item.Companies[i], newIsOwnerState, newCanEditState, newCanLookupState);
					}
				}

				var removeItems = ['create', 'delete', 'createChild'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onGridCellClicked);
				});

			}
		]);
})(angular);