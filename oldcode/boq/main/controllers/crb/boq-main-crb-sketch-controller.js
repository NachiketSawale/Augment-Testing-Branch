(function () {
	/* global globals, _ */
	'use strict';

	var angularModule = angular.module('boq.main');

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angularModule.controller('boqMainCrbSketchController', ['$scope', '$translate', 'boqMainService', 'boqMainCrbSketchDataService',
		function ($scope, $translate, boqMainService, boqMainCrbSketchDataService) {
			function tryDisableContainer(scope, boqMainService) {
				function tryShowWhiteboard() {
					var boqStructure = boqMainService.getStructure();
					if (boqStructure && boqStructure.BoqStandardFk) {
						if (boqMainService.isCrbBoq() && boqMainService.isWicBoq() && !boqMainService.isCopySource) {
							scope.getUiAddOns().getWhiteboard().setVisible(false);
						} else {
							scope.getUiAddOns().getWhiteboard().showInfo($translate.instant('boq.main.crbNpkExclusiveFunc'));
						}
					}
				}

				tryShowWhiteboard();

				boqMainService.selectedBoqHeaderChanged.register(tryShowWhiteboard);
				boqMainService.boqStructureReloaded.register(tryShowWhiteboard);
				scope.$on('$destroy', function () {
					boqMainService.selectedBoqHeaderChanged.unregister(tryShowWhiteboard);
					boqMainService.boqStructureReloaded.unregister(tryShowWhiteboard);
				});
			}

			boqMainCrbSketchDataService.initServiceContainer($scope, boqMainService);
			tryDisableContainer($scope, boqMainService);
		}
	]);

	angularModule.factory('boqMainCrbSketchDataService', ['platformDataServiceFactory',
		function (platformDataServiceFactory) {
			var serviceContainer = null;
			var scope;

			return {
				initServiceContainer: function ($scope, boqMainService) {
					scope = $scope;

					if (_.isObject(serviceContainer)) {
						var serviceOptions =
							{
								flatLeafItem:
									{
										entityRole: {leaf: {parentService: boqMainService, doesRequireLoadAlways: true}}, // doesRequireLoadAlways: The httpRead only is executed because of it. Anything else is missing.
										httpRead:
											{
												route: globals.webApiBaseUrl + 'boq/main/crb/', endRead: 'sketch',
												initReadData: function (readData) {
													var currentBoqItem = boqMainService.getSelected();
													if (_.isObject(currentBoqItem)) {
														readData.filter = '?drawingId=' + (currentBoqItem.DrawingId === null ? '' : currentBoqItem.DrawingId);
													}
												}
											},
										presenter: {
											list: {
												incorporateDataRead: function (readData) {
													scope.sketchContent = readData;
												}
											}
										}
									}
							};

						serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
					}

					return serviceContainer;
				}
			};
		}
	]);
})();
