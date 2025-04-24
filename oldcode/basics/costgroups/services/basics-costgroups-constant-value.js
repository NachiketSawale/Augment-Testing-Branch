/**
 * Created by lnt on 7/31/2019.
 */

(function (angular) {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.costgroups';

	/**
	 * @ngdoc service
	 * @name resourceSkillConditionConstantValues
	 * @function
	 *
	 * @description
	 * resourceSkillConditionConstantValues provides definitions and constants frequently used in resource skill module
	 */
	angular.module(moduleName).value('basicsCostGroupsConstantValues', {
		schemes: {
			costGroupCatalog: {typeName: 'CostGroupCatDto', moduleSubModule: 'Basics.CostGroups'},
			costGroup: {typeName: 'CostGroupDto', moduleSubModule: 'Basics.CostGroups'}
		},
		uuid: {
			container: {
				costGroupCatalogList: '3FEF67F4C51DAF48775E7C16841CFCA2',
				costGroupCatalogDetails: '950e80bb6ef44857bec647e238598c5e',
				costGroupList: '53BBF195FCA0C866020EB155E43DB648',
				costGroupDetails: 'ae907fe037404c529b869ac249530084'
			}
		}
	});
})(angular);