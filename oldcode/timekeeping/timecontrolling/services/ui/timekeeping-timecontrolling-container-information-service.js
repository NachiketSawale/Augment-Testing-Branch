/*
 * $Id: timekeeping-timecontrolling-container-information-service.js 50932 2022-08-15 07:33:12Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.timecontrolling';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeControllingContainerInformationService
	 * @description provides information on container used in timekeeping controlling module
	 */
	angular.module(moduleName).service('timekeepingTimecontrollingContainerInformationService', TimekeepingTimeControllingContainerInformationService);

	TimekeepingTimeControllingContainerInformationService.$inject = ['_', '$injector', 'basicsLookupdataConfigGenerator', 'platformLayoutHelperService'];

	function TimekeepingTimeControllingContainerInformationService(_, $injector, basicsLookupdataConfigGenerator, platformLayoutHelperService) {
		let self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = null;
			switch (guid) {
				case 'ed78f11aecf14c11be28f8399f4d4590': // timekeepingTimeControllingListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingControllingServiceInfos(), self.getTimekeepingControllingReportLayout);
					break;
				case '4d7ec9a6539c447fbbea83b03c00b5d9': // timekeepingTimeControllingDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingControllingServiceInfos(), self.getTimekeepingControllingReportLayout);
					break;
				case '36f4e73f15ab4fc283c9492dcd9fa50c': // timekeepingTimeControllingBreakListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingControllingBreakServiceInfos(), self.getTimekeepingControllingBreakLayout);
					break;
				case '9b148bd082fd4470831c6686a24db1e3': // timekeepingTimeControllingBreakDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingControllingBreakServiceInfos(), self.getTimekeepingControllingBreakLayout);
					break;

				case 'a6bf0eb6d1ca4e5cb945fef7fb3f6ab8': // timekeepingTimeControllingReportVerificationListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getTimekeepingControllingVerificationServiceInfos(), self.getTimekeepingControllingVerificationLayout);
					break;
				case '67045a0fa32d41fe92d0083d5997c49c': // timekeepingTimeControllingReportVerificationDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getTimekeepingControllingVerificationServiceInfos(), self.getTimekeepingControllingVerificationLayout);
					break;
			}
			return config;
		};

		this.getTimekeepingControllingServiceInfos = function getTimekeepingControllingServiceInfos() {
			/*
			let validationService = {};
			let valServFactory = $injector.get('timekeepingRecordingReportValidationServiceFactory');
			let dataService = $injector.get('timekeepingTimecontrollingReportDataService');
			valServFactory.createTimekeepingReportValidationService(validationService, dataService);
*/
			return {
				standardConfigurationService: 'timekeepingTimeControllingReportLayoutService',
				dataServiceName: 'timekeepingTimecontrollingReportDataService',
				validationServiceName: 'timekeepingTimeControllingReportValidationService'
			};
		};

		this.getTimekeepingControllingReportLayout = function getTimekeepingControllingReportLayout() {
			let modCIS = $injector.get('timekeepingRecordingContainerInformationService');
			let layout = _.cloneDeep(modCIS.getReportLayout());
			layout.groups[0].attributes.push('employeefk');
			layout.groups[0].attributes.push('recordingfk');
			layout.overloads.employeefk = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingEmployeeLookupDataService'
				});
			layout.overloads.recordingfk = {
				detail: {
					type: 'code',
					formatter: 'code',
					model: 'ReportHeader.Code'
				},
				grid: {
					formatter: 'code',
					field: 'ReportHeader.Code',
					addColumns: [
						{
							id: 'RecordingDescription',
							field: 'ReportHeader.Description',
							name: 'Description',
							width: 200,
							formatter: 'description',
							name$tr$: 'cloud.common.entityDescription'
						}
					]
				},
				readonly: true
			};
			return  layout;
		};
		this.getTimekeepingControllingBreakServiceInfos = function getTimekeepingControllingBreakServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeControllingBreakLayoutService',
				dataServiceName: 'timekeepingTimeControllingBreakDataService',
				validationServiceName: 'timekeepingTimeControllingBreakValidationService',
			};
		};

		this.getTimekeepingControllingBreakLayout = function getTimekeepingControllingBreakLayout() {
			let modCIS = $injector.get('timekeepingRecordingContainerInformationService');
			return _.cloneDeep(modCIS.getBreakLayout());
		};

		this.getTimekeepingControllingVerificationServiceInfos = function getTimekeepingControllingVerificationServiceInfos() {
			return {
				standardConfigurationService: 'timekeepingTimeControllingReportVerificationLayoutService',
				dataServiceName: 'timekeepingTimeControllingReportVerificationDataService',
				validationServiceName: 'timekeepingTimeControllingReportVerificationValidationService',
			};
		};
		this.getTimekeepingControllingVerificationLayout = function getTimekeepingControllingVerificationLayout() {
			let modCIS = $injector.get('timekeepingRecordingContainerInformationService');
			return _.cloneDeep(modCIS.getEmployeeReportVerificationLayout());
		};
	}
})(angular);