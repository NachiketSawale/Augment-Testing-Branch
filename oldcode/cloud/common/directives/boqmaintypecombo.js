/**
 * Created by joshi on 15.07.2014.
 */
(function () {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name lookupSimpleCombo
	 * @requires  lookupDataService
	 * @description ComboBox to select lookup data
	 */
	angular.module('cloud.common').directive('sampleTypeCombo', ['boqMainBoqTypeService', function (boqMainBoqTypeService) {

		// var template = '<select class="form-control" data-ng-model="ngModel" data-ng-options="item[displayMember] for item in items"><option value="" ng-hide="ngModel">{{ ngModel[displayMember]  || "no matches" }}</option></select>';
		var template = '<select class="form-control" data-ng-model="selectedItem" data-ng-options="item[displayMember] for item in items"><option value="" ng-hide="selectedItem">{{ selectedItem[displayMember]  || "no matches" }}</option></select>';

		return {

			restrict: 'A',

			scope: {
				ngModel: '='

			},

			template: template,

			link: link

		};

		function link(scope/*, element, attrs*/) {

			scope.displayMember = 'description';
			scope.cacheWish = 0; //todo what is cacheWish ?
			scope.selectedItem = {};

			// var keyName = Object.keys(scope.items[0])[0];
			var keyName = 'id';

			// load items list
			boqMainBoqTypeService.loadData().then(function () {
				scope.items = boqMainBoqTypeService.getBoqType();
				console.log('from new common type directive list...' + scope.items);

				if (angular.isObject(scope.ngModel)) {
					scope.selectedItem = scope.ngModel;
				} else {
					// search item by id
					for (var i = 0, len = scope.items.length; i < len; i++) {
						if (scope.items[i][keyName] === scope.ngModel) {
							scope.selectedItem = scope.items[i];
							break;
						}
					}
				}
			});
//            lookupDataService.load(scope.lookupType, scope.cacheWish).then(function (data) {
//                scope.items = data;
//
//                if (angular.isObject(scope.ngModel)) {
//                    scope.selectedItem = scope.ngModel;
//                }
//                else
//                {
//                    // search item by id
//                    for (var i = 0, len = scope.items.length; i < len; i++ )  {
//                        if (scope.items[i][keyName] == scope.ngModel) {
//                            scope.selectedItem = scope.items[i];
//                            break;
//                        }
//                    }
//                }
//
//            });

			scope.$watch('selectedItem', function (selectedItem) {

				if (selectedItem) {
					var modelValue;
					if (angular.isObject(scope.ngModel)) {
						modelValue = scope.selectedItem;
					} else {
						modelValue = selectedItem[keyName];
					}
					if (modelValue) {
						scope.ngModel = modelValue;
					}
				}
			}, true);

		}

	}]);
})();
