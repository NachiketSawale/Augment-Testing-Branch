(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceMasterPlanningBoardSupplierMappingService
	 * @function
	 *
	 * @description
	 * resourceMasterPlanningBoardSupplierMappingService is the mapping service for all suppliers in planning boards
	 */
	var moduleName = 'resource.master';

	var resourceModule = angular.module(moduleName);

	resourceModule.service('resourceMasterPlanningBoardSupplierMappingService', ResourceMasterPlanningBoardSupplierMappingService);

	//ResourceMasterPlanningBoardSupplierMappingService.$inject = [];

	function ResourceMasterPlanningBoardSupplierMappingService() {
		var self = this;

		// function implementMemberAccess(field, supplier, value) {
		// 	// nullable values are accepted
		// 	if (!_.isUndefined(value)) {
		// 		supplier[field] = value;
		// 	}
		// 	return supplier[field];
		// }
		//
		// function implementNumberMemberAccess(field, reservation, value) {
		// 	// nullable values are accepted
		// 	if (_.isNumber(value) || value === null) {
		// 		reservation[field] = value;
		// 	}
		// 	return reservation[field];
		// }

		self.id = function idOfSupplier(supplier) {
			if (!supplier) {
				return null;
			}
			return supplier.Id;
		};

		self.validateWith = function validateWith(supplier, pbGridDefaultSetting) {
			if (!supplier) {
				return [];
			}

			let providedList = _.map(supplier.ProvidedResourceSkillList, function (entity) {
				let skillEntity = _.find(supplier.ProvidedSkillList, { Id: entity.SkillFk });
				let validTo = entity.ValidTo ? new Date(entity.ValidTo) : null;
				return Object.assign({}, skillEntity, { Type: 'skill', ValidTo: validTo });
			});

			if (supplier.TypeFk && supplier.ResTypeParentList  && pbGridDefaultSetting === true) {
				_.forEach(supplier.ResTypeParentList, function (item) {
					providedList.push(Object.assign({}, item, {Type: 'resType'}));
				});
			}
			if(providedList.length === 0){
				providedList = null;
			}
			return providedList;
			//	return supplier ? supplier.ProvidedSkillList.push(supplier.ResTypeParentList) : [];
		};

		// the name of parameter was not correct. It's not requisition but skills
		self.isMandatory = function isMandatory(providedSkill) {
			if (!providedSkill) {
				return false;
			}

			if (providedSkill.Type === 'resType') {
				return true;
			} else {
				return providedSkill.IsMandatory;
			}
		};
	}

})(angular);
