/**
 * Created by uestuenel on 17.06.2016.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsWorkflowReportListCombobox
	 * @description Lookup for report list
	 */
	var moduleName = 'basics.workflow';

	angular.module(moduleName).directive('basicsWorkflowReportListCombobox', ['BasicsLookupdataLookupDirectiveDefinition', '$http', '_',
		function (BasicsLookupdataLookupDirectiveDefinition, $http, _) {

			var list = [];
			var defaults = {
				lookupType: 'report',
				valueMember: 'Id',
				displayMember: 'Name.Translated'
			};

			function getList() {
				return $http.get(globals.webApiBaseUrl + 'basics/reporting/report/list').then(function (response) {
					return _.sortBy(response.data, defaults.displayMember);
				});
			}

			function getItemFromList(list, id) {
				return _.find(list, {Id: id});
			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: getList,

					getItemByKey: function (value) {
						if (list.length < 1) {
							return getList().then(function (response) {
								return getItemFromList(response, value);
							});
						} else {
							return getItemFromList(list, value);
						}
					}
				}
			});
		}
	]);
})(angular);
