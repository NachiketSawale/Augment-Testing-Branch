(function (angular, jQuery) {
	'use strict';
	angular.module('basics.material').factory('documentProjectType', ['_', '$q', '$http',function (_, $q, $http) {
		var service = {}, documentTypes = [];
		service.getDocumentType = function () {
			var defer = $q.defer();
			if (documentTypes.length) {
				return $q.when(documentTypes);
			} else {
				$http.get(globals.webApiBaseUrl + 'documents/projectdocument/getdocumenttype').then(function (res) {
					if (res && res.data) {
						documentTypes = _.map(res.data, function (item) {
							var type = _.trim(item.Extention, '*. ');
							var noSupport = ['xls','xlsx','docx','doc'];
							var documentExtensions = [];
							if (_.includes(type, ';')) {
								_.forEach(type.split(';'), function (item) {
									documentExtensions.push(_.trim(item,'*. '));
								});
							} else {
								documentExtensions.push(type);
							}
							return {
								Id: item.Id,
								type: documentExtensions,
								support: _.difference(noSupport,documentExtensions).length === noSupport.length
							};
						}
						);
						defer.resolve(documentTypes);
					} else {
						defer.resolve([]);
					}

				});
				return defer.promise;
			}
		};
		return service;
	}
	]);
	angular.module('basics.material').factory('documentConfigControllerService',
		['documentProjectType', function (documentProjectType) {
			var service = {};
			service.previewDocument = previewDocument;
			service.initialpreviewController = initialpreviewController;
			function initialpreviewController($scope, dataService) {
				var tools = [];
				var btnConfig = {};
				btnConfig.preViewBtn = {
					id: 'preview',
					caption: 'basics.common.preview.button.previewCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-preview-form',
					fn: function () {
						$scope.viewWindow = window.open('', 'mywindow1');
						previewDocument($scope, dataService);
					},
					disabled: function () {
						return (!dataService.canPreview)||(!dataService.canPreview());
					}
				};
				tools.push(
					btnConfig.preViewBtn
				);
				return tools;
			}
			function previewConfig($scope, dataService) {
				dataService.getPreviewConfig().then(function (config) {
					documentProjectType.getDocumentType().then(function (documentTypes) {
						if (documentTypes && documentTypes.length) {
							var supportTypes = _.result(_.find(documentTypes, function (item) {
								if(config.documentType){
									return item.Id === config.documentType;
								}else if(config.typeName){
									return _.includes(item.type,config.typeName);
								}

							}), 'type');
							if (_.includes(supportTypes, 'pdf')) {
								$scope.viewWindow.document.title = config.title;
								// eslint-disable-next-line no-useless-escape
								$scope.viewWindow.document.body.innerHTML = '<embed width="100%" height="100%" name="plugin" src=\"' + config.src + '\" type= \"application/pdf\" />';
							} else if (_.includes(supportTypes, 'xml') || _.includes(supportTypes, 'html')) {
								$scope.viewWindow.document.title = config.title;
								$scope.viewWindow.document.body.innerHTML = '<xmp/>';
								jQuery($scope.viewWindow.document.body.lastChild).load(config.src);
							} else if (_.includes(supportTypes, 'png') || _.includes(supportTypes, 'bmp') || _.includes(supportTypes, 'jpg') || _.includes(supportTypes, 'tif')) {
								$scope.viewWindow.document.title = config.title;
								$scope.viewWindow.document.body.innerHTML = '<img/>';
								$scope.viewWindow.document.body.lastChild.src = config.src;
							} else if (_.includes(supportTypes, 'txt')) {
								$scope.viewWindow.document.title = config.title;
								jQuery($scope.viewWindow.document.body).load(config.src);
							}
							else{
								$scope.viewWindow.document.title = config.title;
								$scope.viewWindow.document.body.innerHTML = 'Not Support Current File Type';
							}
						}
					});
				});
			}
			function previewDocument($scope, dataService) {
				if ($scope.viewWindow) {
					if (dataService.hasSelection()) {
						if (dataService.getSelected().OriginFileName){
							previewConfig($scope, dataService);
						}
						else {
							showInfo();
						}
					} else {
						showInfo();
					}
				}
				function showInfo() {
					if($scope.viewWindow){
						$scope.viewWindow.document.body.innerHTML = '<p>No document for preview</p>';
					}
				}
			}

			return service;
		}]);
})(angular, jQuery);