/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').constant('modelAnnotationTypes',
		(function createAnnotationTypes() {
			class AnnotationTypeInfo {
				constructor(id, code, requiresCustomInitialization, translationKey, iconClass) {
					this.id = id;
					this.code = code;
					this.requiresCustomInitialization = Boolean(requiresCustomInitialization);
					this.translationKey = translationKey;
					this.iconClass = iconClass;
				}
			}

			let count = 0;

			function addItem(typeInfo) {
				typeInfo.sortOrder = count++;
				result.byId[typeInfo.id] = typeInfo;
				result.byCode[typeInfo.code] = typeInfo;
				result.all.push(typeInfo);
			}

			const result = {
				byId: {},
				byCode: {},
				all: []
			};

			addItem(new AnnotationTypeInfo(0, 'standalone', false,
				'model.annotation.modelAnnotationEntityName',
				'control-icons ico-annotation-simple'));
			addItem(new AnnotationTypeInfo(1, 'RfI', false,
				'model.annotation.rfi',
				'control-icons ico-annotation-rfi'));
			addItem(new AnnotationTypeInfo(2, 'Defect', false,
				'model.annotation.defect',
				'control-icons ico-annotation-defect'));
			addItem(new AnnotationTypeInfo(3, 'CheckList', false,
				'model.annotation.hsqeChecklist',
				'control-icons ico-annotation-checklist'));
			addItem(new AnnotationTypeInfo(4, 'Viewpoint', true,
				'model.annotation.viewpoint',
				'control-icons ico-annotation-viewpoint'));
			addItem(new AnnotationTypeInfo(5, 'Measurement', true,
				'model.annotation.measurement',
				'control-icons ico-annotation-measurement'));
			return result;
		})());
})(angular);
