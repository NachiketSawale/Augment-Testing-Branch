/**
 * Created by janas on 03.07.2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'controlling.structure';

	// the company definition
	angular.module(moduleName).constant('companyCommonData', {
		Id: 1,
		Code: '901',
		Profitcenter: '901',
		CalendarFk: 1
	});

	// some projects
	angular.module(moduleName).constant('projectsCommonData', {
		projectA: {Id: 1, ProjectNo: 'ProjectNoA'},
		projectB: {Id: 2, ProjectNo: 'ProjectNoB'},
		projectC: {Id: 3, ProjectNo: 'ProjectNoC'}
	});

})(angular);