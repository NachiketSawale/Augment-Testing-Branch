(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectPropertyUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main property grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainContainerPropertyUIConfigService', [
		'platformUIConfigInitService', 'constructionsystemMainTranslationService', 'basicsLookupdataConfigGenerator', 'constructionSystemMainInstanceService',
		function (platformUIConfigInitService, translateService, basicsLookupdataConfigGenerator, constructionSystemMainInstanceService) {

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				dtoSchemeId: {typeName: 'PropertyDto', moduleSubModule: 'Model.Main'},
				layout: geDetailLayout(),
				translator: translateService
			});
			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}
			function geDetailLayout() {
				return {
					fid: 'constructionsystem.main.containerproperty.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['modelfk', 'containerfk', 'uom']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelProjectModelLookupDataService',
							enableCache: true,
							filter: function () {
								return getProjectId();
							},
							readonly: true
						}),
						containerfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelMainContainerLookupDataService',
							enableCache: true,
							filter: function (item) {
								return item.ModelFk;
							},
							readonly: true
						}),
						// propertykeyfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						// dataServiceName: 'modelMainPropertyKeyLookupDataService',
						// enableCache: true,
						// filter: function (item) {
						//     return item.ModelFk;
						// },
						// readonly: true
						// }),
						// propertyvalue: {readonly: true},
						uom: {readonly: true}
					}
				};
			}
		}
	]);
})(angular);