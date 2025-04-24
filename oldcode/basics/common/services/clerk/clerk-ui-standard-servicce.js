(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonClerkUIStandardServiceFactory', ['platformUIStandardConfigService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsCommonClerkTranslateService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, platformSchemaService, basicsLookupdataConfigGenerator, basicsCommonClerkTranslateService, platformUIStandardExtentService) {

			const service = {}, instanceCache = {};

			service.getService = function (qualifier, parentService) {
				if (instanceCache[qualifier]) {
					return instanceCache[qualifier];
				} else {

					const layoutDetail = createLayoutDetail(qualifier, parentService);
					const instance = createInstance(layoutDetail);

					instanceCache[qualifier] = instance;
					return instance;
				}
			};

			function createLayoutDetail(qualifier, parentService) {
				const filterKey = qualifier + '.filter';
				const layoutDetail = {
					'fid': qualifier,
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['clerkrolefk', 'clerkfk', 'validfrom', 'validto', 'commenttext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'overloads': {
						clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCustomClerkRoleLookupDataService',
							enableCache: true,
							showClearButton: false,
							filterKey: qualifier + '-role-filter'
						}, {
							required: true
						}),
						'clerkfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: filterKey
									}
								}
							},
							'grid': {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'cloud-clerk-clerk-dialog',
									lookupOptions: {
										filterKey: filterKey,
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

				if (parentService.getClerkContextFkUIConfig && angular.isFunction(parentService.getClerkContextFkUIConfig)) {
					layoutDetail.groups[0].attributes.unshift('contextfk');
					const confg = parentService.getClerkContextFkUIConfig();
					layoutDetail.translationInfos = confg.translationInfos;
					layoutDetail.overloads['contextfk'] = confg.overloads;

					if (confg.attributes) {
						if (confg.attributes.hasValidFrom === false) {
							remove(layoutDetail.groups[0].attributes, 'validfrom');
						}
						if (confg.attributes.hasValidTo === false) {
							remove(layoutDetail.groups[0].attributes, 'validto');
						}
					}
				}

				if (parentService.adjustClerkLayout && angular.isFunction(parentService.adjustClerkLayout)) {
					parentService.adjustClerkLayout(layoutDetail);
				}

				return layoutDetail;
			}

			function remove(arr, val) {
				const index = arr.indexOf(val);
				if (index !== -1) {
					arr.splice(index, 1);
				}
			}

			function createInstance(layoutDetail) {
				let domainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'ClerkDataDto', moduleSubModule: 'Basics.Common'}
				);
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				const translateService = basicsCommonClerkTranslateService.getService({translationInfos: layoutDetail.translationInfos});

				const instance = new platformUIStandardConfigService(layoutDetail, domainSchema, translateService);
				if (layoutDetail.addition !== undefined && layoutDetail.addition !== null) {
					platformUIStandardExtentService.extend(instance, layoutDetail.addition, domainSchema);
				}
				return instance;
			}

			return service;

		}]);

})(angular);