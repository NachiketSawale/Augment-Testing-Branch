/**
 * Created by baf on 06.12.2022
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupReadonlyProcessor
	 * @description makes fields of proect groups readonly depending on internal states
	 */
	myModule.service('projectGroupReadonlyProcessor', ProjectGroupReadonlyProcessor);

	ProjectGroupReadonlyProcessor.$inject = ['_', 'platformRuntimeDataService'];

	function ProjectGroupReadonlyProcessor(_, platformRuntimeDataService) {

		this.processItem = function processProjectGroup(group) {
			platformRuntimeDataService.readonly(group, [
				{ field: 'Code', readonly: group.Version >= 1 },
				{ field: 'DefaultTemplateProjectFk', readonly: _.isNil(group.ITwoBaselineServerFk) },
				{ field: 'ITwoBaselineServerFk', readonly: group.IsAutoIntegration && (group.Version >= 1 || !_.isNil(group.ParentGroupFk)) }
			]);
		};
	}
})(angular);