/**
 * Created by sandu on 17.03.2022.
 */
(function () {

    'use strict';

    var moduleName = 'basics.config';
    var configModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name basicsConfigCommandbarSystemService
     * @function
     *
     * @description
     * data service for all CommandbarSystem related functionality.
     */
    /* jshint -W072 */ // many parameters because of dependency injection
    configModule.factory('basicsConfigCommandbarSystemService', basicsConfigCommandbarSystemService);

    basicsConfigCommandbarSystemService.$inject = ['basicsConfigMainService', 'platformDataServiceFactory','platformModalService', '$http'];

    function basicsConfigCommandbarSystemService(basicsConfigMainService, platformDataServiceFactory, platformModalService, $http) {

        var serviceFactoryOptions = {
            flatLeafItem: {
                module: configModule,
                serviceName: 'basicsConfigCommandbarSystemService',
                httpCRUD: {route: globals.webApiBaseUrl + 'basics/config/commandbar/',
		                endRead: 'list',
		                usePostForRead: true,
		                initReadData: function initReadData(readData) {
			                var selected = basicsConfigMainService.getSelected();
			                readData.isPortal = false;
								 readData.moduleId = selected.Id;
		                }
						 },
                actions: {delete: false, create: false},
                entityRole: {leaf: {itemName: 'CommandbarConfig', parentService: basicsConfigMainService}},
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
