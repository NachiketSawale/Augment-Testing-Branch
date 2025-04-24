/**
 * Created by zwz on 07/07/2022.
 */

(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductReuseFromStockWizardRemainderSettingService', Service);
	Service.$inject = ['$http', '$injector', '$q'];

	function Service($http, $injector, $q) {

		let service = {};
		let scope = {};

		function initSettingObj(scope) {
			scope.settingObj = {
				scrapRemainingLength: true,
				scrapRemainingWidth: true,
				hasNoRemLength: !scope.context.selectedReusableProduct.HasRemLength,
				hasNoRemWidth: !scope.context.selectedReusableProduct.HasRemWidth
			};
		}

		service.initial = function initial($scope) {
			scope = $scope;
			initSettingObj(scope);
			scope.currentProduct = scope.context.selectedReusableProduct;
		};

		service.isValid = function () {
			return true;
		};

		service.active = function (){
			let defer = $q.defer();
			if(scope.currentProduct !== scope.context.selectedReusableProduct){
				initSettingObj(scope);
				scope.currentProduct = scope.context.selectedReusableProduct;
			}
			defer.resolve(true);
			return defer.promise;
		};

		service.unActive = function () {
			let defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.getResult = function (){
			return scope.settingObj;
		};

		return service;
	}

})(angular);
