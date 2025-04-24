/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modName = 'hsqe.checklist';
	angular.module(modName).factory('hsqeCheckListCommentLayout', [
		function(){
			return {
				fid: 'hsqe.checklist.header',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['bascommentfk']
					}],
				translationInfos: {
					extraModules: [modName],
					extraWords: {
						'BasCommentFk': {'location': modName, 'identifier': 'comment.comment', 'initial': 'Comment'}
					}
				},
				overloads:{
					
				}
			};
		}
	]);
	/**
	 * @ngdoc service
	 * @name hsqeCheckListCommentUIStandardService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(modName).factory('hsqeCheckListCommentUIStandardService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'hsqeCheckListCommentLayout', 'platformSchemaService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'HsqCheckListCommentDto',
				moduleSubModule: 'Hsqe.CheckList'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(layout, domainSchema, translationService);

			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})(angular);
