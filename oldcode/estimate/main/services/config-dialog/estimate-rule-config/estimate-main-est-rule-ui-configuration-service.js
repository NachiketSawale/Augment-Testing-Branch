/**
 * Created by joshi on 12.04.2016.
 */

(function () {

	'use strict';

	let modulename = 'estimate.main';

	/**
	 * @ngdoc estimateMainEstRuleUIConfigService
	 * @name
	 * @description
	 * This is the configuration service for estimate structure dialog.
	 */
	angular.module(modulename).factory('estimateMainEstRuleUIConfigService', [
		function () {

			let service = {};

			let formConfig = {
				groups: [
					{ gid: 'estRule', header: 'Root Assignment', header$tr$: 'estimate.main.ruleAssignment', isOpen: true, visible: true, sortOrder: 5 }
				],
				rows: [
					{
						gid: 'estRule', rid: 'estRuleAssignType', label: 'Rule Assignment Type', label$tr$: 'estimate.main.estRuleAssignmentType',
						type: 'directive', directive: 'estimate-main-est-rule-assign-type', model: 'estRuleAssignTypeFk',
						options: {
							serviceName: 'estimateMainEstRuleAssignTypeService',
							displayMember: 'Description',
							valueMember: 'Id',
							showClearButton: true
						},
						readonly: false, disabled:false, visible: true, sortOrder: 1
					},
					{
						gid: 'estRule', rid: 'estRuleAssignConfigDesc', label: 'Description', label$tr$: 'cloud.common.entityDescription',
						type: 'description', model: 'estRuleAssignConfigDesc', readonly: true, visible: true, sortOrder: 2
					},
					{
						gid: 'estRule', rid: 'estRootAssignmentDetail', label: 'Root Assignment Config Details', label$tr$: 'estimate.main.ruleAssignmentConfigDetails',
						type: 'directive', model: 'estRootAssignmentDetails', directive:'estimate-main-rule-config-detail',
						readonly: false, maxlength:5000, rows:20, visible: true, sortOrder: 3
					},
					{
						gid: 'estRule', rid: 'estRootAssignmentParamsDetail', label: 'Params Details', label$tr$: 'estimate.main.ruleAssignmentParamDetails',
						type: 'directive',  model: 'estRootAssignmentParams', directive: 'estimate-main-est-rule-params-detail-grid',
						readonly: false, maxlength:5000, rows:20, visible: true, sortOrder: 4
					}
				]
			};

			/**
			 * @ngdoc function
			 * @name getFormConfig
			 * @function
			 * @methodOf estimateMainUIConfigService
			 * @description Builds and returns the estimate structure form configuration for the estimate configuration dialog
			 */
			service.getFormConfig = function(/* customizeOnly, isAssemblies */) {
				return angular.copy(formConfig);
			};

			return service;
		}

	]);

})();
