/**
 * Created by lja on 2015/12/3.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialSearchPreview',
		[
			function () {
				return {
					restrict: 'EA',
					link: function (scope, element) {

						function generateHtml() {

							if (!angular.isArray(scope.previewAttributes)) {
								return;
							}

							var result = {},
								html = '';

							element.empty();

							scope.previewAttributes.forEach(function (item) {
								var key = item.Property;
								result[key] ? result[key].push(item.Value) : result[key] = [item.Value];//jshint ignore:line
							});

							for (var key in result) {//jshint ignore:line
								html += '<div class="ms-sv-commodity-preview-attribute-box row">';
								html += '<div class="ms-sv-commodity-preview-attribute-property col-md-2">' + _.escape(key) + ' </div>';
								html += '<div class="ms-sv-commodity-preview-attribute-value col-md-10">'+ _.escape(result[key][0]) +'</div>';
								html += '</div>';
							}

							element.append(html);
						}

						generateHtml();

						scope.$watch('previewAttributes', function () {
							generateHtml();
						});

					}
				};
			}]);
})(angular);