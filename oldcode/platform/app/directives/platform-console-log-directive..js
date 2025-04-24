((angular => {
	'use strict';

	let modulename = 'platform';
	let directiveName = 'platformConsoleLog';

	/**
	 * @ngdoc function
	 * @name platformConsoleLog
	 * @function
	 * @description Outputs the object passed as error to the console, along with a stack trace of who set it.
	 */
	angular.module(modulename).directive(directiveName, directiveFn);

	directiveFn.$inject = [];

	function directiveFn() {
		return ({
			restrict: 'AE',
			scope: true,
			link: function (scope, element, attrs) {
				let error;
				let propName = attrs.error || 'error';

				function showConsoleError(message, value){
					let stack = getStack();
					console.log(message);
					console.table(value);
					console.log(stack);
				}

				Object.defineProperty(scope.$parent, propName, {
					get: () => error,
					set: value => {
						showConsoleError('New error set to the longtext editor container.', value);
						error = value;
					},
				});

				function getStack () {
					try {
						// noinspection ExceptionCaughtLocallyJS
						throw new Error('foo');
					} catch (e) {
						return e.stack || e;
					}
				}
			}
		});
	}
})(angular));