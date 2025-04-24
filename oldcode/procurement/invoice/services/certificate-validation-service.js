/**
 * Created by chi on 09.06.2014.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/**
	 * @ngdoc service
	 * @name reqHeaderElementValidationService
	 * @description provides validation methods for a ReqHeader
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.invoice').factory('procurementInvoiceCertificateValidationService',
		['validationService', 'procurementInvoiceCertificateDataService', '$http', 'platformDataValidationService',
			'$q', '$translate', 'basicsLookupdataLookupDescriptorService',
			function (validationService, dataService, $http, platformDataValidationService, $q, $translate, basicsLookupdataLookupDescriptorService) {
				var service = validationService.create('prcInvoiceCertificate', 'procurement/invoice/certificate/schema');

				service.asyncValidateBpdCertificateTypeFk = function asyncValidateBpdCertificateTypeFk(entity, value, model) {
					var defer = $q.defer();
					var result = platformDataValidationService.isUnique(dataService.getList(), 'BpdCertificateTypeFk', value, entity.Id);

					if (!result.valid) {
						defer.resolve({
							apply: false, valid: false,
							error: $translate.instant('cloud.common.uniqueValueErrorMessage', {object: 'certificate type'})
						});
					} else {
						var type = _.find(basicsLookupdataLookupDescriptorService.getData('CertificateType'), {Id: value});
						if (type) {
							entity.IsEditable = type.IsValued;
							entity.RequiredAmount = type.IsValued?entity.RequiredAmount:0;
						}
						defer.resolve(true);
					}
					platformDataValidationService.finishValidation(result, entity, value, model, service, dataService);
					dataService.updateReadOnly(entity);
					dataService.fireItemModified(entity);
					return defer.promise;
				};

				return service;
			}
		]);

})(angular);
