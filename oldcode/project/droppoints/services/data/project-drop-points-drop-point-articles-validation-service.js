/**
 * Created by nitsche on 27.01.2025
 */

(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('project.droppoints');

	/**
	 * @ngdoc service
	 * @name projectDropPointsDropPointArticlesValidationService
	 * @description provides validation methods for project droppoints DropPointArticles entities
	 */
	module.service('projectDropPointsDropPointArticlesValidationService', ProjectDropPointsDropPointArticlesValidationService);

	ProjectDropPointsDropPointArticlesValidationService.$inject = [
		'platformValidationServiceFactory', 'projectDropPointsConstantValues', 'projectDropPointsDropPointArticlesDataService',
		'projectDropPointsDropPointArticlesReadOnlyProcessor', '$http', '$q', 'platformDataValidationService',
		'platformValidationRevalidationEntitiesFactory'
	];

	function ProjectDropPointsDropPointArticlesValidationService(
		platformValidationServiceFactory, projectDropPointsConstantValues, projectDropPointsDropPointArticlesDataService,
		projectDropPointsDropPointArticlesReadOnlyProcessor, $http, $q, platformDataValidationService,
		platformValidationRevalidationEntitiesFactory
	) {
		let self = this;
		platformValidationServiceFactory.addValidationServiceInterface(
			projectDropPointsConstantValues.schemes.dropPointArticles,
			{
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(projectDropPointsConstantValues.schemes.dropPointArticles)
			},
			self,
			projectDropPointsDropPointArticlesDataService);

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(
			projectDropPointsConstantValues.schemes.dropPointArticles,
			{
				customValidations: [
					{
						model: 'ArticleTypeFk',
						validation: ()=> true,
						revalidateGrid: [
							{
								model: 'ArticleFk'
							}
						]
					}, {
						model: 'ArticleFk',
						validation: ()=> true,
					}
				],
				globals:{
					revalidateCellOnlyIfHasError: false,
					revalidateOnlySameEntity: true,
					revalidateGrid : false
				}
			},
			self,
			projectDropPointsDropPointArticlesDataService);

		self.validateAdditionalArticleFk = function validateArticleFk(entity, value, model) {
			let res = !_.isNil(value) ?
				platformDataValidationService.createSuccessObject() :
				platformDataValidationService.createErrorObject('cloud.common.emptyOrNullValueErrorMessage', {object: model.toLowerCase()});
			return res;
		}

		self.validateAdditionalArticleTypeFk = function validateAdditionalArticleTypeFk(entity, value) {
			self.handleArticleTypeChange(entity, value);
			return true;
		}

		self.handleArticleTypeChange = function handleArticleTypeChange(entity) {
			entity.ProductFk = null;
			entity.MdcMaterialFk = null;
			entity.PlantFk = null;
			entity.ArticleFk = null;
		};
		self.asyncValidateAdditionalArticleFk = function asyncValidateAdditionalArticleFk(entity, value) {
			if(!_.isNil(value) && entity.ArticleTypeFk === projectDropPointsConstantValues.record.type.plant){
				return $http.get(globals.webApiBaseUrl+'resource/equipment/plant/getIsBulkById?plantId=' + value).then(function (response) {
					entity.IsBulk = response.data;
					projectDropPointsDropPointArticlesReadOnlyProcessor.processItem(entity);
					if(!entity.IsBulk){
						entity.Quantity = 1
					}
					return true;
				})
			} else {
				projectDropPointsDropPointArticlesReadOnlyProcessor.processItem(entity);
				return $q.resolve(true);
			}
		}
	}
})(angular);