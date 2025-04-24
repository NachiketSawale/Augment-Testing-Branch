/**
 * Really created by Frank Baedeker on 27.08.2015.
 */

(function (angular) {
	'use strict';
	/*global globals*/
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainTenderResultValidationService
	 * @description provides validation methods for project entities
	 */
	angular.module(moduleName).service('projectMainTenderResultValidationService', ProjectMainTenderResultValidationService);

	ProjectMainTenderResultValidationService.$inject = [
		'projectMainTenderResultService', 'platformDataValidationService', 'platformRuntimeDataService', '$http', 'projectMainService', '_','$q'
	];

	function ProjectMainTenderResultValidationService(
		projectMainTenderResultService, platformDataValidationService, platformRuntimeDataService, $http, projectMainService, _, $q
	) {
		var self = this;

		this.validateOneOfBusinessPartnerIsSet = function validateOneOfBusinessPartnerIsSet(entity, value, model1, model2) {
			var result1 = platformDataValidationService.validateMandatory(entity, value, model1, self, projectMainTenderResultService);
			var result2 = platformDataValidationService.validateMandatory(entity, value, model2, self, projectMainTenderResultService);

			if(!result1.valid && !result2.valid) {
				result1.error = '...';
				result1.error$tr$ = 'project.main.tenderResultBusinessPartnerMandatory';
			}
			else {
				result1.valid = true;
				result1.error = '';
				result1.error$tr$ = '';
			}
			platformRuntimeDataService.applyValidationResult(result1, entity, model1);
			platformRuntimeDataService.applyValidationResult(result1, entity, model2);

			return result1;
		};

		this.validateBusinessPartner = function validateBusinessPartnerFk(entity, value, model) {
			return self.validateOneOfBusinessPartnerIsSet(entity, value, model, 'BusinessPartnerFk');
		};

		this.asyncValidateSaleFk = function asyncValidateSaleFk (entity, value, model){
			let res = {valid: true, apply: true};
			if(entity && value){
				let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectMainTenderResultService);

				asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'project/main/sale/list?projectId='+ entity.ProjectFk).then(function (result) {
					if(result && result.data && result.data.length > 0){
						_.forEach(result.data,function (item){
							if(value === item.Id){
								entity.BasCurrencyFk = item.BasCurrencyFk;
							}
						});
					}
					platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, self, projectMainTenderResultService);
					return res;
				});
				return asyncMarker.myPromise;
			}
			else{
				let defer = $q.defer();
				entity.BasCurrencyFk = projectMainService.getSelectedEntities()[0].CurrencyFk;
				defer.resolve(res);
				return defer.promise;
			}
		};
		this.validateBusinessPartnerFk = function validateBusinessPartnerFk(entity, value, model) {
			return self.validateOneOfBusinessPartnerIsSet(entity, value, model, 'BusinessPartner');
		};

		function calculateFinalQuotation(quotation, globalPerc, discount, otherDiscount) {
			return (quotation - (quotation * globalPerc / 100) - (quotation - (quotation * globalPerc / 100)) * discount / 100) - otherDiscount;
		}
		let doValidateFinalQuotation = function doValidateFinalQuotation(entity, value, model) {
			entity[model] = value
			let tenderResults = projectMainTenderResultService.getList();
			let groupedResults = _.groupBy(tenderResults, 'SaleFk');
			_.forEach(groupedResults, (saleEntities) => {
				let minQuotation = _.minBy(saleEntities, 'FinalQuotation').FinalQuotation;
				_.forEach(saleEntities, (e) => {
					if(minQuotation > 0){
						e.Deviation = ((e.FinalQuotation - minQuotation) * 100) / minQuotation;
					} else {
						e.Deviation = null;
					}
					projectMainTenderResultService.fireItemModified(e);
				});
			});
		}

		this.validateFinalQuotation = function validateFinalQuotation(entity, value, model) {
			doValidateFinalQuotation(entity, value, model)
			return true;
		};

		this.validateQuotation = function validateQuotation(entity, value) {
			entity.FinalQuotation = calculateFinalQuotation(value, entity.GlobalPercentage, entity.Discount, entity.OtherDiscount);
			doValidateFinalQuotation(entity, entity.FinalQuotation, 'FinalQuotation')
			return true;
		};

		this.validateGlobalPercentage = function validateGlobalPercentage(entity, value) {
			entity.FinalQuotation = calculateFinalQuotation(entity.Quotation, value, entity.Discount, entity.OtherDiscount);
			doValidateFinalQuotation(entity, entity.FinalQuotation, 'FinalQuotation')
			return true;
		};

		this.validateDiscount = function validateDiscount(entity, value) {
			entity.FinalQuotation = calculateFinalQuotation(entity.Quotation, entity.GlobalPercentage, value, entity.OtherDiscount)
			doValidateFinalQuotation(entity, entity.FinalQuotation, 'FinalQuotation')
			return true;
		};

		this.validateOtherDiscount = function validateOtherDiscount(entity, value) {
			entity.FinalQuotation = calculateFinalQuotation(entity.Quotation, entity.GlobalPercentage, entity.Discount, value);
			doValidateFinalQuotation(entity, entity.FinalQuotation, 'FinalQuotation')
			return true;
		};
	}
})(angular);
