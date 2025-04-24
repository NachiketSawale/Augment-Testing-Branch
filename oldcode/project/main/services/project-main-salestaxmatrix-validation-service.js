/**
 * Created by shen on 2/22/2022
 */

(function (angular) {
	/* global globals,  */
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainSalesTaxMatrixValidationService
	 * @description provides validation methods for project main salestaxmatrix entities
	 */
	angular.module(moduleName).service('projectMainSalesTaxMatrixValidationService', ProjectMainSalesTaxMatrixValidationService);

	ProjectMainSalesTaxMatrixValidationService.$inject = ['platformDataValidationService', '$http', 'project2SalesTaxCodeDataService', '$q'];

	function ProjectMainSalesTaxMatrixValidationService(platformDataValidationService, $http, project2SalesTaxCodeDataService, $q) {

		this.asyncValidateSalesTaxGroupFk = function (entity, value) {
			var defer = $q.defer();
			let selectedParentId = project2SalesTaxCodeDataService.getSelected().SalesTaxCodeFk; //
			if(entity && entity.SalesTaxGroupFk !== value && entity.Version === 0){
				$http.get(globals.webApiBaseUrl + 'project/main/salestaxmatrix/gettaxpercentage?project2SalesTaxCodeFk=' + selectedParentId + '&salesTaxGroupFk=' + value).then(function (response){
					if(response){
						entity.PrjTaxPercent = response.data;
						entity.TaxPercent = response.data;
						return defer.resolve(true);
					}
				});
			}
			return defer.promise;
		};
	}

})(angular);

