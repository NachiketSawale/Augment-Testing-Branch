/**
 * Created by anl on 2/2/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).factory('productionplanningReportReportProcessor', ReportProcessor);

	ReportProcessor.$inject = ['platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService'];

	function ReportProcessor(platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
		var service = {};

		service.processItem = function processItem(item) {
			var status = basicsLookupdataLookupDescriptorService.getLookupItem('MntReportStatus', item.RepStatusFk);
			if (status && status.IsApproved) {
				service.setColumnReadOnly(item, 'Code', status.IsApproved);
				service.setColumnReadOnly(item, 'DescriptionInfo', status.IsApproved);
				service.setColumnReadOnly(item, 'ActivityFk', status.IsApproved);
				service.setColumnReadOnly(item, 'RepStatusFk', status.IsApproved);
				service.setColumnReadOnly(item, 'StartTime', status.IsApproved);
				service.setColumnReadOnly(item, 'EndTime', status.IsApproved);
				service.setColumnReadOnly(item, 'Remarks', status.IsApproved);
				service.setColumnReadOnly(item, 'ClerkFk', status.IsApproved);
				service.setColumnReadOnly(item, 'Userdefined1', status.IsApproved);
				service.setColumnReadOnly(item, 'Userdefined2', status.IsApproved);
				service.setColumnReadOnly(item, 'Userdefined3', status.IsApproved);
				service.setColumnReadOnly(item, 'Userdefined4', status.IsApproved);
				service.setColumnReadOnly(item, 'Userdefined5', status.IsApproved);
			}
		};

		service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		return service;
	}

})(angular);