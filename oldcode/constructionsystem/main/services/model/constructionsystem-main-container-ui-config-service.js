(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainContainerUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main container grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainContainerUIConfigService', [
		'platformUIConfigInitService', 'constructionsystemMainTranslationService', 'basicsLookupdataConfigGenerator', 'constructionSystemMainInstanceService',
		function (platformUIConfigInitService, translateService, basicsLookupdataConfigGenerator, constructionSystemMainInstanceService) {

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				dtoSchemeId: {typeName: 'ContainerDto', moduleSubModule: 'Model.Main'},
				layout: geDetailLayout(),
				translator: translateService
			});
			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}

			function geDetailLayout() {
				return {
					fid: 'constructionsystem.main.modelcontainer.detail',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['containerfk', 'modelfk', 'description', 'iscomposit']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						containerfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelMainContainerLookupDataService',
							enableCache: true,
							filter: function (item) {
								return item.ModelFk;
							},
							readonly: true
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
						iscomposit: {readonly: true}
					}
				};
			}
		}
	]);
})(angular);