/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const modelAnnotationModule = angular.module('model.annotation');

	modelAnnotationModule.factory('modelAnnotationCommentConfigService',
		modelAnnotationCommentConfigService);

	modelAnnotationCommentConfigService.$inject = [];

	function modelAnnotationCommentConfigService() {
		return {
			getConfig() {
				return {
					createUrl: globals.webApiBaseUrl + 'model/annotation/comment/create'
				};
			}
		};
	}
})(angular);
