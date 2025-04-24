(function (angular) {

	'use strict';

	angular.module('platform').directive('platformDateInput', ['dateParser', function (dateParser) {

		return {
			restrict: 'A',

			scope: {
				controlOptions: '=',
				dt: '=ngModel'
			},

			replace: false,

			transclude: false,

			// templateUrl: globals.appBaseUrl + 'app/templates/datepicker.html',
			templateUrl: globals.appBaseUrl + 'cloud.common/templates/dateinput.html',

			link: linker

		};

		function linker(scope, element, attrs) {

			// datepicker settings (see also https://github.com/angular-ui/bootstrap/tree/master/src/datepicker/docs)

			scope.today = function () {
				scope.dt = new Date();
			};
			// scope.today();

			scope.clear = function () {
				scope.dt = null;
			};

			scope.open = function ($event) {
				$event.preventDefault();
				$event.stopPropagation();
				scope.opened = true;
			};
			scope.opened = false;

			scope.dateOptions = {
				formatYear: 'yy',
				startingDay: 1,
				showWeeks: false
			};

			scope.initDate = new Date();
			// valid formats see https://docs.angularjs.org/api/ng/filter/date
			// scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
			scope.format = userSettings.dateFormatAngular;	//  scope.formats[2];

			scope.$watch('dt', function () {
				if (angular.isString(scope.dt)) {
					scope.dt = dateParser.parse(scope.dt, scope.format) || new Date(scope.dt);
				}
			});
			// check that element will be destroyed
			element.on('$destroy', function () {
				// console.log("platformDatepicker destroyed");
			});

		}

	}]);

})(angular);
