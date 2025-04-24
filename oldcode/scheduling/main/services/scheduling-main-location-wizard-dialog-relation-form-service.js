/**
 * Created by henkel on 17.03.2016.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.main';
	var schedulingModule = angular.module(moduleName);

	schedulingModule.factory('schedulingMainLocationWizardDialogRelationFormService', [
		function () {
			var service = {};

			var relation = {};
			service.setRelationsCache = function setRelationCache(entity) {
				relation = {
					_relationKindFk: entity.RelationKindFk,
					_fixLagTime: entity.FixLagTime,
					_fixLagPercent: entity.FixLagPercent,
					_varLagTime: entity.VarLagTime,
					_varLagPercent: entity.VarLagPercent
				};
			};

			service.getRelationsCache = function getRelationCache() {
				return relation;
			};


			return service;

		}]);
})(angular);
