/**
 * Created by Shankar on 17.01.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc service
	 * @name logisticActionConstantValues
	 * @function
	 *
	 * @description
	 * logisticActionConstantValues provides definitions and constants frequently used in logistic action module
	 */
	angular.module(moduleName).value('logisticActionConstantValues', {
		schemes: {
			actionTarget: { typeName: 'BasicsCustomizeLogisticsActionTargetDTO', moduleSubModule: 'Basics.Customize' },
			actionItemTemplates: { typeName: 'ActionItemTemplateDto', moduleSubModule: 'Logistic.Action' },
			actionItemTypes: { typeName: 'ActionItemTemp2ItemTypeDto', moduleSubModule: 'Logistic.Action' },
			actionItemTemplatesByType: { typeName: 'ActionItemTemp2ItemTypeDto', moduleSubModule: 'Logistic.Action' },
		},
		uuid: {
			container: {
				actionTargetList: '5c3ad742e6704c3599bf8099f304a938',
				actionTargetDetails: 'ef2e6db7ebc64a6ea3c52bb302b4f02d',
				actionItemTemplatesList: '3172c5da049348609d8e54163f09e473',
				actionItemTemplatesDetails: 'c31f04d209cb40d9825f68cbfe09daaa',
				actionItemTypesList: '655124b7bd5447d8805276058df6027d',
				actionItemTypesDetails: '0ea726bc027d48d9a047f716f5dad752',
				sourceActionItemTemplatesByType: '8670a33e975948dba3fb210207c4bc18',

			}
		}
	});
})(angular);