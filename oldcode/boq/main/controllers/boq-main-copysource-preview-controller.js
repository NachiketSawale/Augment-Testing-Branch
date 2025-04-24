(function () {
	/* global */
	'use strict';

	var angularModule = angular.module('boq.main');

	angularModule.controller('boqMainCopySourcePreviewController', ['$scope', 'boqMainBoqLookupService', 'boqMainSpecificationPreviewService',
		function ($scope, boqMainBoqLookupService, boqMainSpecificationPreviewService) {
			boqMainBoqLookupService.currentSpecificationChanged.register(boqMainSpecificationPreviewService.currentBoqItemChanged);
			boqMainBoqLookupService.selectedBoqHeaderChanged.   register(boqMainSpecificationPreviewService.currentBoqHeaderChanged);

			boqMainSpecificationPreviewService.init($scope, boqMainBoqLookupService);

			$scope.$on('$destroy', function () {
				boqMainBoqLookupService.selectedBoqHeaderChanged.   unregister(boqMainSpecificationPreviewService.currentBoqHeaderChanged);
				boqMainBoqLookupService.currentSpecificationChanged.unregister(boqMainSpecificationPreviewService.currentBoqItemChanged);
			});
		}
	]);

	angularModule.factory('boqMainSpecificationPreviewService', ['boqMainCrbVariableCoreService',
		function (boqMainCrbVariableCoreService) {
			var scope;
			var parentService;
			var service = {};

			function chooseTextElement() {
				scope.isPlainText = parentService.isCrbBoq();
				scope.isHtmlText  = !scope.isPlainText;
			}

			service.init = function(scopeParam, parentServiceParam) {
				scope = scopeParam;
				parentService = parentServiceParam;
				chooseTextElement();
			};

			service.currentBoqHeaderChanged = function() {
				chooseTextElement();
				scope.preview = '';
			};

			service.currentBoqItemChanged = function(blobSpecification) {
				scope.preview = '';

				if (parentService.isCrbBoq()) {
					boqMainCrbVariableCoreService.getPreviewAsync(parentService).then(function(response) {
						scope.preview = response;
					});
				}
				else if (blobSpecification && blobSpecification.Content) {
					scope.preview = blobSpecification.Content;
				}

				// bre:
				// The function 'disabled' of the copy toolbar button (id:'boqCopy') is not called reliably for an unknown reason. This workaround will trigger it.
				// To do it in 'boqMainLookupController' would be more logically, but here all is prepared ... 
				scope.tools.update();
			};

			return service;
		}
	]);
})();
