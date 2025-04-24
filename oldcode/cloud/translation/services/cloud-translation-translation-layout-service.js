/**
 * Created by baf on 30.05.2016
 */
(function () {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationTranslationLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	cloudTranslationModule.service('cloudTranslationTranslationLayoutService', CloudTranslationTranslationLayoutService);

	CloudTranslationTranslationLayoutService.$inject = ['_', 'cloudTranslationContainerInformationService'];

	function CloudTranslationTranslationLayoutService(_, cloudTranslationContainerInformationService) {
		const self = this;
		const conf = {detailConfig: null, listConfig: null};

		self.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getTranslationContainerLayout(), 'TranslationDto'
				);
			}

			return conf.detailConfig;
		};

		self.getStandardConfigForListView = function getStandardConfigForListView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getTranslationContainerLayout(), 'TranslationDto'
				);
			}

			return conf.listConfig;
		};
	}
})();
