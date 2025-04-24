/**
 * Created by lav on 7/11/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.header';

	/**
	 * @ngdoc service
	 * @name productionplanningHeaderContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('productionplanningHeaderContainerInformationService', ContainerInformationService);

	ContainerInformationService.$inject = ['$injector', 'ppsEngineeringCadImportConfigDataService', 'ppsEngineeringCadValidationDataService'];

	function ContainerInformationService($injector, ppsEngineeringCadImportConfigDataService, ppsEngineeringCadValidationDataService) {

		var service = {};

		function getPpsUpstreamService() {
			return $injector.get('ppsUpstreamItemDataService').getService({
				serviceKey: 'productionplanning.header.ppsitem.upstreamitem',
				endRead: 'listbyppsheader',
				mainItemColumn: 'Id',
				ppsItemColumn: 'NotExistingColumnName',//no ppsitem
				ppsHeaderColumn: 'Id',
				parentFilter: 'headerFk',
				parentService: 'productionplanningHeaderDataService'
			});
		}
		service.getPpsUpstreamService = getPpsUpstreamService; // expose method `getPpsUpstreamService`, it will be referenced in productionplanningHeaderListController for HP-ALM #130264 by zwz on 2022/4/29

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null, dataServ = null, listLayout = null, lookupOpts = null;
			const mainService = $injector.get('productionplanningHeaderDataService');
			var bizPartnerService = $injector.get('ppsCommonBizPartnerServiceFactory').getService({
				serviceKey: 'productionplanning.header.bizpartner',
				parentService: mainService,
				projectFk: 'PrjProjectFk',
				ppsHeaderFk: 'Id'
			});
			var bizPartnerVilidationService = $injector.get('ppsCommonBizPartnerValidationServiceFactory').getService(bizPartnerService);
			var bizPartnerContactService = $injector.get('ppsCommonBizPartnerContactServiceFactory').getService({
				serviceKey: 'productionplanning.header.bizpartnercontact',
				parentService: bizPartnerService
			});
			var bizPartnerContactVilidationService = $injector.get('ppsCommonBizPartnerContactValidationServiceFactory').getService(bizPartnerContactService);
			switch (guid) {
				case '55d65f45ca8d446a9cf706a0015e8b55':
					config = $injector.get('procurementPackageUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'procurementPackageUIStandardService';
					config.dataServiceName = 'ppsPrcPackageDataService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '23edab99edgb492d84r29947e734fh99':
					dataServ = getPpsUpstreamService();
					layServ = $injector.get('ppsUpstreamItemUIStandardService').getService(dataServ);
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = layServ;
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsUpstreamItemValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '7fff4a90a51841a899e98aca1bf5c04c': // split upstream item
					dataServ = getPpsSplitUpstreamService();
					layServ = $injector.get('ppsUpstreamItemUIStandardService').getService(dataServ);
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = layServ;
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsUpstreamItemValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '8ad87c147d1040d4956966a37c7e749c': // ppsCommonBizPartnerController
					layServ = $injector.get('ppsCommonBizPartnerUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					config.layout = listLayout;
					lookupOpts = _.find(listLayout.columns, {id: 'businesspartnerfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerCreateOptions'));
					lookupOpts.createOptions.creationData = function () {};
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCommonBizPartnerUIStandardService';
					config.dataServiceName = bizPartnerService;
					config.validationServiceName = bizPartnerVilidationService;
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case  'ebe6aee8a1264b159d19d312ed087d0a': // ppsCommonBizPartnerContactController
					layServ = $injector.get('ppsCommonBizPartnerContactUIStandardService');
					listLayout = layServ.getStandardConfigForListView();
					lookupOpts = _.find(listLayout.columns, {id: 'contactfk'}).editorOptions.lookupOptions;
					lookupOpts.showDetailButton = true;
					lookupOpts.detailOptions = $injector.get('businessPartnerContactDetailOptions');
					lookupOpts.showAddButton = true;
					lookupOpts.createOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));
					lookupOpts.createOptions.creationData = function () {
						var selectedItem = bizPartnerContactService.getSelected();
						if (selectedItem) {
							return {mainItemId: selectedItem.BusinessPartnerFk};
						}
					};
					config.layout = listLayout;
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCommonBizPartnerContactUIStandardService';
					config.dataServiceName = bizPartnerContactService;
					config.validationServiceName = bizPartnerContactVilidationService;
					config.listConfig = { initCalled: false, columns: [] };
					break;
			}

			function getPpsSplitUpstreamService() {
				return $injector.get('ppsUpstreamItemDataService').getService({
					serviceKey: 'productionplanning.header.ppsitem.splitupstreamitem',
					parentService: getPpsUpstreamService(),
					mainItemColumn: 'Id',
					ppsItemColumn: 'PPSItemFk',
					endRead: 'listsplitupstreamitems',
					canCreate: false,
					canDelete: false
				});
			}

			return config;
		};
		return service;
	}
})(angular);