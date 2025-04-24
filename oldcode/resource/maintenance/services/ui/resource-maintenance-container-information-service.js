/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var resourceMaintenanceModule = angular.module('resource.maintenance');

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	resourceMaintenanceModule.service('resourceMaintenanceContainerInformationService', ResourceMaintenanceContainerInformationService);

	ResourceMaintenanceContainerInformationService.$inject = ['platformLayoutHelperService', 'basicsLookupdataConfigGenerator',
		'resourceCommonLayoutHelperService', 'resourceMaintenanceConstantValues'];

	function ResourceMaintenanceContainerInformationService(platformLayoutHelperService, basicsLookupdataConfigGenerator,
		resourceCommonLayoutHelperService, resourceMaintenanceConstantValues) {
		var self = this;
		var guids = resourceMaintenanceConstantValues.uuid.container;

		/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case guids.schemaList: // resourceMaintenanceSchemaListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSchemaServiceInfo(), self.getSchemaLayout);
					break;
				case guids.schemaDetail: // resourceMaintenanceSchemaDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSchemaServiceInfo(), self.getSchemaLayout);
					break;
				case guids.schemaRecordList: // resourceMaintenanceRecordListController
					config = platformLayoutHelperService.getStandardGridConfig(self.getSchemaRecordServiceInfo(), self.getSchemaRecordLayout);
					break;
				case guids.schemaRecordDetail: // resourceMaintenanceRecordDetailController
					config = platformLayoutHelperService.getStandardDetailConfig(self.getSchemaRecordServiceInfo(), self.getSchemaRecordLayout);
					break;
			}

			return config;
		};

		this.getSchemaServiceInfo = function getSchemaServiceInfo() {
			return {
				standardConfigurationService: 'resourceMaintenanceSchemaLayoutService',
				dataServiceName: 'resourceMaintenanceSchemaDataService',
				validationServiceName: 'resourceMaintenanceSchemaValidationService'
			};
		};

		this.getSchemaLayout = function getSchemaLayout() {
			let res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.maintenance.scheme',
				['descriptioninfo', 'comment', 'isdefault', 'sorting', 'islive', 'leadquantity', 'leaddays']);

			// res.overloads = platformLayoutHelperService.getOverloads(['skilltypefk', 'skillgroupfk'], self);

			return res;
		};

		this.getSchemaRecordServiceInfo = function getSchemaRecordServiceInfo() {
			return {
				standardConfigurationService: 'resourceMaintenanceSchemaRecordLayoutService',
				dataServiceName: 'resourceMaintenanceSchemaRecordDataService',
				validationServiceName: 'resourceMaintenanceSchemaRecordValidationService'
			};
		};

		this.getSchemaRecordLayout = function getSchemaRecordLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'resource.maintenance.record',
				['code', 'descriptioninfo', 'jobcardtemplatefk', 'isfixeddays', 'daysafter', 'isperformancebased', 'uomfk', 'quantity', 'duration', 'remark', 'comment', 'isrecalcdates','isrecalcperformance']);

			res.overloads = platformLayoutHelperService.getOverloads(['jobcardtemplatefk','uomfk'], self);

			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'jobcardtemplatefk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'logisticCardTemplateLookupDataService',
					cacheEnable: true
				}); break;
				case 'uomfk': ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				}); break;
				// case 'skilltypefk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.resourceskilltype'); break;
			}

			return ovl;
		};
	}
})(angular);
