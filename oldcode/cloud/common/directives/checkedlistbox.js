(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 * Scrollable list with checkbox items
	 */

	angular.module('platform').directive('platformCheckedListbox', [ '$timeout', function ($timeout) {

		var template = '<div class="form-col-checkbox-list"> \
								<div data-ng-repeat="item in items"> \
									<input id="{{item.Id}}" type="checkbox" data-ng-model="item[selectedMember]" /><label for="{{item.Id}}">{{item[displayMember] | translate}}</label> \
								</div> \
							</div>';

		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				ngModel: '=',  // list of objects (must have a unique Id member!)
				options: '='   // displayMember, selectedMember, (predicate)
			},
			template: template,
			link: link
		};

		function link(scope, elem, attrs, ctrl) {

			scope.displayMember = scope.options.displayMember;
			scope.selectedMember = scope.options.selectedMember || 'selected';

			scope.items = [];
			if (scope.options.predicate) {
				angular.forEach(scope.ngModel, function(item/*, key*/) {
					if (scope.options.predicate(item)) {
						scope.items.push(item);
					}
				});
			}
			else
			{
				scope.items = scope.ngModel;
			}

			$timeout(function() {
				ctrl.$setViewValue(scope.ngModel);
				ctrl.$render();
			}, 0);

		}

	}]);
})(angular);
