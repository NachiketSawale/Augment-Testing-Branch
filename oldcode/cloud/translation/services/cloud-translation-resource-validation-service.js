/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationResourceValidationService
	 * @description provides validation methods for translation resource entities
	 */
	cloudTranslationModule.service('cloudTranslationResourceValidationService', CloudTranslationResourceValidationService);
	CloudTranslationResourceValidationService.$inject = ['$rootScope', 'platformObjectHelper', 'platformRuntimeDataService', '_', 'cloudDesktopInfoService'];

	function CloudTranslationResourceValidationService($rootScope, objectHelper, platformRuntimeDataService, _, cloudDesktopInfoService) {

		function getReadOnlyFieldsForResourcesWithReference(readonly) {
			const fields = ['ResourceTerm', 'Remark', 'GlossaryRemark', 'ParameterInfo', 'Translatable', 'IsApproved', 'ApprovedBy', 'SubjectFk', 'MaxLength'];
			const fieldObjectArray = [];
			_.each(fields, function (field) {
				fieldObjectArray.push({field: field, readonly: readonly});
			});
			fieldObjectArray.push({field:'IsGlossary', readonly:true});
			return fieldObjectArray;
		}

		// when field is supplied as 3rd param it is called from the control
		this.validateResourceFk = function validateResourceFk(item, value, field) {
			// when a resource has a fk to a another resource then properties above should be readonly
			if (_.isNumber(value) || _.isNumber(item.ResourceFk) && !field) {
				platformRuntimeDataService.readonly(item, getReadOnlyFieldsForResourcesWithReference(true));
			} else {
				platformRuntimeDataService.readonly(item, getReadOnlyFieldsForResourcesWithReference(false));
			}
			return {valid: true};
		};

		this.validateIsApproved = function validateResourceFk(item, value) {
			const userName = cloudDesktopInfoService.read().userInfo ? cloudDesktopInfoService.read().userInfo.UserName : null;
			if (value === true) {
				// set the userName
				item.ApprovedBy = userName;
			} else {
				item.ApprovedBy = null;
			}
			return {valid: true};
		};

		// when field is supplied as 3rd param it is called from the control
		this.validateIsGlossary = function validateIsGlossary(item, value, field) {
			if (value === true || item.IsGlossary === true && !field) {
				platformRuntimeDataService.readonly(item, [{field: 'ResourceFk', readonly: true}]);
			} else {
				platformRuntimeDataService.readonly(item, [{field: 'ResourceFk', readonly: false}]);
			}
			return {valid: true};
		};

		this.validateIsChanged = function (item) {
			platformRuntimeDataService.readonly(item, [{field: 'Ischanged', readonly: !item.Ischanged}]);
			$rootScope.$emit('translation.entityChangedFromGrid', item);
			return {valid: true};
		};

		this.getResourceFkProcessor = function () {
			return {processItem: this.validateResourceFk};
		};

		this.getIsGlossaryProcessor = function () {
			return {processItem: this.validateIsGlossary};
		};

		this.getIsChangedProcessor = function () {
			return {processItem: this.validateIsChanged};
		};
	}
})(angular);
