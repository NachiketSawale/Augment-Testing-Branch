/**
 * Created by chi on 3/21/2016.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';

	angular.module(moduleName).factory('procurementQuoteTotalValidationService', procurementQuoteTotalValidationService);

	procurementQuoteTotalValidationService.$inject = ['_', '$http', '$q', 'basicsLookupdataLookupDescriptorService'];

	function procurementQuoteTotalValidationService(_, $http, $q, basicsLookupdataLookupDescriptorService) {
		return function (dataService) {
			var service = {};
			service.asyncValidateValueNet = asyncValidateValueNet;

			service.asyncValidateValueNetOc = asyncValidateValueNetOc;

			service.validateValueTax = validateValueTax;

			service.validateValueTaxOc = validateValueTaxOc;

			service.asyncValidateGross = asyncValidateGross;

			service.asyncValidateGrossOc = asyncValidateGrossOc;

			return service;

			// ///////////////////////////////
			function asyncValidateValueNet(entity, value) {
				var defer = $q.defer();
				value = parseFloat(value);
				var parentService = dataService.parentService();
				var headerItem = parentService.getSelected();
				var requisitionService = _.find(parentService.getChildServices(), {name: 'procurement.quote.requisition'});
				getVatPercent(requisitionService).then(function(vatPercent){
					entity.ValueNet = value;
					entity.ValueTax = entity.ValueNet * vatPercent / 100;
					entity.ValueNetOc = entity.ValueNet * parseFloat(headerItem.ExchangeRate);
					entity.ValueTaxOc = entity.ValueNetOc * vatPercent / 100;
					entity.Gross = entity.ValueNet + parseFloat(entity.ValueTax);
					entity.GrossOc = entity.ValueNetOc + parseFloat(entity.ValueTaxOc);
					dataService.gridRefresh();
					dataService.isTotalDirty = true;
					defer.resolve({apply: true, valid: true});
				});

				return defer.promise;
			}

			function asyncValidateValueNetOc(entity, value) {
				value = parseFloat(value);
				var headerItem = dataService.parentService().getSelected();

				var valueNet = headerItem.ExchangeRate ? value / parseFloat(headerItem.ExchangeRate) : 0;
				dataService.isTotalDirty = true;
				return asyncValidateValueNet(entity, valueNet);
			}

			function validateValueTax(entity, value) {
				var headerItem = dataService.parentService().getSelected();
				value = parseFloat(value);
				entity.ValueTax = value;
				entity.Gross = parseFloat(entity.ValueNet) + value;
				entity.ValueTaxOc = headerItem.ExchangeRate ? value * parseFloat(headerItem.ExchangeRate) : 0;
				entity.GrossOc = parseFloat(entity.ValueNetOc) + value;
				return {apply: true, valid: true};
			}

			function validateValueTaxOc(entity, value) {
				var headerItem = dataService.parentService().getSelected();
				value = parseFloat(value);
				// recalculate value tax
				var valueTax = headerItem.ExchangeRate ? value / parseFloat(headerItem.ExchangeRate) : 0;
				validateValueTax(entity, valueTax);
				entity.ValueTaxOc = value;
				entity.ValueTax = valueTax;
				entity.GrossOc = parseFloat(entity.ValueNetOc) + value;
				entity.Gross = parseFloat(entity.ValueNet) + value;
				return {apply: true, valid: true};
			}

			function asyncValidateGross(entity, value) {
				var defer = $q.defer();
				value = parseFloat(value);
				var valueNet;
				var parentService = dataService.parentService();
				var requisitionService = _.find(parentService.getChildServices(), {name: 'procurement.quote.requisition'});
				getVatPercent(requisitionService).then(function(vatPercent) {
					valueNet = value / (1 + vatPercent / 100);
					asyncValidateValueNet(entity, valueNet);
					dataService.isTotalDirty = true;
					defer.resolve({apply: true, valid: true});
				});
				return defer.promise;
			}

			function asyncValidateGrossOc(entity, value) {
				var defer = $q.defer();
				var parentService = dataService.parentService();
				var requisitionService = _.find(parentService.getChildServices(), {name: 'procurement.quote.requisition'});
				getVatPercent(requisitionService).then(function (vatPercent){
					value = parseFloat(value);
					var valueNetOc = value / (1 + vatPercent / 100 );
					asyncValidateValueNetOc(entity, valueNetOc);
					dataService.isTotalDirty = true;
					defer.resolve({apply: true, valid: true});
				});
				return defer.promise;
			}

			function getVatPercent(service) {
				var defer = $q.defer();
				$http.get(globals.webApiBaseUrl + 'procurement/requisition/requisition/getreqheader?id=' + service.getList()[0].ReqHeaderFk).then(function(response){
					var reqHeader = response.data;
					var taxCode = _.find(basicsLookupdataLookupDescriptorService.getData('TaxCode'), {Id: reqHeader.TaxCodeFk});
					if (!taxCode) {
						basicsLookupdataLookupDescriptorService.loadItemByKey('TaxCode', reqHeader.TaxCodeFk).then(function(val){
							var vatPercent = val ? val.VatPercent : 0;
							defer.resolve(vatPercent * 1.0);
						});
					} else {
						defer.resolve(taxCode.VatPercent * 1.0);
					}
				});
				return defer.promise;
			}
		};
	}
})(angular);