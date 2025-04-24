/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';
	angular.module(moduleName).value('projectCostcodesPriceListForJobStatusValues',{
		warningNoJob: 0,
		warningNoJobDescription: 'project.main.updateCostCodeForJob.warningNoJob',

		success:1,
		successDescription: 'project.main.updateCostCodeForJob.successMsg',

		warning: 2,
		warningDescription: 'project.main.updateCostCodeForJob.warningStatus',

		error: 3,
		errorDescription: 'project.main.updateCostCodeForJob.errorStatus'
	});
})(angular);