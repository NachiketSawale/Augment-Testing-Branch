/**
 * Created by cakiral on 05.06.2020
 */

(function (angular) {
	'use strict';
	var companyModule = angular.module('basics.company');

	companyModule.service('basicsCompanyUtilisableGroupEvaluateChildrenProcessor', BasicsCompanyUtilisableGroupEvaluateChildrenProcessor);

	BasicsCompanyUtilisableGroupEvaluateChildrenProcessor.$inject = ['_', 'platformRuntimeDataService'];

	function BasicsCompanyUtilisableGroupEvaluateChildrenProcessor( _, platformRuntimeDataService ) {
		this.processItem = function processUtilisableEntity(utilisableGroup,data) {
			setParentGroupWithAssignedChildren(utilisableGroup, data);
		};

		function setParentGroupWithAssignedChildren(utilisableGrpEntity, data) {
			if(utilisableGrpEntity.ProjectGroupParentFk) {
				_.forEach(data.itemList, function (item) {
					if (item.GroupFk === utilisableGrpEntity.ProjectGroupParentFk ) {
						item.isParentGroupWithAssignedChildren = true;
						item.ChildId = utilisableGrpEntity.Id;
						platformRuntimeDataService.readonly(item, [
							{ field: 'GroupFk', readonly: true }
						]);
					}
				});
			}
		}
	}


})(angular);