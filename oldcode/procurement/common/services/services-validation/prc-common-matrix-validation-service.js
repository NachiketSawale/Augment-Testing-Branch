(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name procurementCommonMatrixValidationService
	 * @require $http
	 * @description provides validation methods for a Matrix
	 */
	angular.module('procurement.common').factory('procurementCommonMatrixValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', '$timeout', '$http', 'globals','$q',
			function (platformDataValidationService, platformRuntimeDataService, $timeout, $http, globals,$q) {

				let service = {};

				service.asyncValidateTaxCodeFk = (dataService,entity,value,model)=>{
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						defer.resolve(true);
					} else {
						entity.TaxCodeFk = value;
						if(!_.isNil(entity.BpdVatGroupFk)){
							setMatrixByTaxCodeVatGroup(entity,dataService);
						}
						defer.resolve(true);
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				}

				service.asyncValidateBpdVatGroupFk = (dataService,entity,value,model)=>{
					var defer = $q.defer();
					var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
					if (null === value) {
						entity.MatrixCodeFk =  null;
						entity.MatrixComment = null;
						dataService.fireItemModified(entity);
						defer.resolve(true);
					} else {
						entity.BpdVatGroupFk = value;
						setMatrixByTaxCodeVatGroup(entity,dataService);
						defer.resolve(true);
						asyncMarker.myPromise = defer.promise;
					}
					asyncMarker.myPromise = defer.promise.then(function (response) {
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, asyncMarker, service, dataService);
					});
					return asyncMarker.myPromise;
				}

				function setMatrixByTaxCodeVatGroup(entity,dataService) {
					return $http.get(globals.webApiBaseUrl + 'basics/taxcode/taxcodeMatrix/getmatrixbyvatgroup?TaxCodeFk='+entity.TaxCodeFk+'&VatGroupFk='+entity.BpdVatGroupFk)
						.then((response)=>{
						const matrix = response.data;
						entity.MatrixCodeFk = matrix === '' ? null : matrix.Id;
						entity.MatrixComment = matrix === '' ? null : matrix.CommentTranslateInfo.Translated;
						dataService.fireItemModified(entity);
					});
				}

				return service;
			}
		]);
})(angular);
