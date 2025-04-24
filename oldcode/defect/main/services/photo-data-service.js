/**
 * Created by pel on 7/12/2018.
 */
/* global  */
(function (angular) {
	'use strict';
	var moduleName = 'defect.main';

	/**
     * @ngdoc service
     * @name defectMainPhotoDataService
     * @function
     * @requireds platformDataServiceFactory
     *
     * @description Provide activity data service
     */
	/* jshint -W072 */
	angular.module(moduleName).factory('defectMainPhotoDataService', [
		'platformDataServiceFactory', 'defectMainHeaderDataService', 'globals','basicsCommonServiceUploadExtension',
		function (platformDataServiceFactory, defectMainHeaderDataService, globals,basicsCommonServiceUploadExtension) {

			var serviceOptions = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'defectMainPhotoDataService',
					entityRole: {
						leaf: {
							itemName: 'DfmPhoto',
							parentService: defectMainHeaderDataService,
							doesRequireLoadAlways: true
						}
					},
					httpCreate: {route: globals.webApiBaseUrl + 'defect/main/photo/', endCreate: 'create'},
					httpRead: {route: globals.webApiBaseUrl + 'defect/main/photo/', endRead: 'list'},
					presenter: {list: {}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			var uploadOptions = {
				uploadServiceKey: 'defect-photo',
				uploadConfigs: {SectionType: 'Defect'},
				needConsiderFileType:false
			};

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);


			serviceContainer.service.disablePrev = function(){
				return canContactNavigate();
			};

			serviceContainer.service.disableNext = function(){
				return canContactNavigate('forward');
			};
			function canContactNavigate(type) {
				type = type || 'backward';
				var select = serviceContainer.service.getSelected();
				var list = serviceContainer.service.getList();
				if (!select || !select.Id || list <= 0) {
					return false;
				}
				var index = type === 'forward' ? list.length - 1 : 0;
				return select === list[index];
			}

			return serviceContainer.service;
		}
	]);
})(angular);

