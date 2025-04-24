(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @description
	 * DropDown to select an item from a list
	 */

	angular.module('platform').directive('platformEditDropDown', ['_', '$injector', function (_, $injector) {

		//   var template = '<div class="input-group" style="width:50%;"> \
		//                     <input type="text" class="form-control" ng-model="ngModel" data-ng-readonly="controlOptions.disabled || false" style="width:70%;"> \
		//                     <div class="input-group-btn " style="float: left; width: 30%; position: relative; vertical-align: top;"> \
		//                        <button type="button" class="btn btn-default dropdown-toggle" style="line-height: 1.35;" data-toggle="dropdown" data-ng-disabled="controlOptions.disabled || false"><span class="caret"></span></button> \
		//                        <ul class="dropdown-menu dropdown-menu-right" role="menu" style="minWidth:440px"> \
		//                           <li ng-repeat="item in items" class="input-lg"><a href="#" ng-click="changeItem(item)">{{item[displayMember]}}</a></li> \
		//                        </ul> \
		//                     </div> \
		//                   </div>';

		var template = [
			'<div class="input-group">',
			'  <input type="text" class="form-control" ng-model="ngModel" ng-change="ngChange()" data-ng-readonly="controlOptions.disabled || false">',
			'  <div class="input-group-btn " style="vertical-align: top;">',
			'    <button type="button" class="btn btn-default dropdown-toggle" style="line-height: 1.35;" data-toggle="dropdown" data-ng-disabled="controlOptions.disabled || !entity.Id"><span class="caret"></span></button>',
			'    <ul class="dropdown-menu dropdown-menu-right" role="menu">',
			'      <li ng-repeat="item in items"><button ng-click="changeItem(item);ngChange()">{{item[displayMember]}}</button></li>',
			'    </ul>',
			'  </div>',
			'</div>'].join('');

		return {
			restrict: 'A',
			scope: {
				ngModel: '=',
				controlOptions: '=?',
				options: '=?',
				entity: '=',
				ngChange: '&'
			},
			template: template,
			link: link
		};

		function link(scope) {
			if (!scope.options) {
				scope.options = scope.controlOptions.options ? scope.controlOptions.options : scope.controlOptions;
			}

			if (_.isUndefined(scope.options)) {
				throw new Error('platformDropDown: parameter options|controlOptions undefined!');
			}

			scope.displayMember = scope.options.displayMember;
			scope.items = [];

			// get items from a service
			if (angular.isString(scope.options.serviceName)) {
				var dataService = $injector.get(scope.options.serviceName);

				dataService.loadData().then(function () {
					scope.items = dataService.getList();
				});
			}
			else {
				scope.items = scope.options.items;
			}

			scope.changeItem = function (newItem) {
				scope.ngModel = newItem[scope.displayMember];
			};
		}
	}]);
})(angular);

