(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name modelMainObjectConfigurationService
	 * @description provides validation methods for model object entities
	 */
	angular.module(moduleName).service('constructionsystemMainObjectHierarchicalConfigurationService', constructionsystemMainObjectConfigurationService);

	constructionsystemMainObjectConfigurationService.$inject = ['platformUIConfigInitService','modelMainTranslationService'];

	function constructionsystemMainObjectConfigurationService(platformUIConfigInitService,modelMainTranslationService) {

		var service = {};

		service.getModelObjectHierarchicalDetailLayout = function getModelObjectHierarchicalDetailLayout() {
			return {
				fid: 'model.main.getModelObjectHierarchicalDetailLayout',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['description', /* 'meshid', */ 'cpiid', 'iscomposite']
					}
				],
				overloads: {
					// meshid: {
					// readonly: true
					// },
					cpiid: {readonly: true},
					iscomposite: {readonly: true},
					description: {readonly: true}
				}
			};
		};

		platformUIConfigInitService.createUIConfigurationService({
			service: service,
			layout: service.getModelObjectHierarchicalDetailLayout(),
			dtoSchemeId: {typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
			translator: modelMainTranslationService
		});

		return service;
	}

})(angular);