/**
 * Created by baf on 29.06.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainBiddingConsortiumValidationService
	 * @description provides validation methods for project main biddingConsortium entities
	 */
	angular.module(moduleName).service('projectMainBiddingConsortiumValidationService', ProjectMainBiddingConsortiumValidationService);

	ProjectMainBiddingConsortiumValidationService.$inject = [
		'platformValidationServiceFactory', 'projectMainConstantValues', 'projectMainBiddingConsortiumDataService',
		'platformValidationRevalidationEntitiesFactory','platformDataValidationService'
	];

	function ProjectMainBiddingConsortiumValidationService(
		platformValidationServiceFactory, projectMainConstantValues, projectMainBiddingConsortiumDataService,
		platformValidationRevalidationEntitiesFactory, platformDataValidationService
	) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(projectMainConstantValues.schemes.biddingConsortium, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectMainConstantValues.schemes.biddingConsortium)
		},
		self, projectMainBiddingConsortiumDataService);
		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			projectMainConstantValues.schemes.biddingConsortium,
			{
				customValidations: [
					{
						model: 'ValuePercent',
						validation: function (entity, value,model,entities) {
							if(_.some(entities, e => !_.isNull(e.ValuePercent))){
								if((100 !== _.sumBy(entities, 'ValuePercent') || _.some(entities, e => _.isNull(e.ValuePercent)))){
									return platformDataValidationService.createErrorObject('project.main.err100PercentValue');
								}
								else{
									return true;
								}
							}
							return true;
						},
						revalidateGrid: [{ model: 'ValuePercent' }]
					}],
				globals: {
					revalidateCellIOnlyIfHasError: false,
					revalidateOnlySameEntity: false
				}
			},
			self,
			projectMainBiddingConsortiumDataService);
	}
})(angular);
