/**
 * Created by wuj on 8/21/2015.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('procurement.package').factory('procurementRequisitionVariantReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService',
			function (commonReadOnlyProcessor, moduleContext) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'ReqVariantDto',
					moduleSubModule: 'Procurement.Requisition'
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = moduleContext.isReadOnly;
					service.setRowReadOnly(item, readOnyStatus);
					return readOnyStatus;
				};

				return service;
			}]);
})(angular);
