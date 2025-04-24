(function (angular) {
	'use strict';

	const modulename = 'platform';
	const directiveName = 'platformResizeObserver';

	angular.module(modulename).directive(directiveName, ['_', function (_) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem, attrs) {
				let wrapperFunc, rso, rs;

				// rib constructor object to wrap the external framework object
				function ResizeSensorObject(element, callback) {
					let that = this;
					let funcWrapper = function (rs, element) {
						// rs = the external framework object
						// element = the element to observe resize events
						callback.call(this, that, element);
					};

					rs = new ResizeSensor(element, funcWrapper); // jshint ignore:line
				}

				// rib interface to the extrernal framework
				ResizeSensorObject.prototype.detach = function () {
					rs.detach();
				};

				wrapperFunc = scope.$eval(attrs.platformResizeObserver);
				rso = new ResizeSensorObject(elem, wrapperFunc);

				scope.$on('$destroy', function () {
					if (!_.isUndefined(rso)) {
						rso.detach();
					}
				});
			}
		};
	}]);
})(angular);
