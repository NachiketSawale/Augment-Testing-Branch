/**
 * Created by Helmut Buck on 27.03.2018.
 */
(function () {
	'use strict';
	var moduleName = 'boq.wic';

	/**
	 * @ngdoc service
	 * @name boqWicGroupClerkConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in boq wic module
	 */
	angular.module(moduleName).factory('boqWicGroupClerkConfigurationService',

		['platformUIStandardConfigService', 'boqWicTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, boqWicTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function provideBoqWicGroupClerkLayout() {
					return {
						fid: 'boq.wic.clerk.detailform',
						version: '0.2.4',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'comment']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomClerkRoleLookupDataService',
								enableCache: true
							}),
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
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
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

				var boqWicGroupClerkDetailLayout = provideBoqWicGroupClerkLayout();

				var boqWicGroupClerkAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'WicGroup2ClerkDto', moduleSubModule: 'Boq.Wic'});
				if (boqWicGroupClerkAttributeDomains) {
					boqWicGroupClerkAttributeDomains = boqWicGroupClerkAttributeDomains.properties;
				}

				function ClerkUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ClerkUIStandardService.prototype = Object.create(BaseService.prototype);
				ClerkUIStandardService.prototype.constructor = ClerkUIStandardService;

				return new BaseService(boqWicGroupClerkDetailLayout, boqWicGroupClerkAttributeDomains, boqWicTranslationService);
			}
		]);
})();
