(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonApprovalUIStandardServiceFactory', ['platformUIStandardConfigService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsCommonApprovalTranslateService', 'platformUIStandardExtentService',
		'platformLayoutHelperService',
		function (platformUIStandardConfigService, platformSchemaService, basicsLookupdataConfigGenerator, basicsCommonApprovalTranslateService, platformUIStandardExtentService,platformLayoutHelperService) {

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

			function createLayoutDetail() {
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'basics.common.headerapproval',
					['isapproved', 'comment', 'clerkfk', 'clerkrolefk', 'duedate', 'evaluatedon', 'evaluationlevel']);

				res.overloads = {
					clerkfk: platformLayoutHelperService.provideClerkLookupOverload(),
					clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomClerkRoleLookupDataService',
						enableCache: true
					})
				};

				return res;
			}



			function createInstance(layoutDetail) {
				let domainSchema = platformSchemaService.getSchemaFromCache(
					{typeName: 'ApprovalDataDto', moduleSubModule: 'Basics.Common'}
				);
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				const translateService = basicsCommonApprovalTranslateService.getService({translationInfos: layoutDetail.translationInfos});

				const instance = new platformUIStandardConfigService(layoutDetail, domainSchema, translateService);
				if (layoutDetail.addition !== undefined && layoutDetail.addition !== null) {
					platformUIStandardExtentService.extend(instance, layoutDetail.addition, domainSchema);
				}
				return instance;
			}

			return service;

		}]);

})(angular);