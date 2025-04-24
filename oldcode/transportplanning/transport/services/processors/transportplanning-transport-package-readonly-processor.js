(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc service
	 * @name transportplanningTransportPackageReadOnlyProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningTransportPackageReadOnlyProcessor is the service to set fields readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningTransportPackageReadOnlyProcessor', processor);

	processor.$inject = [
		'$injector',
		'basicsCommonReadOnlyProcessor'
	];

	function processor($injector,
					   commonReadOnlyProcessor) {


		var service = commonReadOnlyProcessor.createReadOnlyProcessor({
			uiStandardService: 'transportplanningPackageUIStandardService'
		});

		service.processItem = function (item) {
			if (item && item.Version > 0) {
				var parentItem = $injector.get('transportplanningTransportMainService').getSelected();
				if (parentItem && parentItem.readonly) {//remark:field "readonly" of route entity is set in transportplanningTransportReadOnlyProcessor
					service.setRowReadonlyFromLayout(item, true);
				}

			}
		};

		return service;
	}
})(angular);
