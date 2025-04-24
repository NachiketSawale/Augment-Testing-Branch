(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'basics.customize';

	angular.module(moduleName, ['ui.router', 'cloud.common', 'platform', 'basics.config']);
	globals.modules.push(moduleName);

	/*
	 ** Activity states are defined in this config block.
	 */
	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				const options = {
					moduleName: moduleName,
					resolve: {
						loadDomains: ['platformSchemaService', 'basicsCustomizeTypeDataService', function (platformSchemaService, basicsCustomizeTypeDataService) {
							platformSchemaService.initialize();

							return basicsCustomizeTypeDataService.load().then(function () {
								let schemes = basicsCustomizeTypeDataService.getDtoSchemes();
								schemes.push({typeName: 'EntityClassDescriptionDTO', moduleSubModule: 'Basics.Customize'});
								schemes.push({typeName: 'EntityClassPropertyDescriptionDTO', moduleSubModule: 'Basics.Customize'});
								return platformSchemaService.getSchemas(schemes);
							});
						}],

						loadCustomizeStatusTransitionConfiguration: ['basicsCustomizeStatusTransitionConfigurationService',
							function loadCustomizeStatusTransitionConfiguration(basicsCustomizeStatusTransitionConfigurationService) {
								return basicsCustomizeStatusTransitionConfigurationService.assertTransitionDataIsLoaded();
							}
						],

						loadCustomizeStringColumnConfig: ['basicsCustomizeStringColumnConfigDataService',
							function loadCustomizeStringColumnConfig(basicsCustomizeStringColumnConfigDataService) {
								return basicsCustomizeStringColumnConfigDataService.load();
							}
						],

						loadVisibilityValuesTranslation: ['platformTranslateService', 'basicsConfigVisibilityValues', function (platformTranslateService, basicsConfigVisibilityValues) {
							return platformTranslateService.reloadCustomTranslation('basics.config').then(function () {
								platformTranslateService.translateObject(basicsConfigVisibilityValues, ['description']);
								return true;
							});
						}],

						loadCustomizeLookupConfigurations: ['basicsCustomizeLookupConfigurationService', function (basicsCustomizeLookupConfigurationService) {
							return basicsCustomizeLookupConfigurationService.loadLookupConfigurations();
						}],

						loadTranslation: ['platformTranslationUtilitiesService', function (platformTranslationUtilitiesService) {
							return platformTranslationUtilitiesService.loadTranslationsOfMainModules(['basics', 'usermanagement']);
						}],

						loadPermission: ['platformPermissionService', (platformPermissionService) => {
							const permissions = [
								'd48149582a0a4031b07295f9853ac427'  // Email server management
							];
							return platformPermissionService.loadPermissions(permissions);
						}],

						loadLookup: ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
							return basicsLookupdataLookupDefinitionService.load([
								'basicsCustomizeValueTypeCombobox']);
						}]
					}
				};

				mainViewServiceProvider.registerModule(options);
			}
		])
		.run(['$injector', 'platformModuleNavigationService', 'platformGridAPI', '_', function ($injector, platformModuleNavigationService, platformGridApi, _){
			let findItemByLabelCode = function (items, item) {
				return [_.find(items, {Id: item.labelCode})];
			};

			let performPostNavigation = function (typeIdentifier, findItemsFunc, item) {
				let typesGridId = 'f5e884c670df4f938e51787e7cc40bf7';
				let recordsGridId = '3a51bf834b8649069172d23ec1ba35e2';
				let typesService = $injector.get('basicsCustomizeTypeDataService');
				let dataItemsService = $injector.get('basicsCustomizeInstanceDataService');

				let filterDataItems = function (items){
					if(platformGridApi.grids.exist(recordsGridId)){
						platformGridApi.filters.showSearch(recordsGridId, false, true);
						let dataItems = findItemsFunc ? findItemsFunc(items, item) : items;
						platformGridApi.items.data(recordsGridId, dataItems);
					}
					dataItemsService.unregisterListLoaded(filterDataItems);
				};

				let filterTypeItems = function (types){
					let userLabelType = _.find(types, {Identifier: typeIdentifier});
					if(platformGridApi.grids.exist(typesGridId)){
						platformGridApi.filters.showSearch(typesGridId, false, true);
						platformGridApi.items.data(typesGridId, [userLabelType]);

						setTimeout(()=>{
							platformGridApi.rows.selection({gridId: typesGridId, rows: [userLabelType]});
							if(platformGridApi.grids.exist(recordsGridId)){
								dataItemsService.registerListLoaded(filterDataItems);
								dataItemsService.read();
							}
						}, 200);

					}
					typesService.unregisterListLoaded(filterTypeItems);
				};

				typesService.registerListLoaded(filterTypeItems);
				typesService.read();
			};
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-userLabel',
					navFunc: function(item) {
						performPostNavigation('basics.customize.userlabel', findItemByLabelCode, item);
					}
				}
			);
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-userDirectory',
					navFunc: function(item) {
						performPostNavigation('basics.customize.frmuserdirectory', undefined, item);
					}
				}
			);
		}]);
})(angular);
