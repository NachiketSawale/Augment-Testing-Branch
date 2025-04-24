/**
 * Created by lcn on 9/20/2021.
 */
(function () {
	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).factory('projectStockDownTimeLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			fid: 'project.stock.downtime',
			version: '1.0.1',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{gid: 'basicData', attributes: ['startdate', 'enddate', 'description', 'basclerkfk']}, {
				gid: 'entityHistory', isHistory: true
			}],
			overloads: {
				basclerkfk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'cloud-clerk-clerk-dialog',
							lookupOptions: {
								showClearButton: true
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Code'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						model: 'BasClerkFk',
						options: {
							lookupDirective: 'cloud-clerk-clerk-dialog',
							descriptionMember: 'Description',
							lookupOptions: {
								showClearButton: true
							}
						}
					}
				}
			},
			addition: {
				grid: [
					{
						afterId: 'basclerkfk',
						id: 'clerkDescription',
						field: 'BasClerkFk',
						name: 'Clerk Description',
						name$tr$: 'cloud.common.entityClerkDescription',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'clerk',
							displayMember: 'Description'
						},
						width: 250
					}
				]
			}
		};
	}]);

	angular.module(moduleName).factory('projectStockDownTimeUIStandardService',
		['projectStockDownTimeLayout', 'platformUIStandardConfigService', 'platformSchemaService',
			'projectStockTranslationService', 'platformUIStandardExtentService',
			function (layout, platformUIStandardConfigService, platformSchemaService, translationService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ProjectStockDownTimeDto',
						moduleSubModule: 'Project.Stock'
					});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new UIStandardService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}]);
})();