/**
 * Created by aljami on 12.03.2020
 */
(function (angular) {
	'use strict';
	const cloudTranslationModule = angular.module('cloud.translation');

	/**
	 * @ngdoc service
	 * @name cloudTranslationResourceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for grid / form for translation resource entities
	 */
	cloudTranslationModule.service('cloudTranslationTodoTranslationLayoutService', CloudTranslationTodoTranslationLayoutService);

	CloudTranslationTodoTranslationLayoutService.$inject = ['_', 'cloudTranslationContainerInformationService'];

	function CloudTranslationTodoTranslationLayoutService(_, cloudTranslationContainerInformationService) {
		const self = this;
		const conf = {detailConfig: null, listConfig: null};

		self.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
			if (_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getToDoTranslationContainerLayout(), 'TranslationsTodoVDto'
				);
			}

			return conf.detailConfig;
		};

		self.getStandardConfigForListView = function getStandardConfigForListView() {
			if (_.isNil(conf.listConfig)) {
				cloudTranslationContainerInformationService.initializeContainerConfigurations(
					conf, cloudTranslationContainerInformationService.getToDoTranslationContainerLayout(), 'TranslationsTodoVDto'
				);
			}

			return conf.listConfig;
		};
	}
})(angular);
