/**
 * Created by lcn on 1/03/2024.
 */
(function () {
	'use strict';
	var moduleName = 'project.stock';

	angular.module(moduleName).factory('ProjectStock2ClerkLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			fid: 'project.stock.clerk',
			version: '1.0.1',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{
				gid: 'basicData',
				attributes: ['validto', 'validfrom', 'comment', 'basclerkfk', 'basclerkrolefk']
			}, {
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
				},
				basclerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					enableCache: true,
					filterKey: 'project-clerk-role-by-is-for-stock-filter'
				})
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

	angular.module(moduleName).factory('ProjectStock2ClerkUIStandardService',
		['ProjectStock2ClerkLayout', 'platformUIStandardConfigService', 'platformSchemaService',
			'projectStockTranslationService', 'platformUIStandardExtentService',
			function (layout, platformUIStandardConfigService, platformSchemaService, translationService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ProjectStock2ClerkDto',
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