/**
 * Created by baf on 02.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceContainerInformationService
	 * @description provides information on container used in logistic sundryService module
	 */
	angular.module(moduleName).service('logisticSundryserviceContainerInformationService', LogisticSundryServiceContainerInformationService);

	LogisticSundryServiceContainerInformationService.$inject = ['_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'logisticSundryServiceConstantValues'];

	function LogisticSundryServiceContainerInformationService(_, platformLayoutHelperService, basicsLookupdataConfigGenerator,
		logisticSundryServiceConstantValues) {
		var self = this;
		var guids = logisticSundryServiceConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case guids.sundryServiceList: // logisticSundryServiceListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticSundryServiceServiceInfos(),
						self.getLogisticSundryServiceLayout);
					break;
				case guids.sundryServiceDetails: // logisticSundryServiceDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticSundryServiceServiceInfos(),
						self.getLogisticSundryServiceLayout);
					break;
				case guids.servicePriceListList: // logisticSundryServicePriceListListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getLogisticSundryServicePriceListServiceInfos(),
						self.getLogisticSundryServicePriceListLayout);
					break;
				case guids.servicePriceListDetails: // logisticSundryServicePriceListDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getLogisticSundryServicePriceListServiceInfos(),
						self.getLogisticSundryServicePriceListLayout);
					break;
			}
			return config;
		};

		this.getLogisticSundryServiceServiceInfos = function getLogisticSundryServiceServiceInfos() {
			return {
				standardConfigurationService: 'logisticSundryServiceLayoutService',
				dataServiceName: 'logisticSundryServiceDataService',
				validationServiceName: 'logisticSundryServiceValidationService'
			};
		};

		this.getLogisticSundryServiceLayout = function getLogisticSundryServiceLayout() {
			return self.getBaseLayout('logistic.sundryService.sundryService',
				['code', 'descriptioninfo', 'sundryservicegroupfk', 'specification', 'uomfk'],
				['sundryservicegroupfk', 'uomfk']);

		};

		this.getLogisticSundryServicePriceListServiceInfos = function getLogisticSundryServicePriceListServiceInfos() {
			return {
				standardConfigurationService: 'logisticSundryServicePriceListLayoutService',
				dataServiceName: 'logisticSundryServicePriceListDataService',
				validationServiceName: 'logisticSundryServicePriceListValidationService'
			};
		};

		this.getLogisticSundryServicePriceListLayout = function getLogisticSundryServicePriceListLayout() {
			var res = self.getBaseLayout('logistic.sundryService.priceList',
				['commenttext', 'currencyfk', 'priceportion1', 'priceportion2', 'priceportion3', 'priceportion4', 'priceportion5', 'priceportion6', 'priceportionsum', 'validfrom', 'validto','ismanual'],
				['currencyfk']);

			res.overloads.priceportionsum = { readonly: true };

			return res;
		};

		this.getBaseLayout = function getBaseLayout(fid, atts, overloads) {
			var res = {
				version: '1.0.0',
				fid: fid,
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: atts
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				]
			};

			res.overloads = self.getOverloads(overloads);

			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			var ovls = {};
			if (overloads) {
				_.forEach(overloads, function (ovl) {
					var ol = self.getOverload(ovl);
					if (ol) {
						ovls[ovl] = ol;
					}
				});
			}

			return ovls;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch (overload) {
				case 'uomfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'sundryservicegroupfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticSundryServiceGroupLookupDataService'
					}); break;
				case 'currencyfk':
					ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification());
					break;
			}

			return ovl;
		};
	}

})(angular);