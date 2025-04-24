/**
 * Created by wui on 1/2/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerMarkerService', [
		'platformModalFormConfigService',
		'platformTranslateService',
		'basicsCommonDrawingUtilitiesService',
		function (platformModalFormConfigService,
			platformTranslateService,
			basicsCommonDrawingUtilitiesService) {
			var service = {
				settings: new MarkerSetting()
			};

			function MarkerSetting() {
				var defaultColor = new basicsCommonDrawingUtilitiesService.RgbColor(255, 0, 0);
				this.color = basicsCommonDrawingUtilitiesService.rgbColorToInt(defaultColor);
				this.lineWidth = 1;
				this.fontStyle = new FontStyle();
			}

			function FontStyle() {
				this.size = 12;
			}

			service.getSettingsFormConfig = function () {
				return {
					fid: 'model.wdeviewer.marker.config',
					showGrouping: true,
					groups: [
						{
							gid: 'marker',
							header$tr$: 'model.wdeviewer.marker.groupTitle',
							isOpen: true,
							sortOrder: 100
						}
					],
					rows: [
						{
							gid: 'marker',
							label$tr$: 'model.wdeviewer.marker.color',
							type: 'color',
							model: 'color',
							visible: true,
							sortOrder: 100,
							readonly: false
						},
						{
							gid: 'marker',
							label$tr$: 'model.wdeviewer.marker.lineWidth',
							// type: 'integer',
							type: 'directive',
							directive: 'line-width-number-slider',
							model: 'lineWidth',
							visible: true,
							sortOrder: 100,
							readonly: false
						}
					]
				};
			};

			service.showSettingsConfigDialog = function () {
				var dataItem = angular.copy(service.settings);
				var configDialogOptions = {
					title: 'model.wdeviewer.marker.configTitle',
					formConfiguration: [],
					dataItem: dataItem
				};

				configDialogOptions.formConfiguration = service.getSettingsFormConfig();

				platformTranslateService.translateFormConfig(configDialogOptions.formConfiguration);

				return platformModalFormConfigService.showDialog(configDialogOptions).then(function (result) {
					if (result.ok) {
						service.settings = result.data;
					}

					return result;
				});
			};

			return service;
		}
	]);

	// TODO -yew, should use Slider
	angular.module(moduleName).directive('lineWidthNumberSlider', [
		function () {
			return {
				restrict: 'A',
				template: '<input type="number" step="1" data-ng-model="entity.lineWidth" min="1" max="100" style="width: 100%">',
				require: 'ngModel',
				scope: {
					entity: '='
				},
				// link: function ($scope, $element, $attr, ngModelCtrl) {
				link: function () {
				}
			};
		}
	]);

})(angular);
