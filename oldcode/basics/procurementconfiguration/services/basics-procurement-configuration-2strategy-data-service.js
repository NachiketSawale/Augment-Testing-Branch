/**
 * Created by wuj on 9/2/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName)
		.factory('basicsProcurementConfiguration2StrategyDataService',
			['platformDataServiceFactory', 'basicsProcurementConfigHeaderDataService',
				function (dataServiceFactory, parentService) {

					var serviceOptions = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCRUD: {
								route: globals.webApiBaseUrl + 'basics/procurementconfiguration/configuration2strategy/'
							},
							entityRole: {
								leaf: {
									itemName: 'PrcConfiguration2Strategy',
									parentService: parentService
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
					var service = serviceContainer.service;
					var onEntityCreated = function onEntityCreated(e, newItem) {
						var defaultItem = _.find(service.getList(), {
							PrcStrategyFk: newItem.PrcStrategyFk,
							PrcCommunicationChannelFk: newItem.PrcCommunicationChannelFk
						});
						if (defaultItem.Id !== newItem.Id) {
							newItem.PrcCommunicationChannelFk = null;
						}
					};

					service.registerEntityCreated(onEntityCreated);

					return service;
				}]);
})(angular);