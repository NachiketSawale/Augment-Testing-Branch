/**
 * Created by anl on 4/10/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).service('productionPlanningAccountingRuleCheckService', RuleCheckService);

	RuleCheckService.$inject = ['platformTranslateService',
		'productionplanningAccountingRuleDataService',
		'basicsLookupdataConfigGenerator',
		'$http',
		'$q'];

	function RuleCheckService(platformTranslateService,
							  ruleDataService,
							  basicsLookupdataConfigGenerator,
							  $http,
							  $q) {
		var service = {};
		var rule;

		function initRule() {
			rule = ruleDataService.getSelected();
		}

		function initForm($scope) {
			var ruleTypeDetailOptions = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingruletype', null, {
				showIcon: true
			}).detail.options;
			var importFormatDetailOptions = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingruleimportformat', null, {
				showIcon: true
			}).detail.options;

			var formConfig = {
				fid: 'productionplanning.accounting.rule.checkForm',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'baseGroup',
						header: 'transportplanning.requisition.entityRequisition',
						isOpen: true,
						attributes: ['RuleTypeFk', 'ImportFormatFk', 'MatchPattern', 'TestField']
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'ruletypefk',
						label: '*Rule Type',
						label$tr$: 'productionplanning.accounting.rule.ruleTypeFk',
						model: 'RuleTypeFk',
						sortOrder: 1,
						readonly: true,
						type: 'directive',
						directive: 'basics-lookupdata-simple',
						options: ruleTypeDetailOptions
					},
					{
						gid: 'baseGroup',
						rid: 'importformatfk',
						label: '*Import Format',
						label$tr$: 'productionplanning.accounting.rule.importFormatFk',
						model: 'ImportFormatFk',
						sortOrder: 2,
						readonly: true,
						type: 'directive',
						directive: 'basics-lookupdata-simple',
						options: importFormatDetailOptions
					},
					{
						gid: 'baseGroup',
						rid: 'matchpattern',
						label: '*Match Pattern',
						label$tr$: 'productionplanning.accounting.rule.matchPattern',
						model: 'MatchPattern',
						sortOrder: 3,
						type: 'text'
					},
					{
						gid: 'baseGroup',
						rid: 'testfield',
						label: '*Test Field',
						label$tr$: 'productionplanning.accounting.rule.testField',
						model: 'TestField',
						sortOrder: 4,
						type: 'description'
					}
				]
			};
			$scope.formOptions = {
				entity: {
					Id: rule.Id,
					RuleTypeFk: rule.RuleTypeFk,
					ImportFormatFk: rule.ImportFormatFk,
					MatchPattern: rule.MatchPattern,
					TestField: ''
				},
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		}

		service.initDialog = function ($scope) {
			initRule();
			initForm($scope);
			service.changeMatchPattern = function () {
				return rule.MatchPattern !== $scope.formOptions.entity.MatchPattern;
			};

			service.validateTestField = function (entity, value) {
				var defer = $q.defer();
				$scope.isBusy = true;
				$http.post(globals.webApiBaseUrl + 'productionplanning/accounting/rule/testrule', {
						Rule: entity,
						Value: value
					}
				).then(function (response) {
					$scope.isBusy = false;
					var res = {apply: true, valid: true, error: ''};
					if (response && !response.data) {
						res = {
							apply: true,
							valid: false,
							error: '*Test does not match expression.',
							error$tr$: 'productionplanning.accounting.rule.testError'
						};
					}
					defer.resolve(res);
				});
				return defer.promise;
			};
		};

		return service;
	}

})(angular);