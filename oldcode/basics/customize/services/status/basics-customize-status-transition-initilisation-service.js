/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeStatusTransitionInitialisationService
	 * @function
	 *
	 * @description
	 * basicsCustomizeStatusTransitionInitialisationService is the data service for all entity type descriptions
	 */

	basicsCustomizeModule.service('basicsCustomizeStatusTransitionInitialisationService', BasicsCustomizeStatusTransitionInitialisationService);

	BasicsCustomizeStatusTransitionInitialisationService.$inject = ['_','$http','$q','basicsCustomizeStatusDataService','basicsCustomizeStatusRuleDataService','basicsCustomizeStatusRoleDataService','basicsCustomizeStatusWorkflowStepDataService','basicsCustomizeStatusTransitionConfigurationService'];

	function BasicsCustomizeStatusTransitionInitialisationService( _, $http, $q, basicsCustomizeStatusDataService, basicsCustomizeStatusRuleDataService, basicsCustomizeStatusRoleDataService, basicsCustomizeStatusWorkflowStepDataService,basicsCustomizeStatusTransitionConfigurationService) {
		var self = this;

		this.initializeStatusTransitionDataServices = function initializeStatusTransitionDataServices(entityType) {
			var conf;
			var transConf = basicsCustomizeStatusTransitionConfigurationService.StatusTransitionInitialize(entityType.DBTableName);
			if (!_.isNull(transConf) && !_.isUndefined(transConf)) {
				conf = self.initializeTransitionDataServicesWith(transConf);
			}

			return conf;
		};

		this.initializeTransitionDataServicesWith = function initializeTransitionDataServicesWith(settings) {
			return $q.all([
				basicsCustomizeStatusDataService.loadStates(),
				basicsCustomizeStatusRoleDataService.initialize(settings.RoleEndPoint, settings.RoleTable, settings.StatusRuleProperty),
				basicsCustomizeStatusRuleDataService.initialize(settings.RuleEndPoint, settings.RuleTable, settings.FromState, settings.ToState),
				basicsCustomizeStatusWorkflowStepDataService.initialize(settings.WorkflowEndPoint, settings.WorkflowTable, settings.StatusRuleProperty, settings.WorkflowEntityName)
			]).then(function() {
				var conf = {};

				conf.roleIsVisible = false;
				conf.rubricId = settings.RubricId;
				if(settings.RoleEndPoint && settings.RoleTable)  {
					conf.roleIsVisible = true;
				}
				conf.roleDataService = basicsCustomizeStatusRoleDataService;
				conf.ruleDataService = basicsCustomizeStatusRuleDataService;
				conf.workflowStepDataService = basicsCustomizeStatusWorkflowStepDataService;

				return conf;
			});

		};





	}
})();
