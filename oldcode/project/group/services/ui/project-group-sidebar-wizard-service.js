/**
 * Created by nitsche on 21.10.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupSidebarWizardService
	 * @description provides methods for starting the wizards from sidebar.
	 */
	myModule.service('projectGroupSidebarWizardService', ProjectGroupSidebarWizardService);

	ProjectGroupSidebarWizardService.$inject = [
		'basicsCommonChangeStatusService', 'projectGroupProjectGroupDataService', 'basicsLookupdataSimpleLookupService'
	];

	function ProjectGroupSidebarWizardService(
		basicsCommonChangeStatusService, projectGroupProjectGroupDataService, basicsLookupdataSimpleLookupService
	) {
		let setProjectGroupStatus = function setProjectGroupStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: projectGroupProjectGroupDataService,
					statusField: 'ProjectGroupStatusFk',
					//codeField: 'Code',
					descField: 'Description',
					projectField: '',
					title: 'basics.customize.projectgroupstatus',
					statusDisplayField: 'Description',
					statusName: 'projectgroupstatus',
					statusProvider: function () {
						return basicsLookupdataSimpleLookupService.getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.projectgroupstatus',
						});
					},
					updateUrl: 'project/group/changestatus',
					id: 1
				}
			);
		};
		this.setProjectGroupStatus = setProjectGroupStatus().fn;
	}
})(angular);