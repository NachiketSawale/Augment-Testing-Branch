(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.evaluationschema';

	angular.module(moduleName).factory('businesspartnerEvaluationschemaHeaderValidationService',
		['$translate','$timeout','platformPropertyChangedUtil',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($translate,$timeout,platformPropertyChangedUtil) {

				return function(dataService){

					return {
						validateModel: function () {
							return true;
						},
						validateDescriptionInfo: function () {
							return true;
						},
						validateSorting: function () {
							return true;
						},
						validateIsDefault: function (currentItem, value, field) {
							platformPropertyChangedUtil.onlyOneIsTrue(dataService,currentItem, value, field);
							return {apply: value,valid: true};
						}
					};
				};
			}
		]);

})(angular);

