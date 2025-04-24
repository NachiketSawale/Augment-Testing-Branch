/**
 * Created by baf on 2015/10/28
 */

(function () {

	/*global angular*/
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCustomizeStatusRoleGridDirective
	 * @requires
	 * @description
	 */
	angular.module('basics.customize').directive('basicsCustomizeAccessRightEditor', ['basicsCustomizeStatusRuleDataService', 'platformObjectHelper', function (ruleService, objectHelper) {

		return {
			restrict: 'A',
			scope: {entity: '='},
			templateUrl: window.location.pathname + '/basics.customize/templates/basics-customize-accessright-editor.html',
			link: function ($scope, ele, attrs) {

				function evalEntity() {
					return $scope.$eval(attrs.entity);
				}

				$scope.$watch('entity.rule', function (newEntity, oldEntity) {
					if (newEntity !== oldEntity && objectHelper.isSet(newEntity) && objectHelper.isSet(newEntity.AccessrightDescriptorFk) && newEntity.AccessrightDescriptorFk !== -1) {
						ruleService.loadAccessRightDescriptor(newEntity.AccessrightDescriptorFk).then(function (result) {
							newEntity.DescriptorDesc = result.DescriptorDesc;
						});
					}
				});

				$scope.create = function create() {
					var entity = evalEntity();
					if (objectHelper.isSet(entity, entity.rule)) {
						ruleService.createAccessRightDescriptor(entity).then(function (result) {
							// DescriptorId is always -1, will be replaced later on the server
							entity.rule.AccessrightDescriptorFk = result.DescriptorId;
							entity.rule.DescriptorDesc = result.DescriptorDesc;
						});
					}
				};

				$scope.delete = function () {
					var entity = evalEntity();
					ruleService.deleteAccessRightDescriptor(entity);
				};

			}
		};

	}]);

})();
