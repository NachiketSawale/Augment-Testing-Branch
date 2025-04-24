(function (angular) {
	'use strict';

	const basicsClerkModuleName = 'basics.clerk';
	const moduleName = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	angular.module(moduleName).factory('basicsCommonApprovalTranslateService', ['platformUIBaseTranslationService', function (platformUIBaseTranslationService) {

		const service = {};
		service.getService = function getService(translation) {
			const approvalTranslation = {
				translationInfos: {
					extraModules: [moduleName, basicsClerkModuleName],
					extraWords: {
						ClerkFk: {location: cloudCommonModule, identifier: 'entityClerk', initial: 'Clerk'},
						ClerkRoleFk: {location: cloudCommonModule, identifier: 'entityClerkRole', initial: 'Clerk Role'},
						DueDate: {location: moduleName, identifier: 'entityDueDate', initial: 'DueDate'},
						IsApproved: {location: moduleName, identifier: 'entityApproved', initial: 'Approved'},
						Comment: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comment'},
						EvaluatedOn: {location: moduleName, identifier: 'entityEvaluatedOn', initial: 'Evaluated on'},
						EvaluationLevel: {location: moduleName, identifier: 'entityEvaluationLevel', initial: 'Evaluationlevel'}
					}
				}
			};

			if (translation && translation.translationInfos) {
				const extraModules = translation.translationInfos.extraModules;

				if (extraModules && extraModules.length > 0) {
					angular.forEach(extraModules, function (item) {
						if (approvalTranslation.translationInfos.extraModules.indexOf(item) === -1) {
							approvalTranslation.translationInfos.extraModules.push(item);
						}
					});
				}

				const extraWords = translation.translationInfos.extraWords;
				if (extraWords) {
					for (let p in extraWords) {
						if (Object.prototype.hasOwnProperty.call(extraWords, p)) {
							approvalTranslation.translationInfos.extraWords[p] = extraWords[p];
						}
					}
				}
			}

			function TranslationService(transOptions) {
				platformUIBaseTranslationService.call(this, transOptions);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;

			return new TranslationService(approvalTranslation);
		};

		return service;

	}]);

})(angular);