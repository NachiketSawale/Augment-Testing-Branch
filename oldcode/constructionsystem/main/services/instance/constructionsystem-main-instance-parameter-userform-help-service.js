/**
 * Created by wed on 08/06/2020.
 */

(function constructionSystemMainInstanceParameterUserformHelpServiceDefinition(angular) {

	'use strict';

	angular.module('constructionsystem.main').factory('constructionSystemMainInstanceParameterUserformHelpService', [
		'basicsUserformCommonService',
		function constructionSystemMainInstanceParameterUserformHelpService(
			basicsUserformCommonService
		) {

			return basicsUserformCommonService.createNewInstance();

		}]);
})(angular);

(function constructionSystemMainInstanceParameterUserformPopupHelpServiceDefinition(angular) {

	'use strict';

	angular.module('constructionsystem.main').factory('constructionSystemMainInstanceParameterUserformPopupHelpService', [
		'basicsUserformCommonService',
		function constructionSystemMainInstanceParameterUserformPopupHelpService(
			basicsUserformCommonService
		) {

			return basicsUserformCommonService.createNewInstance();

		}]);
})(angular);