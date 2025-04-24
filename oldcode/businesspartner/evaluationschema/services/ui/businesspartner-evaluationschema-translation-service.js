/**
 * Created by henkel on 16.09.2014.
 */

(function (angular) {
	'use strict';

	var cloudCommonModule = 'cloud.common';
	var procurementCommonModule = 'procurement.common';
	var businesspartnerModule = 'businesspartner.main';
	var businesspartnerEvaluationschema = 'businesspartner.evaluationschema';

	/**
	 * @ngdoc service
	 * @name basicsCompanyTranslationService
	 * @description provides translation for basics company module
	 */
	angular.module(businesspartnerEvaluationschema).factory('businesspartnerEvaluationschemaTranslationService',
		['platformTranslationUtilitiesService', 'platformTranslateService', '$q',

			function (platformTranslationUtilitiesService, platformTranslateService, $q) {
				var service = {instant: platformTranslateService.instant};
				var data = {
					toTranslate: {},
					translate: null,
					updateCallback: null,
					allUsedModules: [businesspartnerEvaluationschema, procurementCommonModule, cloudCommonModule, businesspartnerModule]
				};

				data.words = {
					// Schema
					RubricCategoryFk: {location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk', initial: 'Rubric Category'},
					EvaluationMotiveFk: {location: businesspartnerModule, identifier: 'entityEvaluationMotiveFk', initial: 'Evaluation Motive'},
					FormFk: {location: businesspartnerEvaluationschema, identifier: 'entityFormFk', initial: 'User Form'},

					// Group **
					Weighting: {location: businesspartnerEvaluationschema, identifier: 'entityWeighting', initial: 'Weighting'},

					// GroupIcon and Icon
					PointsFrom: {location: businesspartnerEvaluationschema, identifier: 'entityPointsFrom', initial: 'From Points'},
					PointsTo: {location: businesspartnerEvaluationschema, identifier: 'entityPointsTo', initial: 'To Points'},
					Icon: {location: businesspartnerEvaluationschema, identifier: 'entityIcon', initial: 'Icon'},

					// Item
					Points: {location: businesspartnerEvaluationschema, identifier: 'entityPoints', initial: 'Points'},

					// Subgroup
					Pointspossible: {location: businesspartnerEvaluationschema, identifier: 'entityPointspossible', initial: 'Pointspossible'},
					IsOptional: {location: businesspartnerEvaluationschema, identifier: 'entityIsOptional', initial: 'Optional'},
					IsEditable: {location: businesspartnerEvaluationschema, identifier: 'entityIsEditable', initial: 'Editable'},
					IsMultiSelect: {location: businesspartnerEvaluationschema, identifier: 'entityIsMultiSelect', initial: 'Multi Select'}
				};

				// Get some predefined common translation words
				platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
				platformTranslationUtilitiesService.addHistoryTranslation(data.words);
				platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');
				platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

				// Convert word list into a format used by platform translation service
				data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

				// Prepare interface of service and load translations
				platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
				platformTranslationUtilitiesService.loadModuleTranslation(data);
				platformTranslationUtilitiesService.registerModules(data);

				// for container information service use   module container lookup
				service.loadTranslations = function loadTranslations() {
					return $q.when(false);
				};
				return service;
			}
		]);
})(angular);

// The new translation configuration
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.evaluationschema';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).service('businessPartnerEvaluationSchemaTranslationServiceNew', ['platformUIBaseTranslationService', 'businessPartnerEvaluationSchemaGroupIconLayoutService', 'businessPartnerEvaluationSchemaGroupLayoutService', 'businessPartnerEvaluationSchemaItemLayoutService', 'businessPartnerEvaluationSchemaSubgroupLayoutService',
		function (platformUIBaseTranslationService, businessPartnerEvaluationSchemaGroupIconLayoutService, businessPartnerEvaluationSchemaGroupLayoutService, businessPartnerEvaluationSchemaItemLayoutService, businessPartnerEvaluationSchemaSubgroupLayoutService) {
			var layouts = [
				businessPartnerEvaluationSchemaGroupIconLayoutService,
				businessPartnerEvaluationSchemaGroupLayoutService,
				businessPartnerEvaluationSchemaItemLayoutService,
				businessPartnerEvaluationSchemaSubgroupLayoutService
			];
			var localBuffer = {};
			platformUIBaseTranslationService.call(this, layouts, localBuffer);
		}
	]);
})(angular);