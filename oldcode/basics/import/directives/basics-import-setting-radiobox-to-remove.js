/**
 * Created by chk on 11/18/2016.
 */

// todo chk: please move this file to the material module and use a custom wizard site to show the form in the import wizard

(function (angular) {

	'use strict';
	angular.module('basics.import').directive('basicsImportSettingDialog', ['$timeout',
		function ($timeout) {

			var template = '<div data-ng-repeat="item in items"> \
								<input id="{{item.Id}}" name="importSetting" type="radio" data-ng-value="{{item.Selected}}" data-ng-click="checkedFun(item.Id)" data-ng-model="selectedMember" />\
								<label for="{{item.Id}}">{{item[displayMember] | translate}}</label> \
							</div>';

			return {
				restrict: 'A',
				require:'ngModel',
				scope: {
					ngModel: '=',
					options: '='
				},
				template: template,
				link:link
			};
			function link(scope,elem,attrs,ctrl){
				scope.displayMember = scope.options.displayMember;
				scope.selectedMember = true;



				scope.items = [];
				if (scope.options.predicate) {
					angular.forEach(scope.ngModel, function(item, key) {
						if (scope.options.predicate(item)) {
							scope.items.push(item);
						}
					});
				}
				else
				{
					scope.items = scope.ngModel;
				}
				for(var i=0; i<scope.items.length; i++){
					scope.items[i].Id = i;
				}

				scope.checkedFun = function(id){
					_.forEach(scope.items,function(item){
						item.Selected = item.Id === id;
					});
				};
				$timeout(function() {
					ctrl.$setViewValue(scope.ngModel);
					ctrl.$render();
				}, 0);
			}
		}]);
})((angular));
