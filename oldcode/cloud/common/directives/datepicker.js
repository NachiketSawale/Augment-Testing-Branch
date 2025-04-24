(function (angular) {

	'use strict';

   // OBSOLET use dateinput instead !

	angular.module('platform').directive('platformDatepicker', [function () {


		return {
			restrict: 'A',

			scope: {
				dt: '=ngModel'
			},

			replace: false,

			transclude: false,

			// templateUrl: globals.appBaseUrl + 'app/templates/datepicker.html',
			templateUrl: globals.appBaseUrl + 'cloud.common/templates/datepicker.html',

			link: linker

		};

		function linker(scope, element/*, attrs*/) {


			// datepicker settings (see also https://github.com/angular-ui/bootstrap/tree/master/src/datepicker/docs)

			scope.today = function () {
				scope.dt = new Date();
			};
			// scope.today();

			scope.clear = function () {
				scope.dt = null;
			};

			// Disable weekend selection
			//scope.disabled = function (date, mode) {
			//	return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
			//};

			//scope.toggleMin = function () {
			//	scope.minDate = scope.minDate ? null : new Date();
			//};
			// scope.toggleMin();

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

			// check that element will be destroyed
			element.on('$destroy', function () {
			   // console.log("platformDatepicker destroyed");
			});

		}

	}]);

})(angular);
