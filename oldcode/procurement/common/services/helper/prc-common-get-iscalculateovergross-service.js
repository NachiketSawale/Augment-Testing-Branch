(function (angular) {
	'use strict';
	/* global _ */
	var modelName = 'procurement.common';
	angular.module(modelName).service('prcGetIsCalculateOverGrossService', [
		'$q',
		'platformContextService',
		'basicsLookupdataLookupDescriptorService',
		function (
			$q,
			platformContextService,
			lookupDescriptorService
		) {
			var self = this;
			var loginCompanyFk = platformContextService.clientId;
			var overGrossObj = {
				isOverGross: false
			};
			var company = null;

			self.init = function() {
				if (loginCompanyFk && company === null) {
					lookupDescriptorService.loadData('company').then(function (companies) {
						company = _.find(companies, {Id: loginCompanyFk});
						overGrossObj.isOverGross = company.IsCalculateOverGross;
					});
				}
			};
			self.init();

			self.getIsCalculateOverGross = function() {
				return overGrossObj.isOverGross;
			};

			self.getIsCalculateOverGrossPromise = function() {
				var deferred = $q.defer();
				if (loginCompanyFk && company === null) {
					lookupDescriptorService.loadData('company').then(function (companies) {
						company = _.find(companies, {Id: loginCompanyFk});
						overGrossObj.isOverGross = company.IsCalculateOverGross;
						deferred.resolve(overGrossObj.isOverGross);
					});
				}
				else {
					deferred.resolve(overGrossObj.isOverGross);
				}
				return deferred.promise;
			};
		}]);
})(angular);
