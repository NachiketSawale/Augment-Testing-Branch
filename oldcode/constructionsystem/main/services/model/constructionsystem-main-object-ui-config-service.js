(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main object grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainObjectUIConfigService', [
		'platformUIConfigInitService', 'constructionsystemMainTranslationService', 'basicsLookupdataConfigGenerator',
		'constructionSystemMainInstanceService',
		function (platformUIConfigInitService, translateService, basicsLookupdataConfigGenerator,
			constructionSystemMainInstanceService) {

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				dtoSchemeId: {typeName: 'ModelObjectDto', moduleSubModule: 'Model.Main'},
				layout: geDetailLayout(),
				translator: translateService
			});

			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}

			function geDetailLayout() {
				return {
					fid: 'constructionsystem.main.modelobject.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							'attributes': ['objectfk', 'modelfk', 'description', 'meshid', 'cpiid', 'cadidint', 'isnegative', 'iscomposite']
						},
						{
							gid: 'referenceGroup',
							'attributes': ['controllingunitfk']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						meshid: {
							readonly: true
						},
						isnegative: {
							readonly: true
						},
						iscomposite: {
							readonly: true
						},
						objectfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelMainObjectLookupDataService',
							enableCache: true,
							filter: function (item) {
								return item.ModelFk;
							},
							additionalColumns: true
						}),
						modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelProjectModelLookupDataService',
							enableCache: true,
							filter: function () {
								return getProjectId();
							},
							readonly: true
						}),
						description: {readonly: true},
						cpiid: {readonly: true},
						controllingunitfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'controllingStructureUnitLookupDataService',
							filter: function () {
								return getProjectId();
							},
							readonly: true
						}),
						locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'projectLocationLookupDataService',
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