/**
 * @ngdoc directive
 * @name platform.directive:platformAutoFocus
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Set focus to the row with index focusRow
 *
 * @example
 <doc:example>
 <doc:source>
 <div data-auto-focus data-focusRow="focusRow" />
 </doc:source>
 </doc:example>
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').directive('lookupFilterDialogAutofocus', setAutoFocus);

	setAutoFocus.$inject = ['$timeout'];

	function setAutoFocus($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				attrs.$observe('lookupFilterDialogAutofocus', function(newValue){
					$timeout(function(){
						var pos = parseInt(newValue);
						if(pos > -1) {
							var children = element.children();
							if (children.length > 1) {
								var child = children.eq(0);
								// var elem = child.find('.input-group-content').eq(pos);
								var rows = child.find('.platform-form-col');
								// var elem1 = child.find('input').eq(pos);
								if (rows.length > pos) {
									var row = rows.eq(pos).find('.input-group-content');
									if (row) {
										row[0].focus();
									}
								} else {
									var search1 = children.eq(1).find('input');
									if (search1) {
										search1[0].focus();
									}
								}
							} /*else {
									var search = children.eq(0).find('input');
									if (search) {
										search[0].focus();
									}
								}*/
						}
					});
				});
			}
		};
	}
})(angular);