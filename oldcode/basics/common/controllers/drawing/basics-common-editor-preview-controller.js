(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonEditorPreviewController', [
		'$scope', '$http', '$stateParams', '$state', 'cloudDesktopSidebarService', '$sce', 'globals', '$timeout',
		function basicsCommonEditorPreviewController($scope, $http, $stateParams, $state, cloudDesktopSidebarService, $sce, globals, $timeout) {
			const docId = $stateParams.docid;
			/* var goViewUrl = globals.defaultState + '.' + $stateParams.modulename;
			$state.go(goViewUrl).then(function callback(){
				if($stateParams.key !== null){
					cloudDesktopSidebarService.filterSearchFromPKeys([$stateParams.key]);
				}
			}); */
			$http.get(globals.webApiBaseUrl + 'basics/common/document/getfileineditor?docId=' + docId)
				.then(function (response) {
					if (response.data) {
						let blob = new Blob([response.data], {type: 'text/html'});
						let blobId = window.URL.createObjectURL(blob);
						window.document.body.style.overflow = 'hidden';
						window.document.body.innerHTML = '<iframe credentialless style="border:none;position:relative;top:0;left:0;width: 100%;height:100%;" src="' + blobId + '" sandbox="allow-scripts"></iframe>';

						$timeout(function () {
							window.URL.revokeObjectURL(blobId);
						}, 3000);
					}
				});

		}]);

	angular.module(moduleName).controller('basicsCommonEditorMsgPreviewController', [
		'$scope', '$http', '$stateParams', 'globals', '$timeout',
		function basicsCommonEditorMsgPreviewController($scope, $http, $stateParams, globals, $timeout) {
			const docId = $stateParams.docid;

			$http.get(globals.webApiBaseUrl + 'basics/common/document/getmsgineditor?docId=' + docId)
				.then(function (response) {
					if (response.data) {
						let blob = new Blob([response.data], {type: 'text/html'});
						let blobId = window.URL.createObjectURL(blob);
						window.document.body.style.overflow = 'hidden';
						window.document.body.innerHTML = '<iframe credentialless style="border:none;position:relative;top:0;left:0;width: 100%;height:100%;" src="' + blobId + '" sandbox="allow-scripts"></iframe>';

						$timeout(function () {
							window.URL.revokeObjectURL(blobId);
						}, 3000);
					}
				});
		}]);
})(angular);
