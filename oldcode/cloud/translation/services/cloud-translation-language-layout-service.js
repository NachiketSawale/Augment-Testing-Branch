/**
 * Created by baf on 30.05.2016
 */
(function () {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationLanguageLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	cloudTranslationModule.service('cloudTranslationLanguageLayoutService', CloudTranslationLanguageLayoutService);

	CloudTranslationLanguageLayoutService.$inject = ['_', 'cloudTranslationContainerInformationService'];

	function CloudTranslationLanguageLayoutService(_, cloudTranslationContainerInformationService) {
		const self = this;
		const conf = {detailConfig: null, listConfig: null};

		self.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getLanguageContainerLayout(), 'LanguageDto'
				);
			}

			return conf.detailConfig;
		};

		self.getStandardConfigForListView = function getStandardConfigForListView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getLanguageContainerLayout(), 'LanguageDto'
				);
			}

			return conf.listConfig;
		};
	}
})();
