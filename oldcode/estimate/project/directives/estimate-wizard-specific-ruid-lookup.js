/**
 * Created by ohiaguc on 7.09.2020.
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('estimate.project').directive('estimateWizardSpecificRuidLookup', ['$q', '$http', 'basicsCharacteristicDataDiscreteValueLookupService', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($q, $http, lookupService, BasicsLookupdataLookupDirectiveDefinition) {
			let list = [];
			let defaults = {
				lookupType: 'estimateWizardSpecificRuid',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				uuid: 'fbe8369f52f143d9b0ddc515d98ab4a3',
				columns: [
					{ id: 'descriptioninfo', field: 'DescriptionInfo.Description', name: 'Description', width: 80, name$tr$: 'basics.common.Description' }
				]
			};

			function getList(settings, scope) {
				let characteristicvalue = scope.entity.plantno;
				let estimatetype = scope.entity.estimatetype;
				if (characteristicvalue !== -1) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/wizard/getspecificruidlist?characteristicvalue=' + characteristicvalue + '&estimatetype=' + estimatetype).then(function (response) {
						list = response.data;
						return list;
					});
				}

			}

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {

				dataProvider: {
					getList: getList,
					getItemByKey: function () {
					}
				}
			});
		}
	]);
})(angular);
