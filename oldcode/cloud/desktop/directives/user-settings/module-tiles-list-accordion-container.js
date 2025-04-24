(() => {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopModuleTilesListAccordionContainerController', cloudDesktopModuleTilesListAccordionContainerController);
	cloudDesktopModuleTilesListAccordionContainerController.$inject = ['$scope'];

	function cloudDesktopModuleTilesListAccordionContainerController($scope) {
		$scope.modalOptions = {
			minWidth: '400px',
			width: '500px',
			showCloseButton: true,
			showOkButton: true,
			value: {}
		};

		$scope.ok = function() {
			$scope.$close({ok: true, data: $scope.modalOptions.value});
		};

		$scope.cancel = function() {
			$scope.$close({});
		};

		$scope.moduleTileConfig = {
			filterByType: 0,
			clickTabFn: function (selectedItem) {
				$scope.modalOptions.value.moduleTile = selectedItem;
				$scope.modalOptions.value.moduleTile.description = selectedItem.module.displayName + ' / ' + selectedItem.tab.displayName;
			}
		};
	}

	angular.module('cloud.desktop').directive('cloudDesktopModuleTilesListAccordionContainer', cloudDesktopModuleTilesListAccordionContainer);

	cloudDesktopModuleTilesListAccordionContainer.$inject = ['$compile', 'platformDialogService'];

	function cloudDesktopModuleTilesListAccordionContainer($compile, platformDialogService) {
		return {
			restrict: 'AE',
			scope: {
				model: '=',
				options: '='
			},
			link: function(scope, elem) {

				let dialogOption = {
					templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/module-tiles-list-accordion-container.html',
					controller: 'cloudDesktopModuleTilesListAccordionContainerController',
					minWidth: '400px',
					width: '500px',
					showCancelButton: true,
					showOkButton: true
				};

				scope.openDialog = function () {
					platformDialogService.showDialog(dialogOption).then(function(result) {
						if(result.ok) {
							scope.model.moduleTile = result.data.moduleTile;
							scope.model.moduleTile.description = result.data.moduleTile.description;
						}
					});
				};

				let css = scope.options && scope.options.css ? scope.options.css : 'form-control';
				let content =  `<div class="${css}">
										<div data-domain-control data-domain="description" data-model="model.moduleTile.description" data-readonly="true"></div>
										<span class="input-group-btn">
											<button btn-edit class="btn btn-default input-sm control-icons ico-input-lookup lookup-ico-dialog" data-ng-click="openDialog()"></button>
										</span>
									</div>`;

				elem.replaceWith($compile(content)(scope));
			}
		};
	}
})();
