(function (angular) {
	'use strict';

	angular.module('platform').directive('platformTextareaHandler', handler);

	handler.$inject = ['_'];

	function handler(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs) {

				let minHeight = '40px';
				let maxHeight = '250px';

				let inGrid = !_.isUndefined(attrs.grid);
				let config = inGrid ? scope.config : (attrs.config ? scope.$eval(attrs.config) : null);
				let options = (inGrid ? scope.options : (attrs.options ? scope.$eval(attrs.options) : (config ? config.options : null)));
				if (!options){
					options = {};
				}

				_.set(options, 'type', _.get(options, 'type', 'default'));
				_.set(options, 'useMaxHeight', _.get(options, 'useMaxHeight', false));

				elem.on('input', function () {
					resizeTextArea(this);
				});

				scope.$watch(attrs.ngModel, function () {
					resizeTextArea(elem[0]);
				});

				const resizeObserver = new ResizeObserver(entries => { // jshint ignore: line
					for (let entry of entries) {
						resizeTextArea(entry.target);
					}
				});

				resizeObserver.observe(elem[0]);

				function resizeTextArea(textarea) {
					const style = textarea.style;
					style.minHeight = minHeight;

					if (options.type === 'default') {
						style.height = minHeight;
						style.height = `${textarea.scrollHeight + 4}px`;
						style.resize = 'none';

						if (options.useMaxHeight === true) {
							style.maxHeight = maxHeight;
						}
					} else if (options.type === 'resizable') {
						if (options.useMaxHeight === true) {
							style.maxHeight = maxHeight;
						}
					}
				}
			}
		};
	}
})(angular);