(function () {
	'use strict';

	angular.module('platform').directive('platformSimpleGridImage', platformSimpleGridImage);

	platformSimpleGridImage.$inject = ['$compile'];

	function platformSimpleGridImage($compile) {
		return {
			restrict: 'A',
			link: function (scope, elem) {
				var imgTemplate = '<img src="{{row[col.field]}}" style="{{inlineStyle}}" class="{{col.cssClass}}" />';
				var settings = scope.col ? scope.col.options : '';
				scope.inlineStyle = '';

				if (settings) {
					if (settings.width) {
						scope.inlineStyle += 'width: ' + settings.width + ';';
					}
					if (settings.height) {
						scope.inlineStyle += 'height: ' + settings.height + ';';
					}
				}

				elem.replaceWith($compile(imgTemplate)(scope));
			}
		};
	}

})();