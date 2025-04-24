/**
 * Created by wuj on 8/21/2015.
 */

(function (angular) {
	'use strict';

	/* jshint -W072 */
	angular.module('procurement.package').factory('procurementPackageEventReadonlyProcessor',
		['basicsCommonReadOnlyProcessor', 'procurementContextService',
			function (commonReadOnlyProcessor, moduleContext) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'PrcPackageEventDto',
					moduleSubModule: 'Procurement.Package',
					readOnlyFields: ['StartOverwrite']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					var readOnyStatus = moduleContext.isReadOnly;
					service.setRowReadOnly(item, readOnyStatus);
					return readOnyStatus;
				};

				service.getCellEditable = function (item, model) {
					var editable = true;
					if (angular.isDefined(item)) {

						// check filed editable
						if (model === 'StartOverwrite') {
							if(item && !item.PrcEventTypeDto.HasStartDate){
								editable = false;
							}
						}
					}
					return editable;
				};

				return service;
			}]);
})(angular);
