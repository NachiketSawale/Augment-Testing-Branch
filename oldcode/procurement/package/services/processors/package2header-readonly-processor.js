/**
 * Created by wwa on 1/4/2016.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('procurement.package').factory('procurementPackage2HeaderReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService',
			function (commonReadOnlyProcessor, moduleContext) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcPackage2HeaderDto',
					moduleSubModule: 'Procurement.Package',
					uiStandardService: 'procurementPackagePackage2HeaderUIStandardService'
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = moduleContext.isReadOnly;
					service.setRowReadonlyFromLayout(item, readOnyStatus);
					return readOnyStatus;
				};

				return service;
			}]);
})(angular);