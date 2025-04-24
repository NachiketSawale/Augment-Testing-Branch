/**
 * Created by lvy on 11/22/2019.
 */
(function (angular) {

	'use strict';
	var modulename = 'constructionsystem.master';

	angular.module(modulename).factory('cosMasterObjectTemplatePropertyReadOnlyProcessor',
		['basicsCommonReadOnlyProcessor',
			function (commonReadOnlyProcessor) {

				var service = commonReadOnlyProcessor.createReadOnlyProcessor({
					typeName: 'CosObjectTemplatePropertyDto',
					moduleSubModule: 'ConstructionSystem.Master',
					readOnlyFields: ['MdlPropertyKeyFk']
				});

				service.handlerItemReadOnlyStatus = function (item) {
					service.setFieldsReadOnly(item);
				};

				/* jshint -W074 */
				service.getCellEditable = function getCellEditable(item, model) {
					switch (model) {
						case 'MdlPropertyKeyFk':
							if (item && item.Version === 0) {
								return true;
							}
							else {
								return false;
							}
						default :
							return true;
					}
				};


				return service;
			}]);

})(angular);