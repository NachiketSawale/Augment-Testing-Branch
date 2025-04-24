/**
 * Created by lvy on 4/13/2018.
 */
(function (angular) {

	'use strict';
	var modulename = 'constructionsystem.master';

	angular.module(modulename).factory('constructionSystemMasterGlobalParameterReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor', 'parameterDataTypes',
			function (commonReadOnlyProcessor, parameterDataTypes) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'CosGlobalParamDto',
					moduleSubModule: 'ConstructionSystem.Master',
					readOnlyFields: ['IsLookup']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				/* jshint -W074 */
				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'IsLookup':
							if (item.CosParameterTypeFk === parameterDataTypes.Boolean) {
								item.IsLookup = false;
								return false;
							}
							else {
								return true;
							}
						default :
							return true;
					}
				};


				return service;
			}]);

})(angular);