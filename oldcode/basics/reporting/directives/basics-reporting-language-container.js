((angular => {
	'use strict';

	angular.module('basics.reporting').directive('basicsReportingLanguageContainer', basicsReportingLanguageContainer);
	basicsReportingLanguageContainer.$inject = ['$compile', 'basicsReportingLanguageService'];

	function basicsReportingLanguageContainer($compile, basicsReportingLanguageService) {
		return {
			restrict: 'AE',
			scope: {
				options:'=ngModel'
			},
			link: function(scope, elem) {
				scope.optionsLanguageItems = {
					type: 1,
					activeValue: basicsReportingLanguageService.getLanguageFromStorage(),
					fn: function(item) {
						basicsReportingLanguageService.saveCommonFlagStatusInLocalStorage(item.Culture);
					}
				};

				Object.assign(scope.options, scope.optionsLanguageItems);

				let template = '<div language-item-list data-config="options"></div>';

				function renderHTMLMarkup() {
					elem.append($compile(template)(scope));
				}

				renderHTMLMarkup();
			}
		};
	}
}))(angular);
