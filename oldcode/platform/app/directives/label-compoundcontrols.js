/**
 * Created by rei on 26.4.2018
 */

(function (angular) {
	'use strict';

	var modulename = 'platform';

	angular.module(modulename).directive('platformLabelText',
		['_', function (_) {
			return {
				restrict: 'A',
				scope: false,
				replace: true,
				template: function (elem, attrs) {
					var theTemplate = '<div class="platform-form-row">' +
						'<label for="@@forid@@" class="platform-form-label" style="vertical-align: middle;"  title="{{@@label@@}}">{{@@label@@}}@@isrequired@@</label>' +
						'<div class="platform-form-col"><input type="text" autofocus @@readonly@@ class="form-control" autocomplete=“on“' +
						'	             id="@@forid@@" name="@@forid@@" data-ng-model="@@model@@" placeholder="<{{@@label@@}}>"></div>' +
						'	</div>';
					theTemplate = theTemplate.replace(/@@isrequired@@/g, _.isNil(attrs.isrequired) ? '' : '<span class="required-cell"></span>');
					theTemplate = theTemplate.replace(/@@readonly@@/g, _.isNil(attrs.readonly) ? '' : ' readonly ');
					return theTemplate.replace(/@@forid@@/g, attrs.forid).replace(/@@label@@/g, attrs.label).replace(/@@model@@/g, attrs.model);
				}
			};
		}]);

	/**
	 * samnple
	 * <div data-platform-label-text-icon
	 *   data-label="text.platform.portal.city" data-forid="city"
	 *   data-model="dlgData.extProviderInfo.city"
	 *   data-isrequired
	 *   data-isreadonly="dialogOptions.emailReadonly"
	 *   providerclass="dialogOptions.providerclass"
	 * >
	 * </div>
	 */
	angular.module(modulename).directive('platformLabelTextIcon',
		['_', function (_) {
			return {
				restrict: 'A',
				scope: false,
				replace: true,
				template: function (elem, attrs) {
					var theTemplate = '<div class="platform-form-row">' +
						'<label for="@@forid@@" class="platform-form-label" style="vertical-align: middle;"  title="{{@@label@@}}">{{@@label@@}}@@isrequired@@</label>' +
						'<div class="platform-form-col" data-ng-class="{\'form-icon\': @@formiconclass@@}">' +
						'   <input type="text" autofocus @@ngreadonly@@ class="form-control" autocomplete=“on“' +
						'	             id="@@forid@@" name="@@forid@@" data-ng-model="@@model@@" placeholder="<{{@@label@@}}>">' +
						'   <i class="fa block-image" data-ng-class="@@providerclass@@" data-ng-hide="@@showicon@@"></i>' +
						'</div></div>';

					theTemplate = theTemplate.replace(/@@forid@@/g, attrs.forid).replace(/@@label@@/g, attrs.label).replace(/@@model@@/g, attrs.model);
					theTemplate = theTemplate.replace(/@@isrequired@@/g, _.isNil(attrs.isrequired) ? '' : '<span class="required-cell" data-ng-hide="' + (_.isNil(attrs.isreadonly) ? 'false' : attrs.isreadonly + '"></span>'));

					theTemplate = theTemplate.replace(/@@formiconclass@@/g, _.isNil(attrs.isreadonly) ? 'false' : attrs.isreadonly);
					theTemplate = theTemplate.replace(/@@ngreadonly@@/g, _.isNil(attrs.isreadonly) ? '' : ' data-ng-readonly="' + attrs.isreadonly + '"');
					theTemplate = theTemplate.replace(/@@providerclass@@/g, _.isNil(attrs.providerclass) ? '' : attrs.providerclass);

					theTemplate = theTemplate.replace(/@@showicon@@/g, (_.isNil(attrs.providerclass) || _.isNil(attrs.isreadonly)) ? true : attrs.providerclass + '==null || !' + attrs.isreadonly);
					return theTemplate;
				}
			};
		}]);

	angular.module(modulename).directive('platformLabelTextarea',
		['_', function (_) {
			return {
				restrict: 'A',
				scope: false,
				replace: true,
				template: function (elem, attrs) {
					var theTemplate = '<div class="platform-form-row">' +
						'<label for="@@forid@@" class="platform-form-label" style="vertical-align: middle;"  title="{{@@label@@}}">{{@@label@@}}@@isrequired@@</label>' +
						'<div class="platform-form-col"><textarea autofocus @@readonly@@ class="form-control" autocomplete=“on“' +
						'	             id="@@forid@@" name="@@forid@@" data-ng-model="@@model@@" placeholder="<{{@@label@@}}>"></div>' +
						'	</div>';
					theTemplate = theTemplate.replace(/@@isrequired@@/g, _.isNil(attrs.isrequired) ? '' : '<span class="required-cell"></span>');
					theTemplate = theTemplate.replace(/@@readonly@@/g, _.isNil(attrs.readonly) ? '' : ' readonly ');
					return theTemplate.replace(/@@forid@@/g, attrs.forid).replace(/@@label@@/g, attrs.label).replace(/@@model@@/g, attrs.model);
				}
			};
		}]);

	angular.module(modulename).directive('platformLabelCheckBox',
		['_', function (_) {
			return {
				restrict: 'A',
				scope: false,
				replace: true,
				template: function (elem, attrs) {
					var theTemplate = '<div class="platform-form-row">' +
						'<label class="platform-form-label" style="vertical-align: middle;" title="{{@@label@@}}">{{@@label@@}}@@isrequired@@</label>' +
						' <div class="platform-form-col">' +
						'  <div class="domain-type-boolean form-control">' +
						'   <input type="checkbox" autofocus @@readonly@@ class="form-control" ' +
						'	        id="@@forid@@" name="@@forid@@" data-ng-model="@@model@@" >{{@@value@@}}' +
						'   <label for="@@forid@@">{{@@text@@}}</label>' +
						'  </div>' +
						' </div>' +
						'</div>';
					theTemplate = theTemplate.replace(/@@forid@@/g, attrs.forid);
					theTemplate = theTemplate.replace(/@@label@@/g, attrs.label);
					theTemplate = theTemplate.replace(/@@isrequired@@/g, _.isNil(attrs.isrequired) ? '' : '<span class="required-cell"></span>');
					theTemplate = theTemplate.replace(/@@readonly@@/g, _.isNil(attrs.readonly) ? '' : ' readonly ');
					theTemplate = theTemplate.replace(/@@value@@/g, attrs.value);
					theTemplate = theTemplate.replace(/@@model@@/g, attrs.model);
					theTemplate = theTemplate.replace(/@@text@@/g, attrs.text);
					return theTemplate;
				}
			};
		}]);

	/**
	 *
	 */
	angular.module(modulename).directive('platformLabelSelect',
		['_', function (_) {
			return {
				restrict: 'A',
				scope: false,
				replace: true,
				template: function (elem, attrs) {
					var theTemplate =
						'<div class="platform-form-row">' +
						'<label for="@@forid@@" class="platform-form-label" style="vertical-align: middle;" title="{{@@label@@}}">{{@@label@@}}@@isrequired@@</label>' +
						'<div class="platform-form-col">' +
						'<div class="form-control" data-domain-control data-domain="select" id="@@forid@@" @@readonly@@' +
						'data-model="@@model@@" data-options="@@options@@" data-change="@@onchange@@"> </div>' +
						'</div>' +
						'</div>';
					theTemplate = theTemplate.replace(/@@isrequired@@/g, _.isNil(attrs.isrequired) ? '' : '<span class="required-cell"></span>');
					theTemplate = theTemplate.replace(/@@forid@@/g, attrs.forid);
					theTemplate = theTemplate.replace(/@@label@@/g, attrs.label);
					theTemplate = theTemplate.replace(/@@model@@/g, attrs.model);
					theTemplate = theTemplate.replace(/@@options@@/g, attrs.options);
					theTemplate = theTemplate.replace(/@@onchange@@/g, attrs.onchange);
					theTemplate = theTemplate.replace(/@@readonly@@/g, _.isNil(attrs.readonly) ? '' : ' data-readonly="true" ');
					return theTemplate;
				}
			};
		}]);

})(angular);

