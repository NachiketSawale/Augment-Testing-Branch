(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstance2ObjectUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main instance2object grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainInstance2ObjectUIConfigService', [
		'platformUIConfigInitService', 'constructionsystemMainTranslationService', 'basicsLookupdataConfigGenerator',
		'constructionSystemMainInstanceService', 'platformUIStandardExtentService',
		function (platformUIConfigInitService, translateService, basicsLookupdataConfigGenerator,
			constructionSystemMainInstanceService, platformUIStandardExtentService) {

			var layout = geDetailLayout();

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				layout: layout,
				dtoSchemeId: {typeName: 'Instance2ObjectDto', moduleSubModule: 'ConstructionSystem.Main'},
				translator: translateService
			});

			platformUIStandardExtentService.extend(this, layout.addition);

			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}

			function geDetailLayout() {
				return {
					fid: 'constructionsystem.main.instance2object.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['modelfk', 'objectfk', 'objectsetfk', 'meshid', 'cpiid','cadidint', 'isnegative', 'iscomposite', 'isparameterchanged', 'isoldmodel']
						},
						{
							'gid': 'referenceGroup',
							'attributes': ['controllingunitfk']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						// ToDo(roberson): object has complex key -->currently, lookupDescriptorService doesn't support complex primary key.
						// this binding way: can show object's description, but maybe wrong data
						modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelProjectModelTreeLookupDataService',
							enableCache: true,
							filter: function () {
								return getProjectId() + '&includeComposite=true';
							},
							readonly: true
						}),
						objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelMainObjectLookupDataService',
							enableCache: true,
							filter: function (item) {
								return item.ModelFk;
							},
							readonly: true
						}),
						objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelMainObjectSetLookupDataService',
							enableCache: true,
							filter: function () {
								return getProjectId();
							},
							readonly: true
						}),
						meshid: {readonly: true},
						cadidint: {readonly: true},
						cpiid: {readonly: true},
						isnegative: {readonly: true},
						iscomposite: {readonly: true},
						isparameterchanged: {readonly: true},
						isoldmodel: {readonly: true},
						controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingStructureUnitLookupDataService',
							filter: function () {
								return getProjectId();
							},
							readonly: true
						})
					}
				};
			}
		}
	]);
})(angular);
