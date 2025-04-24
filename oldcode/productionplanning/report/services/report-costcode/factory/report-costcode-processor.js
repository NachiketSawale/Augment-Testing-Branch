/**
 * Created by anl on 4/9/2018.
 */

(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.report';

	angular.module(moduleName).service('productionplanningReportCostCodeProcessor', ReportCostCodeProcessor);

	ReportCostCodeProcessor.$inject = ['platformRuntimeDataService'];

	function ReportCostCodeProcessor(platformRuntimeDataService) {
		var status;
		var self = this;
		var fields = ['CostCodeFk', 'Quantity', 'UomFk', 'CommentText'];

		this.processItem = function processItem(item) {
			if (status) {
				_.forEach(fields, function (field){
					self.setColumnReadOnly(item, field, status);
				});
			}
		};

		this.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
			var fields = [
				{field: column, readonly: flag}
			];
			platformRuntimeDataService.readonly(item, fields);
		};

		this.updateStatus = function updateStatus(reportStatus){
			status = reportStatus;
		};
	}

})(angular);