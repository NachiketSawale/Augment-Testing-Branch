(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCustomizePropertyFilterService
	 * @function
	 *
	 * @description
	 * The basicsCustomizePropertyFilterService manages hidden, i.e. filtered, properties of the different types
	 */

	angular.module('basics.customize').service('basicsCustomizeTranslationProcessor', BasicsCustomizeTranslationProcessor);

	BasicsCustomizeTranslationProcessor.$inject = ['platformTranslateService', '$translate'];

	function BasicsCustomizeTranslationProcessor( platformTranslateService, $translate ) {

		this.processItem = function processItem(dataType) {

			dataType.Type =  $translate.instant('basics.customize.' + dataType.Type);
			dataType.ModuleName= $translate.instant('basics.customize.' + dataType.ModuleName);
		};

	}
})(angular);