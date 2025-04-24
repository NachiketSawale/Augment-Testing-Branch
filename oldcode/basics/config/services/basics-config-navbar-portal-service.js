/**
 * Created by sandu on 17.03.2022.
 */
(function () {

    'use strict';

    var moduleName = 'basics.config';
    var configModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name basicsConfigNavbarPortalService
     * @function
     *
     * @description
     * data service for all NavbarPortal related functionality.
     */
    /* jshint -W072 */ // many parameters because of dependency injection
    configModule.factory('basicsConfigNavbarPortalService', basicsConfigNavbarPortalService);

    basicsConfigNavbarPortalService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService', '$http'];

    function basicsConfigNavbarPortalService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http) {

        var serviceFactoryOptions = {
            flatLeafItem: {
                module: configModule,
                serviceName: 'basicsConfigNavbarPortalService',
	            httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/navbar/',
		            endRead: 'list',
		            usePostForRead: true,
		            initReadData: function initReadData(readData) {
			            var selected = basicsConfigMainService.getSelected();
			            readData.isPortal = true;
			            readData.moduleId = selected.Id;
		            }
	            },
                actions: {delete: false, create: false},
                entityRole: {leaf: {itemName: 'NavbarPortalConfig', parentService: basicsConfigMainService}},
                presenter: {
                    list: {
                        initCreationData: function initCreationData(creationData) {
                            creationData.mainItemId = basicsConfigMainService.getSelected().Id;
                        }
                    }
                }
            }
        };

        var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

        return serviceContainer.service;
    }
})(angular);
