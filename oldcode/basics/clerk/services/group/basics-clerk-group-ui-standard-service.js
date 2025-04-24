/**
 * Created by leo on 11.11.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkGroupUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of clerkGroup entities
	 */
	angular.module(moduleName).factory('basicsClerkGroupUIStandardService', ['platformUIStandardConfigService', 'basicsClerkTranslationService', 'platformSchemaService', 'platformUIStandardExtentService', 'platformObjectHelper',

		function (platformUIStandardConfigService, basicsClerkTranslationService, platformSchemaService, platformUIStandardExtentService, platformObjectHelper) {

			function createMainDetailLayout() {
				return {
					fid: 'basics.clerk.groupdetailform',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [ 'clerkgroupfk', 'department']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						clerkgroupfk: {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog-without-teams',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'basics-clerk-only-group-filter'
									}
								},
								requiredInErrorHandling: true
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'cloud-clerk-clerk-dialog-without-teams',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'basics-clerk-only-group-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Code'
								}
							}
						}
					}
				};
			}
			var clerkGroupDetailLayout = createMainDetailLayout();

			function extendClerkDisplayConfig() {
				return {
					'addition': {
						'grid': platformObjectHelper.extendGrouping([
							{
								'afterId': 'clerkgroupfk',
								'id': 'GroupDescription_description',
								'field': 'ClerkGroupFk',
								'name': 'Group Description',
								'name$tr$': 'basics.clerk.groupdesc',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'clerk',
									displayMember: 'Description'
								},
								width: 140
							}
						])
					}
				};
			}



			var BaseService = platformUIStandardConfigService;

			var basicsClerkGroupAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ClerkGroupDto', moduleSubModule: 'Basics.Clerk'} );
			basicsClerkGroupAttributeDomains = basicsClerkGroupAttributeDomains.properties;

			function ClerkGroupUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ClerkGroupUIStandardService.prototype = Object.create(BaseService.prototype);
			ClerkGroupUIStandardService.prototype.constructor = ClerkGroupUIStandardService;

			var service = new BaseService(clerkGroupDetailLayout, basicsClerkGroupAttributeDomains, basicsClerkTranslationService);
			platformUIStandardExtentService.extend(service, extendClerkDisplayConfig().addition, basicsClerkGroupAttributeDomains);

			return service;
		}
	]);
})();
