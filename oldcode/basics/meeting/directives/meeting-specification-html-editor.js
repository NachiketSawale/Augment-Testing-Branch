/**
 * Created by yanga on 06.16.2022
 */
(function () {

	/* global */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsMeetingSpecificationHtmlEditor
	 * @description
	 */
	angular.module('basics.meeting').directive('basicsMeetingSpecificationHtmlEditor', ['cloudDesktopUserfontService', '$q',
		function (cloudDesktopUserfontService, $q) {

			let template = [];
			template += '<platform-Editor ';
			template +=    'id="" ';
			template +=    'show-toolbar="true" ';
			template +=    'textarea-id="htmlEditor" ';
			template +=    'textarea-class="" ';
			template +=    'textarea-name="specificationHtmlEditor" ';
			template +=    'textarea-height="100%" ';
			template +=    'textarea-required ';
			template +=    'data-ng-model="entity.Content" ';
			template +=    'enable-bootstrap-title="true" ';
			template +=    'textarea-editable="editable" ';
			template +=    'data-editoroptions="options" ';
			template += '/>';

			return {
				restrict: 'A',
				scope: {
					ngModel: '=',
					ngChange: '&',
					entity: '=',
					editable: '=',
					options: '='
				},
				template: template,
				link: linker
			};

			function linker(scope) {

				// need watch for entity since binding does not properly work!
				scope.$watch('entity', function (newValue, oldValue) {
					// newValue or oldValue may be undefined.
					if (newValue && oldValue && newValue.Id === oldValue.Id && newValue.Version === oldValue.Version && (newValue.Content || '') !== (oldValue.Content || '')) {
						if (scope.ngChange) {
							scope.ngChange();
						}
					}
				}, true);

				// #region setup html editor

				// override default values with user specific values
				function loadUserfonts() {
					if (scope && !scope.options) {
						scope.options = {};
					}
					let p1 = cloudDesktopUserfontService.loadData();
					let p2 = cloudDesktopUserfontService.loadCSS();
					$q.all([p1, p2]).then(function () {

						let css = cloudDesktopUserfontService.getCSS();
						if (css && css.length > 0) {
							scope.options.css = css;
						}

						let fonts = cloudDesktopUserfontService.getList();
						if (fonts && fonts.length > 0) {
							scope.options.fonts = fonts;
							scope.options.font = scope.options.fonts[0];
						}
					});
				}

				loadUserfonts();

				// #endregion
			}
		}
	]);
})();
