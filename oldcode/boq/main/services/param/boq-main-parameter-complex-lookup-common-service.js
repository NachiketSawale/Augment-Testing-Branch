/**
 * Created by zos on 2/27/2018.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqParamComplexLookupCommonService
	 * @function
	 *
	 * @description
	 * boqParamComplexLookupCommonService provides all lookup common fn. for boq Parameters complex lookup
	 */
	angular.module(moduleName).factory('boqParamComplexLookupCommonService', ['PlatformMessenger', 'boqParameterComplexInputgroupLookupService', '$injector',
		'estimateParamUpdateService', 'platformCreateUuid', 'boqParameterFormatterService',
		'basicsLookupdataPopupService', 'basicsLookupdataConfigGenerator', 'estimateParameterComplexLookupValidationService',
		'estimateCommonLookupValidationService', 'estimateRuleParameterConstant', '$http', 'estimateParameterComplexInputgroupLookupService', '_',
		function (PlatformMessenger, boqParamComplexInputgroupLookupService, $injector,
			estimateParamUpdateService, platformCreateUuid, boqParameterFormatterService,
			basicsLookupdataPopupService, basicsLookupdataConfigGenerator, paramValidationService,
			estimateCommonLookupValidationService, estimateRuleParameterConstant, $http, estimateParameterComplexInputgroupLookupService, _) {

			// Object presenting the service
			var service = {};

			var popupToggle = basicsLookupdataPopupService.getToggleHelper();
			service.onCloseOverlayDialog = new PlatformMessenger();

			function getOptions(scope) {
				var config = scope.$parent.$parent.groups;
				if (!config) {
					return;
				}
				var group = _.find(scope.$parent.$parent.groups, {gid: 'ruleAndParam'});
				if (!group) {
					return;
				}
				var ruleConfig = _.find(group.rows, {rid: 'param'});
				return ruleConfig ? ruleConfig.formatterOptions : null;
			}

			service.openPopup = function openPopup(e, scope) {
				var popupOptions = {
					templateUrl: globals.appBaseUrl + '/estimate.rule/templates/estimate-rule-complex-lookup.html',
					title: 'estimate.parameter.params',
					showLastSize: true,
					controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', controller],
					width: 900,
					height: 300,
					focusedElement: angular.element(e.target.parentElement),
					relatedTarget: angular.element(e.target),
					scope: scope.$new()
				};

				// toggle popup
				popupToggle.toggle(popupOptions);

				function controller($scope, lookupControllerFactory, $popupInstance) {

					var options = scope.$parent.$parent.config ? scope.$parent.$parent.config.formatterOptions : getOptions(scope);
					// boqParamComplexInputgroupLookupService.initController($scope, lookupControllerFactory, options, $popupInstance, getAllColumns());

					estimateParameterComplexInputgroupLookupService.initController($scope, lookupControllerFactory, options, $popupInstance, getAllColumns());

					// for close the popup-menu
					$scope.$on('$destroy', function () {
						if ($scope.$close) {
							$scope.$close();
						}
					});
				}
			};

			// not support the multi selected
			service.onSelectionChange = function onSelectionChange(args) {
				var entity = args.entity;
				if (args.selectedItem && args.selectedItem.Id) {
					var selectedItem = angular.copy(args.selectedItem);

					if (_.find(entity.ParamAssignment, {Code: selectedItem.Code})) {
						return;
					}

					var creationData = {
						boqHeaderFk: entity.BoqHeaderFk,
						boqItemFk: entity.Id
					};
					$http.post(globals.webApiBaseUrl + 'boq/main/createboqitemparam', creationData).then(function (response) {
						var newParam = response.data;
						newParam.Version = 0;
						newParam.Code = selectedItem.Code;
						newParam.DescriptionInfo = selectedItem.DescriptionInfo;
						estimateParamUpdateService.setParamToSave([newParam], entity, 'boqMainService', 'Boq');
					});
				}
			};

			service.clearAllItems = function clearAllItems(args) {
				var entity = args.entity;
				if (entity && entity.ParamAssignment && entity.ParamAssignment.length) {
					estimateParamUpdateService.setParamToDelete(entity.ParamAssignment, entity);
					entity.ParamAssignment = [];

					// temporary not add the update action when clear all parameter items
					// var boqMainService = $injector.get('boqMainService');
					// boqMainService.update().then(function () {} );
				}
			};

			service.getColumns = function getColumns() {
				return [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 70,
						toolTip: 'Code',
						editor: 'code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						editor: 'translation',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						maxLength: 255
					}
				];
			};

			function getAllColumns() {
				var addCols = [
					{
						id: 'estparamgrpfk',
						field: 'EstParameterGroupFk',
						name: 'EstParameterGroupFk',
						width: 120,
						toolTip: 'Est Parameter Group Fk',
						editor: 'lookup',
						formatter: 'lookup',
						name$tr$: 'basics.customize.estparametergroup'
					},
					{
						id: 'valuedetail',
						field: 'ValueDetail',
						name: 'ValueDetail',
						width: 120,
						toolTip: 'ValueDetail',
						editor: 'comment',
						formatter: 'comment', /* function(row, cell, value){
                     return _.toUpper(value);
                     } , */
						name$tr$: 'basics.customize.valuedetail'
					},
					{
						id: 'parametervalue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 120,
						toolTip: 'ParameterValue',
						editor: 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'basics.customize.parametervalue',
						domain: function (item, column) {
							var domain;
							switch (item.ValueType) {
								case estimateRuleParameterConstant.Boolean:
									domain = 'boolean';
									column.DefaultValue = false;
									column.field = 'ParameterValue';
									column.editorOptions = null;
									column.formatterOptions = null;
									column.regex = null;
									break;
								case estimateRuleParameterConstant.Decimal2:
									domain = 'quantity';
									column.DefaultValue = null;
									column.field = 'ParameterValue';
									column.editorOptions = {decimalPlaces: 3};
									column.formatterOptions = {decimalPlaces: 3};
									column.regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
									break;
								case estimateRuleParameterConstant.Text:
									domain = 'description';
									column.ParameterValue = 0;
									column.field = 'ParameterText';
									column.editorOptions = null;
									column.formatterOptions = null;
									column.maxLength = 255;
									column.regex = null;
									break;
							}

							return domain;
						}
					},
					{
						id: 'uomfk',
						field: 'UomFk',
						name: 'UomFk',
						width: 120,
						toolTip: 'UomFk',
						editor: 'integer',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityUoM'
					},
					{
						id: 'defaultvalue',
						field: 'DefaultValue',
						name: 'DefaultValue',
						width: 120,
						toolTip: 'DefaultValue',
						editor: 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'estimate.parameter.defaultValue',
						domain: function (item, column) {
							var domain;
							switch (item.ValueType) {
								case estimateRuleParameterConstant.Boolean:
									domain = 'boolean';
									column.DefaultValue = false;
									column.field = 'DefaultValue';
									column.editorOptions = null;
									column.formatterOptions = null;
									column.regex = null;
									break;
								case estimateRuleParameterConstant.Decimal2:
									domain = 'quantity';
									column.DefaultValue = null;
									column.field = 'DefaultValue';
									column.editorOptions = {decimalPlaces: 3};
									column.formatterOptions = {decimalPlaces: 3};
									column.regex = '^(?:\\d{0,13}(?:\\.\\d{0,3}){0,16})?$';
									break;
								case estimateRuleParameterConstant.Text:
									domain = 'description';
									column.DefaultValue = 0;
									column.field = 'ValueText';
									column.editorOptions = null;
									column.formatterOptions = null;
									column.maxLength = 255;
									column.regex = null;
									break;
							}

							return domain;
						}
					},
					{
						id: 'valuetype',
						field: 'ValueType',
						name: 'Value Type',
						width: 120,
						toolTip: 'Value Type',
						name$tr$: 'estimate.parameter.valuetype',
						required: false,
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'estimate-rule-parameter-type-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'ParameterValueType',
							dataServiceName: 'estimateRuleParameterTypeDataService',
							displayMember: 'Description'
						}
					},
					{
						id: 'islookup',
						field: 'IsLookup',
						name: 'IsLookup',
						width: 120,
						toolTip: 'IsLookup',
						editor: 'boolean',
						formatter: 'boolean',
						name$tr$: 'estimate.parameter.isLookup'
					},
					{
						id: 'estruleparamvaluefk',
						field: 'EstRuleParamValueFk',
						name: 'Item Value',
						width: 100,
						toolTip: 'Item Value',
						name$tr$: 'estimate.parameter.estRuleParamValueFk',
						required: false,
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'boq-main-parameter-value-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'EstMainParameterValues',
							dataServiceName: 'boqMainParameterValueLookupService',
							displayMember: 'DescriptionInfo.Translated'
						}
					}
				];
				var columns = service.getColumns().concat(addCols);
				var uomConfig = _.find(columns, function (item) {
					return item.id === 'uomfk';
				});

				var paramgrpConfig = _.find(columns, function (item) {
					return item.id === 'estparamgrpfk';
				});

				angular.extend(uomConfig, basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true
				}).grid);

				angular.extend(paramgrpConfig, basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup').grid);

				estimateCommonLookupValidationService.addValidationAutomatically(columns, paramValidationService);

				return columns;
			}

			service.displayFormatter = function displayFormatter(value, lookupItem, displayValue, lookupConfig, entity) {
				if (!entity) {
					return;
				}
				var column = {formatterOptions: {serviceName: 'boqParameterFormatterService'}},
					service = $injector.get('platformGridDomainService');

				// var param = entity.ParamAssignment && entity.ParamAssignment.length > 0 ? { params: entity.ParamAssignment } : 'default';
				var param = entity.ParamAssignment && entity.ParamAssignment.length > 0 ? {params: _.map(entity.ParamAssignment, 'Code')} : 'default';

				return service.formatter('imageselect')(null, null, param, column, entity, null, null);
			};

			return service;
		}]);
})();
