/**
 * Created by Frank Baedeker on 25.08.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name projectMainChangeDataService
	 * @function
	 *
	 * @description
	 * projectMainChangeDataService is the data service for all cost group 1 related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	projectMainModule.factory('projectMainCurrencyRateDataService', ['$http', '$q', '$log', 'projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function ($http, $q, $log, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var changeServiceInfo = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainCurrencyRateDataService',
					entityNameTranslationID: 'cloud.common.entityCurrency',
					httpCreate: { route: globals.webApiBaseUrl + 'project/main/currencyrate/' },
					httpRead: { route: globals.webApiBaseUrl + 'project/main/currencyrate/', endRead:'listbyproject'},
					presenter: { list: { initCreationData: function initCreationData(creationData) {
						var project = projectMainService.getSelected();
						creationData.Id = project.Id;
						delete creationData.MainItemId;
					}}},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'CurrencyRateDto',
						moduleSubModule: 'Project.Main'
					})],
					entityRole: { leaf: { itemName: 'CurrencyRates', parentService: projectMainService, parentFilter: 'projectId'} }
				}
			};

			var container = platformDataServiceFactory.createNewComplete(changeServiceInfo);

			container.data.onConversionSelectionChanged = function() {
				container.data.loadSubItemList();
			};

			container.service.createCurrencyRate = function CurrencyRate(){
				return container.service.createItem();
			};

			return container.service;

		}]);
})(angular);
