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
     * @description Provides icons for those different types of model annotations that can be
     *   created without any additional information.
     */
    myModule.service('modelAnnotationCreatableTypeIconService', ModelAnnotationCreatableTypeIconService);

    ModelAnnotationCreatableTypeIconService.$inject = ['platformIconBasisService', 'modelAnnotationTypes'];

    function ModelAnnotationCreatableTypeIconService(platformIconBasisService, modelAnnotationTypes) {

        platformIconBasisService.setBasicPath('');

        const icons = modelAnnotationTypes.all.filter(typeInfo => !typeInfo.requiresCustomInitialization).map(typeInfo => platformIconBasisService.createCssIconWithId(typeInfo.id, typeInfo.translationKey, typeInfo.iconClass));

        platformIconBasisService.extend(icons, this);
    }
})(angular);
