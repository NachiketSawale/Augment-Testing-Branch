/**
 * Created by baf on 24.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.common';

	/**
	 * @ngdoc service
	 * @name projectCommonLayoutOverloadService
	 * @description provides overloads frequently used in diverse modules of logistic
	 */
	angular.module(moduleName).service('projectCommonLayoutOverloadService', ProjectCommonLayoutOverloadService);

	ProjectCommonLayoutOverloadService.$inject = ['basicsLookupdataConfigGenerator'];

	function ProjectCommonLayoutOverloadService(basicsLookupdataConfigGenerator) {
		var self = this;

		this.getScheduleLookupOverload = function getScheduleLookupOverload(){
			return basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'schedulingLookupScheduleDataService',
				filter: function (item) {
					return item.ProjectFk;
				}
			});
		};

		this.getScheduleActivityLookupOverload = function getScheduleActivityLookupOverload(){
			return {
				grid: {
					editor: 'lookup',
					editorOptions: {
						directive: 'scheduling-main-activity-dialog-lookup',
						lookupOptions: {
							showClearButton: true,
							pageOptions: {
								enabled: true,
								size: 100
							},
							defaultFilter: {
								projectFk: 'ProjectFk',
								projectFkReadOnly: true,
								controllingUnitFk: 'ControllingUnitFk',
								controllingUnitFkVisible: true,
								controllingUnitFkReadOnly: true
							},
							additionalColumns: true,
							addGridColumns: [{
								id: 'description',
								field: 'Description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'description',
								readonly: true
							}]
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'SchedulingActivityNew',
						displayMember: 'Code',
						version: 3
					}
				},
				detail: {
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						showClearButton: true,
						lookupDirective: 'scheduling-main-activity-dialog-lookup',
						lookupType: 'SchedulingActivityNew',
						displayMember: 'Code',
						version: 3,
						lookupOptions: {
							showClearButton: true,
							pageOptions: {
								enabled: true,
								size: 100
							},
							defaultFilter: {'projectFk': 'ProjectFk',
								'projectFkReadOnly': true,
								'controllingUnitFk': 'ControllingUnitFk',
								'controllingUnitFkVisible': true,
								'controllingUnitFkReadOnly': true
							}
						}
					}
				}
			};
		};
	}
})(angular);
