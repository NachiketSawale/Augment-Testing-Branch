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
	cloudTranslationModule.service('cloudTranslationSourceLayoutService', CloudTranslationSourceLayoutService);

	CloudTranslationSourceLayoutService.$inject = ['_', 'cloudTranslationContainerInformationService'];

	function CloudTranslationSourceLayoutService(_, cloudTranslationContainerInformationService) {
		const self = this;
		const conf = {detailConfig: null, listConfig: null};

		self.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getSourceContainerLayout(), 'SourceDto'
				);
			}

			return conf.detailConfig;
		};

		self.getStandardConfigForListView = function getStandardConfigForListView() {
			if(_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getSourceContainerLayout(), 'SourceDto'
				);
			}

			return conf.listConfig;
		};
	}
})();
