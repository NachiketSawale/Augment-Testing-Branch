(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemProductTemplateParameterService', ProductTemplateParameterService);

	ProductTemplateParameterService.$inject = ['$injector', 'productionplanningItemDataService'];

	function ProductTemplateParameterService($injector, itemDataService) {
		var service = $injector.get('ppsProducttemplateParamDataServiceFactory').getService({
			parentService: itemDataService,
			parentServiceName: itemDataService.getServiceName(),
			route: 'productionplanning/producttemplate/productdescparam/',
			endRead: 'listbyparent',
			parentField: 'ProductDescriptionFk'
		});

		service.canCreate = function () {
			var selectedItem = itemDataService.getSelected();
			return !_.isNil(selectedItem) && !_.isNil(selectedItem.ProductDescriptionFk);
		};

		return service;
	}
})(angular);