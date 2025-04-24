/**
 * Created by wui on 11/4/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerPrintingController', ['$scope', 'modelData', 'modelWdeViewerDimensionType', '$injector', 'modelWdeViewerPrintingSections',
		function ($scope, modelData, modelWdeViewerDimensionType, $injector, modelWdeViewerPrintingSections) {
			modelWdeViewerPrintingSections.init(modelData);
			var sections = modelWdeViewerPrintingSections.sections;

			$scope.sectionContents = sections;
			$scope.data = {
				header: {
					left: '',
					center: '',
					right: ''
				},
				footer: {
					left: '',
					center: '',
					right: ''
				},
				headerSection: {
					left: [],
					center: [],
					right: []
				},
				footerSection: {
					left: [],
					center: [],
					right: []
				},
				legends: modelData.legends,
				showLegend: true,
				isShowLegend: $injector.get('modelWdeViewerPrintingService').isShowLegend,
				pageOrientation: 'landscape',
				pageSize: 'A4',
				useVectorPublisher: false
			};

			$scope.config = {
				header: {
					title: 'header',
					title$tr$: 'model.wdeviewer.header',
					groups: [
						{
							items: sections
						}
					]
				},
				footer: {
					title: 'footer',
					title$tr$: 'model.wdeviewer.footer',
					groups: [
						{
							items: sections
						}
					]
				}
			};

			$scope.apply = function () {
				$scope.data.legends = $scope.data.legends.filter(function (legend) {
					return legend.name || legend.value;
				});

				$scope.$close({
					success: true,
					data: $scope.data
				});
			};
		}
	]);

})(angular);