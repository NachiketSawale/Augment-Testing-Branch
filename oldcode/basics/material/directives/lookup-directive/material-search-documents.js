/**
 * Created by alm on 2017/3/28.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).directive('basicsMaterialDocumentPreview',
		['$compile',
			function ($compile) {
				return {
					restrict: 'EA',
					link: function (scope, element) {

						function generateHtml() {
							if (!angular.isArray(scope.previewDocuments)) {
								return;
							}
							var arrhtml = [];
							element.empty();
							var documents=scope.previewDocuments;
							_.forEach(documents,function(document,index) {
								var title=document.Description;
								var id=document.Id;
								if(document.OriginFileName){
									arrhtml.push('<div class="ms-sv-commodity-preview-document-box row">');
									arrhtml.push('<div class="ms-sv-commodity-preview-document-title" data-ng-click="onDocumentPreview('+id+','+index+')">'+_.escape(title)+'</div>');
									arrhtml.push('<div class="ms-sv-commodity-preview-document-content ms-sv-commodity-preview-document-content_'+index+'"></div>');
									arrhtml.push('</div>');
								}
							});
							element.append($compile(arrhtml.join(''))(scope));
						}
						generateHtml();
						scope.$watch('previewDocuments', function () {
							generateHtml();
						});

					}
				};
			}]);
})(angular);