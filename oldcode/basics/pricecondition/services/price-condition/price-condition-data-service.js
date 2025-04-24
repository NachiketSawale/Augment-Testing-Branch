(function (angular) {
	'use strict';

	var moduleName = 'basics.pricecondition';
	var priceConditionModule = angular.module(moduleName);
	priceConditionModule.factory('basicsPriceConditionDataService', ['platformDataServiceFactory',
		function (dataServiceFactory) {

			var serviceOptions = {
				flatRootItem: {
					module: priceConditionModule,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/pricecondition/'
					},
					entityRole: {
						root: {
							itemName: 'PriceCondition',
							moduleName: 'cloud.desktop.moduleDisplayNamePriceCondition',
							descField: 'DescriptionInfo.Translated'
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var dataRead = data.handleReadSucceeded(readData, data);
								service.goToFirst(data);

								return dataRead;
							}
						},
						isInitialSorted: true,
						sortOptions: {initialSortColumn: {field: 'Sorting', id: 'Sorting'}, isAsc: true}
					},
					entitySelection: {},
					translation: {
						uid: '15859B6BD33C4FA5A87BB075EEAC353F',
						title: 'basics.pricecondition.priceConditionGridTitle',
						columns: [
							{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'},
							{header: 'cloud.common.entityRemark', field: 'RemarkInfo'}
						],
						dtoScheme: { typeName: 'PriceConditionDto', moduleSubModule: 'Basics.PriceCondition' }
					}
				}
			};

			var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
			var service = serviceContainer.service;
			//override handleOnUpdateSucceeded to make isdefault as false.
			var handleOnUpdateSucceeded = serviceContainer.data.handleOnUpdateSucceeded;
			serviceContainer.data.handleOnUpdateSucceeded = function (updateData, response) {
				handleOnUpdateSucceeded.apply(serviceContainer.data, arguments);
				if (response.PriceCondition && response.PriceCondition.IsDefault) {
					serviceContainer.data.disableWatchSelected(serviceContainer.data);
					if (response.ReplacedDefault) {
						var defaultItem = _.find(service.getList(), {Id: response.ReplacedDefault.Id});
						if (defaultItem.Id === response.ReplacedDefault.Id) {
							defaultItem.IsDefault = response.ReplacedDefault.IsDefault;
							defaultItem.Version = response.ReplacedDefault.Version;
							serviceContainer.service.gridRefresh();
						}
					}
					serviceContainer.data.enableWatchSelected(service.getSelected(), serviceContainer.data);
				}
			};

			service.refresh();

			return service;
		}]);
})(angular);