/**
 * Created by jim on 6/5/2017.
 */
/* global globals */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	var module = angular.module(modName);
	module.service('defectBlobsDataService', ['defectMainHeaderDataService','platformDataServiceFactory','basicsCommonServiceUploadExtension',
		'basicsLookupdataLookupDescriptorService','$q','$http','ServiceDataProcessDatesExtension',
		function(defectMainHeaderDataService,dataServiceFactory,basicsCommonServiceUploadExtension,basicsLookupdataLookupDescriptorService,
			$q, $http, ServiceDataProcessDatesExtension) {

			var serviceOption ={
				flatLeafItem: {
					module: module,
					serviceName: 'defectBlobsDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'cloud/common/blob/',
						endRead: 'getblobbyid',
						usePostForRead: false,
						initReadData: function (readData) {
							var defectEntity = defectMainHeaderDataService.getSelected();
							if (!!defectEntity && defectEntity.BasBlobsDetailFk) {
								readData.id = defectEntity.BasBlobsDetailFk;
							} else {
								readData.id = -1;
							}
						}
					},
					dataProcessor: [new ServiceDataProcessDatesExtension([ 'DocumentDate'])],
					entityRole: {leaf: {itemName:'BasBlobs', parentService: defectMainHeaderDataService }}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

			return serviceContainer.service;
		}]);

})(angular);

