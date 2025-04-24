/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');

	/**
	 * @ngdoc service
	 * @name modelAnnotationTypeIconService
	 * @description Provides icons for the different types of model annotations.
	 */
	myModule.service('modelAnnotationTypeIconService', ModelAnnotationTypeIconService);

	ModelAnnotationTypeIconService.$inject = ['platformIconBasisService', 'modelAnnotationTypes'];

	function ModelAnnotationTypeIconService(platformIconBasisService, modelAnnotationTypes) {
		platformIconBasisService.setBasicPath('');

		const icons = modelAnnotationTypes.all.map(typeInfo => platformIconBasisService.createCssIconWithId(typeInfo.id, typeInfo.translationKey, typeInfo.iconClass));

		platformIconBasisService.extend(icons, this);
	}
})(angular);
