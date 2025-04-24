(function (angular) {
	'use strict';
	const moduleName = 'resource.reservation';
	/**
	 * @ngdoc service
	 * @name resourceReservationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */

	angular.module(moduleName).service('resourceReservationContainerInformationService', ResourceReservationContainerInformationService);

	ResourceReservationContainerInformationService.$inject = ['$injector','resourceCommonDragDropService', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator'];

	function ResourceReservationContainerInformationService($injector, resourceCommonDragDropService, platformLayoutHelperService, basicsLookupdataConfigGenerator) {
		let dynamicConfigurations = {};
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case '6540965b6c84450aa1da41fd1c870a47': // resourceReservationListController
					layServ = $injector.get('resourceReservationUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'resourceReservationUIStandardService';
					config.dataServiceName = 'resourceReservationDataService';
					config.validationServiceName = 'resourceReservationValidationService';
					config.listConfig = { initCalled: false, columns: [], dragDropService: resourceCommonDragDropService, type: 'resource.reservation' };
					break;
				case 'f1c290f9673c4ed2af8893510f93f6a5': // resourceReservationDetailController
					layServ = $injector.get('resourceReservationUIStandardService');
					config.layout = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'resourceReservationUIStandardService';
					config.dataServiceName = 'resourceReservationDataService';
					config.validationServiceName = 'resourceReservationValidationService';
					break;

				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : null;
					break;
			}
			return config;
		};

		this.getResourceReservationStructLayout = function getResourceReservationStructLayout(){
			let res = platformLayoutHelperService.getMultipleGroupsBaseLayoutWithoutHistory('1.0.0', 'resource.reservation.reservationstructure',
				['companyfk', 'projectfk', 'jobfk', 'reservationstatusfk', 'reservedfrom', 'reservedto']);

			res.overloads = {
				companyfk: platformLayoutHelperService.provideCompanyLookupReadOnlyOverload(),
				projectfk: platformLayoutHelperService.provideProjectLookupOverload(),
				jobfk: platformLayoutHelperService.provideJobLookupReadOnlyOverload(),
				reservationstatusfk: basicsLookupdataConfigGenerator.getStatusLookupConfig('basics.customize.resreservationstatus'),
				reservedfrom: {grouping: {generic: true}},
				reservedto: {grouping: {generic: true}},
			};

			return res;
		}

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNil(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};
	}
})(angular);
