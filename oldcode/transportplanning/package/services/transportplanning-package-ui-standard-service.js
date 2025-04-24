/**
 * Created by las on 7/10/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.factory('transportplanningPackageUIStandardService', PackageUIStandardService);
	PackageUIStandardService.$inject = ['_', 'platformTranslateService', 'platformUIStandardConfigService', 'platformSchemaService',
		'platformUIStandardExtentService', 'transportplanningPackageTranslationService',
		'transportplanningPackageDetailsLayout', 'transportplanningPackageMainLayoutConfig',
		'ppsCommonCustomColumnsServiceFactory'];

	function PackageUIStandardService(_, platformTranslateService, platformUIStandardConfigService, platformSchemaService,
	                                  platformUIStandardExtentService, PackageTranslationService,
	                                  PackageDetailsLayout, PackageMainLayoutConfig,
									  customColumnsServiceFactory) {

		var BaseService = platformUIStandardConfigService;

		var packageAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'TransportPackageDto',
			moduleSubModule: 'TransportPlanning.Package'
		});

		packageAttributeDomains = packageAttributeDomains.properties;
		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		_.merge(packageAttributeDomains, customColumnsService.attributes);

		function SetUIStandardService(layout, schema, translateService) {
			BaseService.call(this, layout, schema, translateService);
		}

		SetUIStandardService.prototype = Object.create(BaseService.prototype);
		SetUIStandardService.prototype.constructor = SetUIStandardService;

		var service = new BaseService(PackageDetailsLayout, packageAttributeDomains, PackageTranslationService);
		//set option 'showClearButton' to false for fields trswaypointsrcfk and trswaypointdstfk.(Don't show the clear button, for the requirement: once user has set value of fields trswaypointsrcfk/trswaypointdstfk, these two fields cannot be null)
		_.each(service.getStandardConfigForListView().columns, function (item) {
			if (item.id === 'trswaypointsrcfk' || item.id === 'trswaypointdstfk') {
				item.editorOptions.showClearButton = false;
				item.editorOptions.lookupOptions.showClearButton = false;
			}
		});
		_.each(service.getStandardConfigForDetailView().rows, function (item) {
			if (item.rid === 'trswaypointsrcfk' || item.rid === 'trswaypointdstfk') {
				item.options.showClearButton = false;
				item.options.lookupOptions.showClearButton = false;
			}
		});
		//remark:Setting option 'showClearButton' here, just because the lookup cfg option 'showClearButton' will be "override"(for optional and not-readonly field, option 'showClearButton' will be true) in function extendWithOverLoadForDetail() of platformUIStandardConfigService. (by zweig 2018/11/15)

		platformUIStandardExtentService.extend(service, PackageMainLayoutConfig.addition, packageAttributeDomains);
		// for addition deatil row translation
		platformTranslateService.translateFormConfig(service.getStandardConfigForDetailView());

		service.getProjectMainLayout = function () {
			return PackageDetailsLayout;
		};

		return service;
	}
})(angular);