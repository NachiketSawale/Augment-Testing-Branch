/**
 * Created by alina on 28/2/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';
	/**
	 * Similar with ngInclude directive, but it doesn't create a new scope.
	 */
	angular.module(moduleName).directive('basicsMaterialD3Model', ['$sce', '$compile', '$templateRequest',
		/* jshint -W098*/
		function ($sce, $compile, $templateRequest) {
			return {
				restrict:'A',
				scope:{},
				template:'<div class="ms-sv-container-title ms-sv-container-3d" ><span>3D Model</span><div class="toolbar" data-platform-collapsable-list data-ng-model="tools"><div data-platform-menu-list data-list="tools" data-platform-refresh-on="tools.version"></div></div></div><div class="col-md-12 flex-box ms-sv-container-hoops"data-ng-controller="modelViewerHoopsController"data-basics-material-include="model.viewer/partials/model-viewer-hoops-template.html"></div>',
				controller:['$scope', '$element', '$attrs','platformToolbarService', function ($scope, $element, $attrs,platformToolbarService) {

					// todo-wui, test 3d model
					$scope.getContainerUUID = function () {
						return '180C90D476894349B6F9C326C0DFD06D';
					};

					$scope.getContentValue = function (key) {
						var value = '180C90D476894349B6F9C326C0DFD06D';
						switch (key) {
							case 'uuid':
								value = '180C90D476894349B6F9C326C0DFD06D';
								break;
							case 'mode':
								value = 'scs';
								break;
							case 'title':
								value = 'SCS Viewer';
								break;
							case 'defaultView':
								value = '180C90D476894349B6F9C326C0DFD06D';
								break;
						}
						return value;
					};

					$scope.onContentResized = function () {

					};

					$scope.setTools = function (tools) {
						// refactoring of tool items to get the correct order.
						// Should be moved into the controllers, when all cotainers use a base controller
						tools.items = platformToolbarService.getTools($scope.getContainerUUID(), tools.items);
						tools.update = function () {
							$scope.tools.refreshVersion += 1;
						};
						$scope.tools = tools;
					};

					$scope.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [],
						update: function () {
						}
					};
				}]
			};
		}
	]);

})(angular);