(function (angular) {
	'use strict';

	const basicsClerkModuleName = 'basics.clerk';
	const moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonClerkTranslateService', ['platformUIBaseTranslationService', function (platformUIBaseTranslationService) {

		const service = {};
		service.getService = function getService(translation) {
			const clerkTranslation = {
				translationInfos: {
					extraModules: [moduleName, basicsClerkModuleName],
					extraWords: {
						ClerkRoleFk: {location: moduleName, identifier: 'entityClerkRole', initial: 'ClerkRole'},
						ClerkFk: {location: moduleName, identifier: 'entityClerk', initial: 'Clerk'},
						ValidFrom: {location: moduleName, identifier: 'entityValidFrom', initial: 'Valid From'},
						ValidTo: {location: moduleName, identifier: 'entityValidTo', initial: 'Valid To'},
						CommentText: {
							location: moduleName,
							identifier: 'entityCommentText',
							initial: 'Comment Text'
						}
					}
				}
			};

			if (translation && translation.translationInfos) {
				const extraModules = translation.translationInfos.extraModules;

				if (extraModules && extraModules.length > 0) {
					angular.forEach(extraModules, function (item) {
						if (clerkTranslation.translationInfos.extraModules.indexOf(item) === -1) {
							clerkTranslation.translationInfos.extraModules.push(item);
						}
					});
				}

				const extraWords = translation.translationInfos.extraWords;
				if (extraWords) {
					for (let p in extraWords) {
						if (Object.prototype.hasOwnProperty.call(extraWords, p)) {
							clerkTranslation.translationInfos.extraWords[p] = extraWords[p];
						}
					}
				}
			}

			function TranslationService(transOptions) {
				platformUIBaseTranslationService.call(this, transOptions);
			}

			TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
			TranslationService.prototype.constructor = TranslationService;

			return new TranslationService(clerkTranslation);
		};

		return service;

	}]);

})(angular);