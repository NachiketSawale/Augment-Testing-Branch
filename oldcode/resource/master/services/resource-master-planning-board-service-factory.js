(function (angular) {

	'use strict';
	var module = angular.module('resource.master');
	module.service('resourceMasterPlanningBoardServiceFactory', ['$injector', 'platformPlanningBoardServiceFactoryProviderService',
		'resourceMasterProcessor',
		function ($injector, platformPlanningBoardServiceFactoryProviderService, resourceMasterProcessor) {
			var self = this;

			this.createResourceComplete = function createResourceComplete(options) {

				var dateProcessor = platformPlanningBoardServiceFactoryProviderService.createDateProcessor('ResourceDto', 'Resource.Master');

				$injector.get('resourceMasterLookupService').getResourceMasterGroupTree().then(function () {
					$injector.get('resourceMasterGroupImageProcessor').setGroupIcons();
				});
				var kindImageProcessor = $injector.get('resourceMasterKindImageProcessor');
				kindImageProcessor.initKindIcons();

				var factoryOptions = platformPlanningBoardServiceFactoryProviderService.createSupplierCompleteOptions({
					baseSettings: options,
					module: module,
					translationId: 'resource.master.entityResource',
					http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
						routePostFix: 'resource/master/resource/',
						endRead: 'getForPlanningBoard',
						usePostForRead: true
					}),
					processor: [resourceMasterProcessor, dateProcessor],
					translation: {
						uid: 'resourceMasterMainService',
						title: 'resource.master.resourceMasterTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
					},
					role: {
						itemName: 'ResourceDto',
						moduleName: 'cloud.desktop.moduleDisplayNameResourceMaster',
						descField: 'DescriptionInfo.Translated',
						useIdentification: true
					}
				});

				return platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions);
			};

			this.createResourceService = function createResourceService(options) {
				var complete = self.createResourceComplete(options);

				return complete.service;
			};
		}
	]);
})(angular);
