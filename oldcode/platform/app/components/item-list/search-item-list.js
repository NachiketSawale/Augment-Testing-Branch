(function () {
	'use strict';
	function searchItemListDirective() {
		return {
			restrict: 'A',
			scope: {
				groupedList: '=',
				name: '='
			},
			template: `<div class='margin-top-ld margin-bottom-ld'><input type='text' ng-model='searchmodule' ng-change='search(searchmodule)' id='searchmodule' class='form-control'
							placeholder='{{"cloud.common.taskBarSearch" | translate}}' /></div>`,
			link: function (scope) {
				scope.search = function (searchmodule) {
					let searchString = searchmodule.toLowerCase();
					scope.groupedList.forEach((item) => {
						let itemList = item[scope.name];
						let hideCount = 0;
						itemList.forEach((itemChild) => {
							let _DisplayWizardName = itemChild.hasOwnProperty('name') ? itemChild.name.toLowerCase() : '';
							if (_DisplayWizardName.includes(searchString)) {
								itemChild.hide = itemChild.pinned ? itemChild.pinned : false;
							}
							else {
								itemChild.hide = true;
							}
							if (itemChild.hide) {
								hideCount++;
							}
						});
						item.hide = itemList.length === hideCount;
					});
				};
			},
		};
	}
	angular.module('platform').directive('platformSearchItemListDirective', [searchItemListDirective]);
})();
