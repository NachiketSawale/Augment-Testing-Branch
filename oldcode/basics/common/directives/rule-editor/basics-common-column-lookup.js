/**
 * Created by balkanci on 23.11.2015.
 */
(function (angular) {
	'use strict';
	angular.module('basics.common').directive('basicsCommonColumnLookup', ['BasicsLookupdataLookupDirectiveDefinition', 'basicsCommonRuleEditorService', '$q', '_', '$translate',
		function (BasicsLookupdataLookupDirectiveDefinition, configService, $q, _, $translate) {
			var lookupOptions = {
				lookupType: 'attributes',
				valueMember: 'Id',
				displayMember: 'PropName',
				showClearButton: true,
				placeholder: $translate.instant('platform.bulkEditor.chooseField')
			};

			var baseOptions = {};
			baseOptions.dataProvider = {
				getList: function (/* disabledFilter */) {
					var availableProps = baseOptions.ruleEditorManager.getConfig().AvailableProperties;
					availableProps = _.filter(availableProps, function (prop) {
						var operatorType = baseOptions.ruleEditorManager.getConfig().RuleOperatorType;
						return ((!_.isEmpty(prop.editor) && operatorType === 4) || operatorType === 2) && prop.formatter !== 'history';
					});
					var props = _.map(availableProps, function (prop) {
						var newProp;
						if (!_.isObject(prop)) {
							newProp = {
								PropName: prop,
								Id: prop.toLowerCase()
							};
						} else {
							newProp = {
								PropName: prop.name,
								Id: prop.id,
								ParentPathName: prop.parentName,
								bulkSupport: prop.bulkSupport
							};
						}
						return newProp;
					});
					// is an object when called from base
					if (!baseOptions.ruleEditorManager.readOnly) {
						props = _.filter(props, function (prop) {
							return prop.bulkSupport !== false;
						});
					}
					return $q.when(_.orderBy(props, ['ParentPathName', 'PropName']));
				},
				getItemByKey: function (id) {
					return baseOptions.dataProvider.getList(true).then(function (items) {
						return _.find(items, function (item) {
							return item.Id === id;
						});
					});
				},
				getSearchList: null,
				getDefault: null
			};
			baseOptions.controller = ['$scope', function ($scope) {
				baseOptions.ruleEditorManager = $scope.$parent.ruleEditorManager || configService.getDefaultManager();
			}];

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', lookupOptions, baseOptions);
		}]);

})(angular);
