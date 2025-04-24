((angular) => {

	'use strict';
	let schedulingScheduleModule = angular.module('scheduling.schedule');

	/**
	 * @ngdoc service
	 * @name schedulingScheduleContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingScheduleModule.service('schedulingScheduleContainerInformationService', SchedulingScheduleContainerInformationService);

	SchedulingScheduleContainerInformationService.$inject = ['$injector', '_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function SchedulingScheduleContainerInformationService($injector, _, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			switch (guid) {
				case '7447B8DF191C45118F56DD84D25D1B41': // schedulingScheduleEditListController
					config.layout = $injector.get('schedulingScheduleConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingScheduleConfigurationService';
					config.dataServiceName = 'schedulingScheduleEditService';
					config.validationServiceName = 'schedulingScheduleValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '7F2C6C99ACB84BA8B1D455C2ACF93050': // schedulingScheduleEditDetailController
					config = $injector.get('schedulingScheduleConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingScheduleConfigurationService';
					config.dataServiceName = 'schedulingScheduleEditService';
					config.validationServiceName = 'schedulingScheduleValidationService';
					break;
				case 'D11B8A235A8646B4AF9C7D317F192973': // schedulingScheduleTimelineEditListController
					config.layout = $injector.get('schedulingScheduleTimelineConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingScheduleTimelineConfigurationService';
					config.dataServiceName = 'schedulingScheduleTimelineEditService';
					config.validationServiceName = 'schedulingScheduleTimelineValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '6681A59396F24D02A4BEAB2FFF3C735F': // schedulingScheduleTimelineEditDetailController
					config = $injector.get('schedulingScheduleTimelineConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingScheduleTimelineConfigurationService';
					config.dataServiceName = 'schedulingScheduleTimelineEditService';
					config.validationServiceName = 'schedulingScheduleTimelineValidationService';
					break;
				case '468be38b0d104ee58361b7e4395ac82d': // schedulingScheduleClerkListController
					config = self.getSchedulingScheduleClerkServiceInfos();
					config.layout = self.getSchedulingScheduleClerkLayout();
					config.ContainerType = 'Grid';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '9dba09dfec334213bc8cb59ef42ffc27': // schedulingScheduleClerkDetailController
					config = self.getSchedulingScheduleClerkServiceInfos();
					config.layout = self.getSchedulingScheduleClerkLayout();
					config.ContainerType = 'Detail';
					break;
				case 'c4e358d939c54ee6aac910b3c06b3e8': // schedulingScheduleSubScheduleListController
					config.layout = $injector.get('schedulingScheduleConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'schedulingScheduleConfigurationService';
					config.dataServiceName = 'schedulingScheduleSubScheduleDataService';
					config.validationServiceName = 'schedulingScheduleValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case 'c7281a461e144aeda6478c6b1789a6ee': // schedulingScheduleSubScheduleDetailController
					config = $injector.get('schedulingScheduleConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'schedulingScheduleConfigurationService';
					config.dataServiceName = 'schedulingScheduleSubScheduleDataService';
					config.validationServiceName = 'schedulingScheduleValidationService';
					break;
			}
			return config;
		};

		this.getSchedulingScheduleClerkServiceInfos = function getSchedulingScheduleClerkServiceInfos() {
			return {
				standardConfigurationService: 'schedulingScheduleClerkLayoutService',
				dataServiceName: 'schedulingScheduleClerkDataService',
				validationServiceName: 'schedulingScheduleClerkValidationService'
			};
		};

		this.getSchedulingScheduleClerkLayout = function getSchedulingScheduleClerkLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'scheduling.schedule.clerk',
				['clerkrolefk','clerkfk','commenttext']);
			res.overloads = self.getOverloads(['clerkrolefk','clerkfk']);

			return res;
		};

		this.getOverloads = function getOverloads(overloads) {
			let ovls = {};
			if(overloads) {
				_.forEach(overloads, (ovl) => {
					let ol = self.getOverload(ovl);
					if(ol) {
						ovls[ovl] = ol;
					}
				});
			}

			return ovls;
		};

		this.getOverload = function getOverloads(overload) {
			let ovl = null;

			switch(overload) {
				case 'clerkrolefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomClerkRoleLookupDataService',
					enableCache: true
				}); break;
				case 'clerkfk': ovl = platformLayoutHelperService.provideClerkLookupOverload(); break;
			}

			return ovl;
		};
	}
})(angular);
