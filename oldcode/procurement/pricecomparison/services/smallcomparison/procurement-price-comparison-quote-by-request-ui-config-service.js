/**
 * Created by baf on 20.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonQuoteByRequestUiConfigService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  procurement priceComparison quoteByRequest entity.
	 **/
	angular.module(moduleName).service('procurementPriceComparisonQuoteByRequestUiConfigService', ProcurementPriceComparisonQuoteByRequestUiConfigService);

	ProcurementPriceComparisonQuoteByRequestUiConfigService.$inject = ['platformLayoutHelperService'];

	function ProcurementPriceComparisonQuoteByRequestUiConfigService(platformLayoutHelperService) {
		var self = this;

		this.getStandardGridConfig = function getStandardGridConfig() {
			return platformLayoutHelperService.getStandardGridConfig(
				self.getQuoteByRequestServiceInfo(), self.getQuoteByRequestLayout);
		};

		this.getQuoteByRequestServiceInfo = function getQuoteByRequestServiceInfo() {
			return{
				standardConfigurationService: 'procurementPriceComparisonQuoteByRequestLayoutService',
				dataServiceName: 'procurementPriceComparisonQuoteByRequestDataService',
				validationServiceName: 'procurementPriceComparisonQuoteByRequestValidationService'
			};
		};

		this.getQuoteByRequestLayout = function getQuoteByRequestLayout() {
			var res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0','procurement.pricecomparison.quotebyrequest',
				['rfqdescription','code','qtndescription','qtnstatus','qtnvaluenet','qtnvaluenetoc',
					'qtnvaluetax','qtnvaluetaxoc','qtnversion','exchangerate',
					'bpname1','bpname2','bpname3','bpname4','ismainaddress','subsidiary',
					'subsidiaryaddress','subsidiarytelephone','subsidiarytelefax','subsidiarymobileno',
					'suppliercode','datequoted','datereceived','datepricefixing','businesspartneremail'],
				[]);
			// res.overloads =platformLayoutHelperService.getOverloads(['employeefk','sundryservicefk'],self);
			// res.addAdditionalColumns= true;
			res.overloads = {};
			// res.overloads.qtnvaluetax = {readonly: true};
			if (res.groups[0] && res.groups[0].attributes){
				_.forEach(res.groups[0].attributes, attr => {
					res.overloads[attr] = _.extend(res.overloads[attr],{readonly: true})
				});
			}
			return res;
		};
	}
})(angular);