(function config(angular) {

	'use strict';
	var changeMainModule = angular.module('basics.assetmaster');

	/**
	 * @ngdoc service
	 * @name basicsAssetmasterContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	changeMainModule.service('basicsAssetmasterContainerInformationService', BasicsAssetMasterContainerInformationService);

	BasicsAssetMasterContainerInformationService.$inject = ['_'];

	function BasicsAssetMasterContainerInformationService(_) {
		var dynamicConfigurations = {};
		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			return self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};
	}

})(angular);