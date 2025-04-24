/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.producttemplate';
	var engtaskModule = angular.module(moduleName);

	engtaskModule.factory('productionplanningProducttemplateProductDescriptionUICreateService', UICreateService);
	UICreateService.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'productionplanningProducttemplateTranslationService',
		'$injector'];

	function UICreateService(platformSchemaService,
							   platformUIStandardConfigService,
							   translationServ,
							   $injector) {

		var layoutConfig =
			{
				'fid': 'productionplanning.producttemplate.productDescriptionLayout',
				'version': '1.0.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [{
					gid: 'baseGroup',
					attributes: ['engdrawingfk', 'mdcproductdescriptionfk', 'code']
				}],
				'overloads': {
					engdrawingfk: {
						required: true,
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'productionplanning-drawing-dialog-lookup',
								displayMember: 'Code',
								lookupOptions: {
									showClearButton: true,
									showAddButton: true,
									createOptions: $injector.get('ppsItemDrawingCreateOption'),
									defaultFilter: {projectId: 'ProjectFk', drawingTypeId: 'DrawingTypeFk'}
								}
							}
						}
					},
					mdcproductdescriptionfk:{
						required:true,
						detail: {
							type: 'directive',
							directive: 'material-product-description-lookup',
							options: {
								lookupDirective: 'material-product-description-lookup',
								displayMember: 'Code',
								filterKey: 'pps-mdc-productdesc-by-material-filter',
								lookupOptions: {
									filterKey: 'pps-mdc-productdesc-by-material-filter'
								}
							}
						}
					}
				}
			};

		var BaseService = platformUIStandardConfigService;

		var ruleSetAttributeDomains = platformSchemaService.getSchemaFromCache({
			typeName: 'ProductDescriptionDto',
			moduleSubModule: 'ProductionPlanning.ProductTemplate'
		});
		ruleSetAttributeDomains = ruleSetAttributeDomains.properties;
		return new BaseService(layoutConfig, ruleSetAttributeDomains, translationServ);
	}
})(angular);
