(function () {
	/* global globals, _ */
	'use strict';
	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainOenPictureService', ['$http', '$translate', 'platformDataServiceFactory', 'platformListSelectionDialogService', 'platformDialogService', 'boqMainOenService', 'boqMainLineTypes',
		function ($http, $translate, platformDataServiceFactory, platformListSelectionDialogService, platformDialogService, boqMainOenService, boqMainLineTypes) {
			return { init: function(scope, boqMainService) {
				const baseUrl = globals.webApiBaseUrl + 'boq/main/oen/picture/';
				var $scope;
				let serviceOptions = {
					flatLeafItem: {
						serviceName: 'boqMainOenPictureService',
						entityRole: {
							leaf: {
								itemName: 'OenGraphic',
								parentService: boqMainService, // todo: Controller inject boq main service
								doesRequireLoadAlways: true
							}
						},
						httpCreate: {route: baseUrl, endCreate: 'create'},
						httpRead: {
							route: baseUrl,
							endRead: 'graphics',
							initReadData: function (readData) {
								let selectItem = boqMainService.getSelected();
								if (selectItem) {
									readData.filter = '?boqHeaderId=' + selectItem.BoqHeaderFk + '&boqItemId=' + selectItem.Id;
								}
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									let selectedBoqItem = boqMainService.getSelected();
									if (selectedBoqItem) {
										creationData.Id = selectedBoqItem.BoqHeaderFk;
									}
								},
								handleCreateSucceeded: function (newGraphic) {
									newGraphic.Description = removeExtension($scope.fileName);
									newGraphic.Format = $scope.fileType;
								}
							}
						}
					}
				};
				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
				let service = serviceContainer.service;

				service.createItemExtended = function (scope) {
					$scope = scope;
					let selectedBoqItem = boqMainService.getSelected();
					if (selectedBoqItem.BoqLineTypeFk !== boqMainLineTypes.root) {
						openDialog();
					}
					else {
						scope.createItemOrigin();
						boqMainService.markItemAsModified(selectedBoqItem);
					}
				};

				service.deleteItemExtended = function (scope) {
					let selectedBoqItem = boqMainService.getSelected();
					if(selectedBoqItem.BoqLineTypeFk === boqMainLineTypes.root) {
						$http.get(baseUrl + 'candeletegraphic?oenGraphicFk=' + scope.currentItem.Id).then(function(response) {
							if(response.data === false) {
								platformDialogService.showInfoBox('Can not delete the graphic as it is already in use.');
							} else if (response.data === true) {
								scope.deleteItemOrigin();
								boqMainService.markItemAsModified(selectedBoqItem);
								service.markEntitiesAsModified(scope.currentItem);
							}
						});
					} else if (selectedBoqItem.BoqLineTypeFk !== boqMainLineTypes.root) {
						scope.deleteItemOrigin();
						boqMainService.markItemAsModified(selectedBoqItem);
						service.markEntitiesAsModified(scope.currentItem);
					}
				};

				function removeExtension(filename) {
					return filename.substring(0, filename.lastIndexOf('.')) || filename;
				}

				const nodeColumnsDef = [{
					id: 'Id',
					formatter: 'description',
					name: 'Id',
					field: 'Id',
					width: 70,
					visible: true
				}, {
					id: 'Description',
					formatter: 'description',
					name: 'Description',
					field: 'Description',
					width: 150
				}, {
					id: 'Format',
					formatter: 'description',
					name: 'Format',
					field: 'Format',
					width: 150
				},
				];

				function openDialog() {
					let selectedBoqItem = boqMainService.getSelected();
					let graphics = [];
					let selectedGraphics = [];
					$http.get(globals.webApiBaseUrl + 'boq/main/oen/picture/getgraphics?boqHeaderId=' + selectedBoqItem.BoqHeaderFk + '&boqItemId=' + selectedBoqItem.Id).then(function (response) {
						for (var k = 0; k < response.data.length; k++) {
							graphics.push(response.data[k]);
						}
						platformListSelectionDialogService.showDialog( {
							dialogTitle: $translate.instant('boq.main.oen.graphicDialogTitle'),
							idProperty: 'Id',
							displayNameProperty: 'Description',
							allItems: graphics,
							value: selectedGraphics,
							availableColumns: nodeColumnsDef,
							selectedColumns: nodeColumnsDef
						}).then(function (result) {
							if(result.ok === true) {
								boqMainService.markItemAsModified(selectedBoqItem);

								// Ensures the default behaviour after the creation of new objects
								_.forEach(result.value, function(selectedGraphicObject) {
									serviceContainer.data.addEntityToCache(       selectedGraphicObject, serviceContainer.data);
									serviceContainer.data.handleOnCreateSucceeded(selectedGraphicObject, serviceContainer.data);
								});

								$scope.blobData = service.getList();
							}
						});
					});
				}

				boqMainOenService.tryDisableContainer(scope, boqMainService, false);

				return service;
			}};
		}]);
})();



