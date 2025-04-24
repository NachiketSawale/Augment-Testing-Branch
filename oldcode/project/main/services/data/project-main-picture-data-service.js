(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'project.main';
	const projectModule = angular.module(moduleName);

	projectModule.factory('projectMainPictureDataService', ['_', '$injector', '$rootScope', 'platformDataServiceFactory',
		'platformModalService', 'platformDataServiceProcessDatesBySchemeExtension', 'projectMainService',

		function (_, $injector, $rootScope, platformDataServiceFactory, platformModalService,
			platformDataServiceProcessDatesBySchemeExtension, projectMainService) {

			const factoryOptions = {
				flatLeafItem: {
					module: projectModule,
					serviceName: 'projectMainPictureDataService',
					entityNameTranslationID: 'project.main.photoContainerTitle',
					httpCreate: {route: globals.webApiBaseUrl + 'project/main/picture/', endCreate: 'createphoto'},
					httpRead: {
						route: globals.webApiBaseUrl + 'project/main/picture/',
						usePostForRead: true,
						endRead: 'listbyparent',
						initReadData: function initReadData(readData) {
							let selected = projectMainService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ProjectPictureDto',
						moduleSubModule: 'Project.Main'
					})],
					actions: { delete: true, create: 'flat' },
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								let selected = projectMainService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					entityRole: {
						leaf: {itemName: 'DependingDto', parentService: projectMainService}
					}
				}
			};
			const serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			serviceContainer.service.createItem = function () {
				let result = {};
				$rootScope.$emit('photoAdded', result);
				if (!result.processed) {
					platformModalService.showMsgBox('Open container: "photo view" to add photos', 'Adding photos failed', 'info');
				}
			};

			serviceContainer.service.deleteEntities = function () {
				$rootScope.$emit('photoDeleted', serviceContainer.service.load);
			};

			serviceContainer.service.getSelectedSuperEntity = function getSelectedSuperEntity() {
				return projectMainService.getSelected();
			};

			function setDefaultPicture() {
				let pictures = serviceContainer.service.getList();
				if (!_.isNil(pictures) && pictures.length > 0) {
					let pic = _.find(pictures, {IsDefault: true});
					if(!_.isNil(pic)) {
						serviceContainer.service.setSelected(pic);
					}
				}
			}

			serviceContainer.service.onInitFilesDragAndDropCallBack = function (files) {
				$injector.get('projectMainPictureSettingService').importFile(files[0]);
			};

			serviceContainer.service.registerListLoaded(setDefaultPicture);

			return serviceContainer.service;
		}]);
})(angular);
