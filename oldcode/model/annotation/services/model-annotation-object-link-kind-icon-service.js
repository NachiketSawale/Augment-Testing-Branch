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
	 * @description Provides icons for the different types of model annotation object links.
	 */
	myModule.service('modelAnnotationObjectLinkTypeIconService', ModelAnnotationObjectLinkTypeIconService);

	ModelAnnotationObjectLinkTypeIconService.$inject = ['platformIconBasisService'];

	function ModelAnnotationObjectLinkTypeIconService(platformIconBasisService) {
		platformIconBasisService.setBasicPath('');

		const icons = [
			platformIconBasisService.createCssIconWithId('o', 'model.annotation.objectLinkKindObject', 'control-icons ico-model-object'),
			platformIconBasisService.createCssIconWithId('s', 'model.annotation.objectLinkKindObjectSet', 'control-icons ico-model-object-set')
		];

		platformIconBasisService.extend(icons, this);
	}
})(angular);
