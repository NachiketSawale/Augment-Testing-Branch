(function (angular) {
	'use strict';

	function basicsWorkflowResizeGridDirective(platformGridAPI) {
		return {
			restrict: 'A',
			compile: function () {
				return {
					pre: function ($scope, iElement, attr) {

						//grid resize after splitter is moving
						var splitter = iElement.closest('.k-splitter').data('kendoSplitter');
						if (splitter) {
							splitter.bind('resize', onResize);
						}

						function onResize() {
							var propName = attr.basicsWorkflowResizeGridDirective ? attr.basicsWorkflowResizeGridDirective : 'gridId';
							platformGridAPI.grids.resize($scope[propName]);
						}

						$scope.$on('$destroy', function () {
							if (splitter) {
								splitter.unbind('resize', onResize);
								splitter = null;
							}
						});
					}
				};
			}
		};
	}

	basicsWorkflowResizeGridDirective.$inject = ['platformGridAPI'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowResizeGridDirective', basicsWorkflowResizeGridDirective);
})(angular);
