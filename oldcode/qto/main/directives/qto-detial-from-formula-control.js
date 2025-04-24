( function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('qto.main').directive('qtoMainDetailFormulaControl', ['$compile', '$timeout','$',
		'qtoMainLineType', 'qtoMainFormControlChangeService', 'qtoMainDetailGridValidationService',
		function ($compile, $timeout,$, qtoMainLineType, controlChangeService, validationService) {
			var directive = {};
			directive.restrict = 'A';
			directive.replace = true;
			directive.scope = true;
			directive.link = function (scope, element) {
				changeControlByType(scope, scope.entity.QtoLineTypeFk, element);
				validationService.getFormulaImage(scope.entity, scope.entity.QtoFormulaFk);

				var unwatch = scope.$watch('entity.QtoLineTypeFk', function (newLineTypeFk, oldLineTypeFk) {
					if (newLineTypeFk !== oldLineTypeFk) {
						changeControlByType(scope, newLineTypeFk, element);
					}
				});

				var unWatchEntity = scope.$watch('entity', function (newId, oldId) {
					if (newId !== oldId) {
						validationService.getFormulaImage(scope.entity, scope.entity.QtoFormulaFk);
					}
				});

				scope.$on('$destroy', function () {
					validationService.qtoFormulaImageCache = [];
					unWatchEntity();
					unwatch();
				});
			};

			function changeControlByType(scope, qtoLineType, element) {
				var parent = $(element);
				var children = parent.children();
				if (children) {
					children.remove();
				}

				var getMaxLabelWidthByElement = function getMaxLabelWidthByElement(panel) {
					var label = panel.find('.platform-form-label').sort(
						function (labelA, labelB) {
							return angular.element(labelB).width() - angular.element(labelA).width();
						}
					)[0];

					return angular.element(label).width();
				};
				var otherElementWidth = parseInt($('.platform-form-label').css('min-width'));

				var rows = [];
				if (qtoLineType === qtoMainLineType.Standard || qtoLineType === qtoMainLineType.Subtotal ||
					qtoLineType === qtoMainLineType.ItemTotal || qtoLineType === qtoMainLineType.Hilfswert) {
					rows = [
						{
							'rid': 'QtoFormulaCode',
							'gid': 'Formula',
							'label$tr$': 'qto.main.QtoFormulaCode',
							'model': 'QtoFormulaFk',
							'type': 'directive',
							'directive': 'qto-formula-lookup',
							'options': {
								filterKey: 'qto-detail-formula-filter',
								imageSelector: 'qtoFormulaIconProcessor'
							}
						},
						{
							'rid': 'QtoFormulaDesc',
							'gid': 'Formula',
							'label$tr$': 'qto.main.QtoFormulaDesc',
							'model': 'QtoFormulaFk',
							'type': 'directive',
							'directive': 'qto-formula-lookup',
							'options': {
								'displayMember': 'Description'
							},
							readonly: true
						},
						{
							'rid': 'QtoFormulaType',
							'gid': 'Formula',
							'label$tr$': 'qto.main.QtoFormulaType',
							'model': 'QtoFormulaFk',
							'type': 'directive',
							'directive': 'qto-formula-lookup',
							'options': {
								'displayMember': 'QtoTypeDescription'
							},
							readonly: true
						},
						{
							'rid': 'QtoFormulaGonimeter',
							'gid': 'Formula',
							'label$tr$': 'qto.main.QtoFormulaGonimeter',
							'model': 'QtoFormula.Gonimeter',
							'type': 'directive',
							'directive': 'qto-formula-gonimeter-lookup',
							readonly: true
						},
						{
							'rid': 'QtoFormulaImage',
							'gid': 'Formula',
							'label$tr$': 'qto.main.image.Title',
							'model': 'Image',
							'type': 'directive',
							'directive': 'qto-main-image-viewer'
						}
					];
				}

				var html = controlChangeService.getContextHtml(scope, rows, 2, validationService);
				element.append($compile(html)(scope));
				$timeout(function () {
					var selfWidth = getMaxLabelWidthByElement(element);
					if (selfWidth !== null) {
						var maxWidth = ( selfWidth - otherElementWidth ) > 0 ? selfWidth : otherElementWidth;
						$('.platform-form-label').css('min-width', maxWidth + 'px');
					}
				});
			}

			return directive;
		}]);
})(angular);