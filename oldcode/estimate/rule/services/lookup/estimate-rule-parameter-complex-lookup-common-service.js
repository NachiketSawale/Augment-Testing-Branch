

(function () {
	/* global globals, _ */
	'use strict';
	let moduleName = 'estimate.parameter';
	angular.module(moduleName).factory('estimateRuleParameterComplexLookupCommonService', ['PlatformMessenger', 'estimateRuleParameterComplexInputgroupLookupService', '$http', '$injector',
		'platformCreateUuid', 'basicsLookupdataPopupService',
		function (PlatformMessenger, estimateRuleParameterComplexInputgroupLookupService, $http, $injector, platformCreateUuid,  basicsLookupdataPopupService) {

			// Object presenting the service
			let service = {};

			let popupToggle = basicsLookupdataPopupService.getToggleHelper();

			service.onCloseOverlayDialog = new PlatformMessenger();

			function getOptions(scope){
				let config = scope.$parent.$parent.groups;
				if(!config){return;}
				let group = _.find(scope.$parent.$parent.groups, {gid : 'ruleAndParam'});
				if(!group){return;}
				let ruleConfig = _.find(group.rows, {rid : 'param'});
				return ruleConfig ? ruleConfig.formatterOptions : null;
			}

			service.openPopup = function openPopup(e, scope){
				let popupOptions = {
					templateUrl:globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-parameter-complex-lookup.html',
					title: 'estimate.parameter.params',
					showLastSize: true,
					controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 600,
					height: 300,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new()
				};

				// toggle popup
				popupToggle.toggle(popupOptions);
				function controller($scope, lookupControllerFactory, $popupInstance) {

					let options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : getOptions(scope);
					estimateRuleParameterComplexInputgroupLookupService.initController($scope, lookupControllerFactory, options, $popupInstance,service.getAllColumns());

					// for close the popup-menu
					$scope.$on('$destroy', function() {
						if($scope.$close) {
							$scope.$close();
						}
					});
				}
			};

			service.getAllColumns = function getAllColumns(){
				let columns = [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						width: 120,
						toolTip: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityRuleCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 150,
						toolTip: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityRuleDescription'
					},
					{
						id: 'ParamCode',
						field: 'ParamCode',
						name: 'ParamCode',
						width: 120,
						toolTip: 'Code',
						formatter: 'Code',
						name$tr$: 'cloud.common.entityParamCode'
					},
					{
						id: 'ParamDesc',
						field: 'ParamDesc',
						name: 'Description',
						width: 150,
						toolTip: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityParamDescription'
					},
					{
						id: 'UomFk',
						field: 'UomFk',
						name: 'UoM',
						name$tr$: 'cloud.common.entityUoM',
						width: 100,
						formatter:'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					} ,
					{
						id: 'ValueType',
						field: 'ValueType',
						name: 'ValueType',
						name$tr$: 'cloud.common.entityType',
						width: 100,
						formatter:'lookup',
						formatterOptions: {
							directive: 'estimate-rule-parameter-type-lookup',
							lookupType: 'ParameterValueType',
							dataServiceName: 'estimateRuleParameterTypeDataService',
							displayMember: 'Description'
						}
					},
					{
						id: 'IsLookup',
						field: 'IsLookup',
						name: 'IsLookup',
						width: 150,
						toolTip: 'Code',
						formatter: 'boolean',
						name$tr$: 'estimate.rule.detailParameterIsLookup'
					}
				];
				return columns;
			};

			service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				if (!entity) {
					return;
				}
				let column = {formatterOptions: {serviceName: 'estimateRuleParameterFormatterService'}},
					service = $injector.get('platformGridDomainService');

				return service.formatter('imageselect')(null, null, entity, column, entity, null, null);
			};

			return service;
		}]);
})();
