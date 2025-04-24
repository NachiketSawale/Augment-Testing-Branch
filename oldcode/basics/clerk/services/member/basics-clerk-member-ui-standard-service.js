(function () {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkMemberUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of clerkMember entities
	 */
	angular.module(moduleName).factory('basicsClerkMemberUIStandardService', ['platformUIStandardConfigService', 'basicsClerkTranslationService', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsClerkTranslationService, platformSchemaService) {

			function createClerkMemberLayout() {
				return {
					'fid': 'basics.clerk.memberdetailform',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'baseGroup',
							'attributes': ['clerkfk', 'firstname']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						clerkfk: {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										showClearButton: true
									}
								},
								requiredInErrorHandling: true
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Clerk',
									displayMember: 'Code'
								}
							}
						}
					}
				};
			}
			var clerkMemberLayout = createClerkMemberLayout();

			var BaseService = platformUIStandardConfigService;

			var basicsClerkMemberAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ClerkGroupDto', moduleSubModule: 'Basics.Clerk'} );
			basicsClerkMemberAttributeDomains = basicsClerkMemberAttributeDomains.properties;

			function ClerkMemberUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ClerkMemberUIStandardService.prototype = Object.create(BaseService.prototype);
			ClerkMemberUIStandardService.prototype.constructor = ClerkMemberUIStandardService;

			return new BaseService(clerkMemberLayout, basicsClerkMemberAttributeDomains, basicsClerkTranslationService);
		}
	]);
})();