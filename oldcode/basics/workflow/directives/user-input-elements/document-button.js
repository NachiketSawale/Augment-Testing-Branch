/*globals angular */
(function (angular) {
	'use strict';

	function basicsWorkflowDocumentButtonDirective(_, $http, documentDownloadPreviewButtonService, basicsWorkflowtypeSelectedModes) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			replace: true,
			template: '<div><div data-ng-repeat="item in options.docs"><a ng-click="openDocument(item.id)" class="cursor-pointer">{{item.name}}</a></div></div>',
			link: function (scope) {
				var typeSelectedMode = _.isNil(scope.options.typeSelectedMode) ? basicsWorkflowtypeSelectedModes.single :
					scope.options.typeSelectedMode;
				if (typeSelectedMode === basicsWorkflowtypeSelectedModes.single) {
					scope.options.docs = [];
					scope.options.docs.push({'id': scope.options.documentId, 'name': scope.options.displayText});
				} else {
					var docs = [];
					if (_.isString(scope.options.docs)){
						docs = JSON.parse(scope.options.docs);
					}
					else{
						docs = scope.options.docs;
					}
					scope.options.docs = docs;
				}
				scope.openDocument = function openDocument(docid) {
					documentDownloadPreviewButtonService.prepareDocPreviewById(docid);
				};
			}
		};
	}

	basicsWorkflowDocumentButtonDirective.$inject = ['_', '$http', 'documentDownloadPreviewButtonService', 'basicsWorkflowtypeSelectedModes'];

	angular.module('basics.workflow').directive('basicsWorkflowDocumentButtonDirective', basicsWorkflowDocumentButtonDirective);
})(angular);
