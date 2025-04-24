/**
 * Created by anl on 1/23/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

	angular.module(moduleName).factory('productionplanningReportTimeSheetLayout', TimeSheetLayout);
	TimeSheetLayout.$inject = ['platformLayoutHelperService'];
	function TimeSheetLayout(platformLayoutHelperService) {
		return {
			'fid': 'productionplanning.report.timeSheetLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['resourcefk', 'countryfk', 'description', 'date', 'starttime', 'endtime']
				},
				{
					gid: 'additionalInformation',
					attributes: ['hadbreak', 'breaktime', 'vacation', 'sick', 'timeoff', 'overnight', 'driver', 'leader', 'doctor', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				resourcefk: platformLayoutHelperService.provideResourceLookupOverload(),
				countryfk: {
					grid: {
						editor: 'lookup',
						directive: 'basics-lookupdata-lookup-composite',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-country-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Country',
							displayMember: 'Description'
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'basics-country-lookup',
							descriptionMember: 'Description'
						}
					}
				}
			}
		};
	}

})(angular);