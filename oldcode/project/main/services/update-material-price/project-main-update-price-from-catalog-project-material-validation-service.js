/**
 * Created by chi on 2/21/2019.
 */
(function(angular) {
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdatePriceFromCatalogProjectMaterialValidationService', projectMainUpdatePriceFromCatalogProjectMaterialValidationService);

	projectMainUpdatePriceFromCatalogProjectMaterialValidationService.$inject = ['$injector', '$timeout'];

	function projectMainUpdatePriceFromCatalogProjectMaterialValidationService($injector, $timeout) {
		var service = {};
		service.validateMaterialPriceVersionFk = validateMaterialPriceVersionFk;
		service.validateSelected = validateSelected;
		service.validateNewPrjEstimatePrice = validateNewPrjEstimatePrice;
		return service;

		///////////////////////////////////
		function validateMaterialPriceVersionFk(entity, value) {
			if (!value) {
				return true;
			}
			$timeout(function () {
				var dataService = $injector.get('projectMainUpdatePriceFromCatalogProjectMaterialService');
				dataService.changeSourceOptionByPriceVersionId(entity, value);
			});
			return true;
		}

		function validateSelected(entity, value) {
			var prjDataService = $injector.get('projectMainUpdatePriceFromCatalogPriceListService');
			var dataService = $injector.get('projectMainUpdatePriceFromCatalogMainService');
			let data = dataService.cacheData;
			let prjMatId = entity.Id;
			if (prjMatId) {
				prjDataService.setList(data[prjMatId]);
			}
			// $timeout(function() {
			// 	var dataService = $injector.get('projectMainUpdatePriceFromCatalogMainService');
			// 	let data = dataService.cacheData;
			// 	var list = dataService.getList();
			// 	//resetSelectedChildren(entity.Children, value);
			// 	//resetSelectedAll(list, [], []);
			// 	dataService.gridRefresh();
			// });
			// ////////////////////
			// function resetSelectedChildren(children, value) {
			// 	if (children.length > 0) {
			// 		_.forEach(children, function(child) {
			// 			child.Selected = value;
			// 			resetSelectedChildren(child.Children, value);
			// 		});
			// 	}
			// }
			//
			// function resetSelectedAll(items, checked, unchecked) {
			// 	if (items.length > 0) {
			// 		_.forEach(items, function (item) {
			// 			var check = [];
			// 			var uncheck = [];
			// 			resetSelectedAll(item.Children, check, uncheck);
			// 			if (item.Children.length > 0) {
			// 				if (check.length === item.Children.length) {
			// 					item.Selected = true;
			// 					checked.push(item);
			// 				} else if (uncheck.length === item.Children.length) {
			// 					item.Selected = false;
			// 					unchecked.push(item);
			// 				} else {
			// 					item.Selected = 'unknown';
			// 				}
			// 			}
			// 			else {
			// 				if (item.Selected === true) {
			// 					checked.push(item);
			// 				} else if (item.Selected === false) {
			// 					unchecked.push(item);
			// 				}
			// 			}
			// 		});
			// 	}
			// }
		}

		function validateNewPrjEstimatePrice(entity) {
			$timeout(function () {
				var dataService = $injector.get('projectMainUpdatePriceFromCatalogProjectMaterialService');
				dataService.calculateVariance(entity);
				dataService.gridRefresh();
			});
			return true;
		}
	}

})(angular);