/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.evaluation.modelEvaluationRuleEditorModeIconService
	 * @function
	 * @requires platformIconBasisService, modelEvaluationRuleEditorModeService
	 *
	 * @description This service provides icons that represent model evaluation rule editor modes.
	 */
	angular.module('model.changeset').service('modelEvaluationRuleEditorModeIconService', ['platformIconBasisService',
		'modelEvaluationRuleEditorModeService',
		function (platformIconBasisService, modelEvaluationRuleEditorModeService) {

			platformIconBasisService.setBasicPath('');

			var icons = modelEvaluationRuleEditorModeService.createIconDefinitions();

			platformIconBasisService.extend(icons, this);
		}]);
})();