/**
 * Created by Frank Baedeker on 30.05.2016.
 */

(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationTranslationValidationService
	 * @description provides validation methods for translation translation entities
	 */
	cloudTranslationModule.service('cloudTranslationTranslationFieldValidationService', CloudTranslationTranslationFieldValidationService);
	CloudTranslationTranslationFieldValidationService.$inject = ['platformRuntimeDataService'];
	function CloudTranslationTranslationFieldValidationService(platformRuntimeDataService) {
		/* jshint -W040 */ // No calidation of this rule

		this.validateIsChanged = function (item) {
			platformRuntimeDataService.readonly(item, [{field: 'Ischanged', readonly: !item.Ischanged}]);
			return {valid: true};
		};

		this.getIsChangedProcessor = function () {
			return {processItem: this.validateIsChanged};
		};
	}
})(angular);
