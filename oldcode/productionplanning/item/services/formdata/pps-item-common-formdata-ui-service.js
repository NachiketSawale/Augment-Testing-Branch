(function() {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemCommonFormDataUIService', UIService);

	UIService.$inject = ['basicsUserFormFormDataCommonColumns','platformSchemaService','platformUIStandardConfigService', 'productionplanningItemTranslationService', 'platformRuntimeDataService', 'platformDataValidationService'];

	function UIService(gridColumns, platformSchemaService,platformUIStandardConfigService,productionplanningItemTranslationService, platformRuntimeDataService, platformDataValidationService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'FormDataDto', moduleSubModule: 'Basics.UserForm'} );

		var detailConfigForValidation = {
			'fid': 'productionplanning.item.formdata',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['formfk']
				}
			],
			'overloads': {
				'formfk': {
					grid: {
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service-grid-less',
							lookupOptions: {
								dataServiceName: 'basicsUserFormLookupService',
								lookupModuleQualifier: 'basicsUserFormLookupService',
								lookupType: 'basicsUserFormLookupService',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated',
								filterKey: 'user-form-rubric-filter'   // remove outdated forms
							}
						}
					}
				}
			}
		};

		var ui = new BaseService(detailConfigForValidation, domainSchema.properties, productionplanningItemTranslationService);

		var columns = _.clone(gridColumns.getStandardConfigForListView().columns);

		columns.splice(0, 0, {
			id: 'belonging',
			field: 'Belonging',
			name: '*Belonging',
			name$tr$: 'productionplanning.item.formData.belonging',
			readonly: true,
			formatter: 'image',
			formatterOptions: {
				imageSelector: 'ppsItemCommonFormDataIconService',
				tooltip: true
			}
		});

		ui.getStandardConfigForListView().columns = columns;

		return ui;
	}
})();