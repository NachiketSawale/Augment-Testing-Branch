/*
 * $Id: container-controller-service.js 511333 2018-08-29 15:06:34Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name platformContainerControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing in a flat item list controller
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').service('platformContainerControllerService', PlatformContainerControllerService);

	PlatformContainerControllerService.$inject = ['_', '$injector', 'platformGridControllerService', 'platformDetailControllerService'];

	function PlatformContainerControllerService(_, $injector, platformGridControllerService, platformDetailControllerService) {

		var self = this;

		this.getServiceByToken = function getServiceByToken(token) {
			var serv;
			if (typeof token === 'object') {
				serv = token;
			} else if (token) {
				serv = $injector.get(token);
			} else {
				serv = null;
			}
			return serv;
		};

		this.getModuleInformationService = function getModuleInformationService(moduleOrModuleCoInSys) {
			if (_.isString(moduleOrModuleCoInSys)) {
				var cisName = _.camelCase(moduleOrModuleCoInSys) + 'ContainerInformationService';
				return $injector.get(cisName);
			}

			return moduleOrModuleCoInSys;
		};

		this.initController = function initController($scope, moduleOrModuleCoInSys, guid, modTrans) {
			var modCIS = self.getModuleInformationService(moduleOrModuleCoInSys);
			var layInfo = modCIS.getContainerInfoByGuid(guid);

			var dataServ = self.getServiceByToken(layInfo.dataServiceName);
			var confServ = self.getServiceByToken(layInfo.standardConfigurationService);
			var validServ = self.getServiceByToken(layInfo.validationServiceName);

			if (layInfo.ContainerType === 'Grid') {
				var myGridConfig = layInfo.listConfig || layInfo.layout;
				platformGridControllerService.initListController($scope, confServ, dataServ, validServ, myGridConfig);
			} else {
				var transServ;
				if (_.isString(modTrans)) {
					transServ = $injector.get(modTrans);
				}
				platformDetailControllerService.initDetailController($scope, dataServ, validServ, confServ, transServ);
			}
		};
	}
})();
