/**
 * Created by baf on 27.10.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.catalog';

	/**
	 * @ngdoc service
	 * @name resourceCatalogContainerInformationService
	 * @description provides information on container used in resource catalog module
	 */
	angular.module(moduleName).service('resourceCatalogContainerInformationService', ResourceCatalogContainerInformationService);

	ResourceCatalogContainerInformationService.$inject = ['_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function ResourceCatalogContainerInformationService(_, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = null;
			switch (guid) {
				case 'd6267b2141db4c6f831d20c3f95f48f9': // resourceCatalogListController
					config = self.getResourceCatalogServiceInfos();
					config.layout = self.getResourceCatalogLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'd5983c44f2e243e4971ba9c82a73f0b0': // resourceCatalogListController
					config = self.getResourceCatalogServiceInfos();
					config.layout = self.getResourceCatalogLayout();
					config.ContainerType = 'Detail';
					break;
				case 'bae34453f83744d3a6f7e53b7851e657': // resourceCatalogRecordListController
					config = self.getResourceCatalogRecordServiceInfos();
					config.layout = self.getResourceCatalogRecordLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'b6d25f959003460cbf03529c91ad5894': // resourceCatalogRecordDetailController
					config = self.getResourceCatalogRecordServiceInfos();
					config.layout = self.getResourceCatalogRecordLayout();
					config.ContainerType = 'Detail';
					break;
				case '99a21ea527b44736892593accc5e6b6f': // resourceCatalogRecordListController
					config = self.getPriceIndexServiceInfos();
					config.layout = self.getPriceIndexLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '85f0ed0cc8b3488297e3b411b17e5a5b': // resourceCatalogRecordDetailController
					config = self.getPriceIndexServiceInfos();
					config.layout = self.getPriceIndexLayout();
					config.ContainerType = 'Detail';
					break;
			}
			return config;
		};

		this.getResourceCatalogServiceInfos = function getResourceCatalogServiceInfos() {
			return {
				standardConfigurationService: 'resourceCatalogLayoutService',
				dataServiceName: 'resourceCatalogDataService',
				validationServiceName: 'resourceCatalogValidationService'
			};
		};

		this.getResourceCatalogLayout = function getResourceCatalogLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.catalog.catalog',
				['code', 'descriptioninfo', 'currencyfk', 'catalogtypefk', 'baseyear']);

			res.overloads = self.getOverloads(['currencyfk', 'catalogtypefk']);

			return res;
		};

		this.getResourceCatalogRecordServiceInfos = function getResourceCatalogRecordServiceInfos() {
			return {
				standardConfigurationService: 'resourceCatalogRecordLayoutService',
				dataServiceName: 'resourceCatalogRecordDataService',
				validationServiceName: 'resourceCatalogRecordValidationService'
			};
		};

		this.getResourceCatalogRecordLayout = function getResourceCatalogRecordLayout() {
			var res = platformLayoutHelperService.getFiveGroupsBaseLayout('1.0.0', 'resource.catalog.record',
				['code', 'description', 'specification', 'equipment', 'consumable', 'with', 'without'], {
					gid: 'characteristics',
					attributes: ['characteristic1','uom1fk','characteristicvalue1', 'characteristic2','uom2fk','characteristicvalue2','characteristiccontent1','charactervaluetype1fk','characteristiccontent2','charactervaluetype2fk','catalogcodecontentfk']
				}, {
					gid: 'measures',
					attributes: ['measurea','uomafk','measurevaluea', 'measureb','uombfk','measurevalueb', 'measurec','uomcfk','measurevaluec',
						'measured','uomdfk','measurevalued', 'measuree','uomefk','measurevaluee']
				}, {
					gid: 'configuration',
					attributes: ['weight','machinelive','operationmonthsfrom','operationmonthsto','monthlyrepair','flag','valuenew',
						'weightpercent','reinstallment','reinstallmentpercent','monthlyrepairvalue','producerpriceindex']
				}, {
					gid: 'depreciationinterest',
					attributes: ['monthlyfactordepreciationinterestfrom','monthlyfactordepreciationinterestto','monthlyfactordepreciationinterestvaluefrom',
						'monthlyfactordepreciationinterestvalueto']
				});

			res.overloads = self.getOverloads(['uom1fk','uom2fk','uomafk','uombfk','uomcfk','uomdfk','uomefk','charactervaluetype1fk','charactervaluetype2fk','catalogcodecontentfk']);

			return res;
		};

		this.getPriceIndexServiceInfos = function getPriceIndexServiceInfos() {
			return {
				standardConfigurationService: 'resourceCatalogPriceIndexLayoutService',
				dataServiceName: 'resourceCatalogPriceIndexDataService',
				validationServiceName: 'resourceCatalogPriceIndexValidationService'
			};
		};

		this.getPriceIndexLayout = function getPriceIndexLayout() {
			return platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.catalog.priceindex',
				['indexyear', 'priceindex', 'comment']);
		};

		this.getOverloads = function getOverloads(columns2Overload) {
			var columnOverloads = {};
			if (columns2Overload) {
				_.forEach(columns2Overload, function (col) {
					var ol = self.getOverload(col);
					if (ol) {
						columnOverloads[col] = ol;
					}
				});
			}

			return columnOverloads;
		};

		this.getOverload = function getOverloads(column2Overload) {
			var columnOverload = null;

			switch (column2Overload) {
				case 'currencyfk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideCurrencyLookupSpecification()); break;
				case 'uom1fk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uom2fk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uomafk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uombfk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uomcfk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uomdfk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'uomefk':
					columnOverload = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()); break;
				case 'catalogtypefk':
					columnOverload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantcatalogtype'); break;
				case 'charactervaluetype1fk':
					columnOverload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentcharactervaluetype'); break;
				case 'charactervaluetype2fk':
					columnOverload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentcharactervaluetype'); break;
				case 'catalogcodecontentfk':
					columnOverload = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.equipmentcatalogcodecontent'); break;
			}

			return columnOverload;
		};
	}

})(angular);