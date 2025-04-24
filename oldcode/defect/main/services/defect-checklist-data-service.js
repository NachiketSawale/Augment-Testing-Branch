/*
   Create by pet on 6/12/2018
 */
/* global globals */
(function (angular) {
	'use strict';
	var modName = 'defect.main';
	var module = angular.module(modName);
	module.service('defectChecklistDataService', ['_','defectMainHeaderDataService', 'platformDataServiceFactory',
		function (_,defectMainHeaderDataService, dataServiceFactory) {

			var setReadonly = function () {
				// if parent satus is readonly, then the form data should not be editable
				if(!_.isNil(defectMainHeaderDataService)){
					var parentSelectItem = defectMainHeaderDataService.getSelected();
					if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
						return false;
					}
				}

				return true;
			};
			var serviceOption = {
				flatNodeItem: {
					module: modName,
					serviceName: 'defectChecklistDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'defect/main/checklist/'
					},
					entityRole: {
						node: {
							itemName: 'DfmChecklist',
							parentService: defectMainHeaderDataService,
							doesRequireLoadAlways: true
						}
					},
					actions: {
						delete: {},
						create: 'flat',
						canCreateCallBackFunc: function () {
							return setReadonly();
						},
						canDeleteCallBackFunc: function () {
							return setReadonly();
						}
					}
				}
			};
			var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;
			service.setReadonly = setReadonly;

			return service;
		}]);

})(angular);
