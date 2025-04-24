/**
 * Created by joy on 12.08.2021.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name mtwoChatbotValidationService
	 * @description provides validation methods for chatbot
	 */
	var moduleName = 'mtwo.chatbot';
	angular.module(moduleName).service('mtwoChatbotValidationService', MtwoChatbotValidationService);

	MtwoChatbotValidationService.$inject = ['_', '$translate','$q','$http','platformDataValidationService', 'platformRuntimeDataService','platformValidationServiceFactory','mtwoChatBotHeaderDataService','mtwoChatbotConstantValues'];

	function MtwoChatbotValidationService(_, $translate,$q,$http,platformDataValidationService, runtimeDataService,platformValidationServiceFactory,mtwoChatBotHeaderDataService,mtwoChatbotConstantValues) {
		let self = this;

		function createErrorObject(transMsg, errorParam) {
			return {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: transMsg,
				error$tr$param$: errorParam
			};
		}

		function createSuccessObject() {
			return {
				apply: true,
				valid: true
			};
		}

		platformValidationServiceFactory.addValidationServiceInterface(mtwoChatbotConstantValues.schemes.header, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(mtwoChatbotConstantValues.schemes.header),
			periods: [{from: 'StartDate', to: 'TerminalDate'}],
			uniques:['ModuleId']
		}, self, mtwoChatBotHeaderDataService);

		self.asyncValidateModuleId =  function(entity, value, model){
			let defer = $q.defer();
			// let fieldName = model === 'ModuleId' ? $translate.instant('mtwo.chatbot.entityChatbotHeaderModuleId') : 'Module';
			let result = createSuccessObject();
			$http.get(globals.webApiBaseUrl + 'mtwo/chatbot/header/moduleisunique' + '?id=' + value).then(function (response) {
				let fieldName = $translate.instant('mtwo.chatbot.entityChatbotHeaderModuleId');
				if (!response.data) {
					result = createErrorObject('mtwo.chatbot.uniqueValueErrorMessage', {object: fieldName});
				}
				if(!_.isNil(value)) { // add readOnly
					var allFieldsReadOnly = [];
					entity.IsGeneral = false;
					allFieldsReadOnly.push({field: 'IsGeneral', readonly: true});
					runtimeDataService.readonly(entity, allFieldsReadOnly);
				} else { // remove readonly
					if (entity && entity.__rt$data && entity.__rt$data.readonly) {
						var idx = _.findIndex(entity.__rt$data.readonly, {'field': 'IsGeneral'});
						if (idx >= 0) {
							entity.__rt$data.readonly.splice(idx, 1);
						}
					}
				}

				platformDataValidationService.finishValidation(result, entity, value, model, self, mtwoChatBotHeaderDataService);
				defer.resolve(result);
			});

			return defer.promise;
		};

		function updateIsGeneral(entity, value, model) {
			_.forEach(mtwoChatBotHeaderDataService.getList(), function (item) {
				if (item !== entity && value && item[model] && item[model] === true) {
					item[model] = false;
					mtwoChatBotHeaderDataService.markItemAsModified(item);
					mtwoChatBotHeaderDataService.gridRefresh();
				}
				if (item === entity) {
					item[model] = value;
					mtwoChatBotHeaderDataService.markItemAsModified(item);
					mtwoChatBotHeaderDataService.gridRefresh();
				}
			});
		}

		self.validateIsGeneral =  function(entity, value, model){
			updateIsGeneral(entity, value, model);
			return {apply: value, valid: true};
		};
	}

})(angular);
