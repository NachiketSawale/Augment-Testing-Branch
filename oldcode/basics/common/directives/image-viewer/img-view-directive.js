(function (angular) {
	'use strict';

	angular.module('basics.common').directive('imgView', ['$timeout', '$window', '$document', '$rootScope', '$stateParams', '$http', 'modelWdeViewerPreviewDataService', '_', 'globals', '$',
		function ($timeout, $window, $document, $rootScope, $stateParams, $http, modelWdeViewerPreviewDataService, _, globals, $) {

			return {
				restrict: 'E',
				replace: true,
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/img-preview.html',
				link: function ($scope) {
					const imgConfig = {
						imgSrc: '',
						imgDocId: $stateParams.docid,
						imgWidth: 0,
						imgHeight: 0,
						imgMarginLeft: 0,
						imgMarginTop: 0,
						num: 0,
						startX: 0,
						startY: 0,
						x: 0,
						y: 0,
						position: 1,
						winWidth: 0,
						winHeight: 0
					};
					$scope.fileInfo = {
						name: ''
					};
					$http.get(globals.webApiBaseUrl + 'basics/common/document/getdocumentdefinitions')
						.then(function (result) {
							const documentPreviewImageData = _.filter(result.data, {FilterName: 'Document Preview Image'});
							if (documentPreviewImageData && documentPreviewImageData[0]) {
								imgConfig.data = JSON.parse(documentPreviewImageData[0].FilterDef);
								if (imgConfig.data) {
									const config = imgConfig.data.config;
									init(config.src);
									if(config.title !== ' ') {
										$scope.fileInfo.name = config.title;
									}
									if($scope.fileInfo.name === ''){
										modelWdeViewerPreviewDataService.getFileName(imgConfig.imgDocId).then(function (res) {
											$scope.fileInfo.name = res;
										});
									}
								} else {
									$http.get(globals.webApiBaseUrl + 'basics/common/document/preview?fileArchiveDocId=' + imgConfig.imgDocId).then(function (result) {
										init(result.data);
									});
									modelWdeViewerPreviewDataService.getFileName(imgConfig.imgDocId).then(function (res) {
										$scope.fileInfo.name = res;
									});
								}
							}
						});

					function init(imgSrc) {
						imgConfig.imgSrc = imgSrc;

						const element = angular.element(document.getElementsByClassName('img-view-content'));

						element.on('mousedown', function (event) {
							event.preventDefault();
							let newImgWidth, newImgHeight, rotateNum;
							newImgWidth = imgConfig.imgWidth * imgConfig.position;
							newImgHeight = imgConfig.imgHeight * imgConfig.position;
							rotateNum = imgConfig.num * 90;
							if (rotateNum % 90 === 0 && rotateNum % 180 !== 0 && rotateNum % 270 !== 0 && rotateNum % 360 !== 0) {
								imgConfig.startX = (newImgWidth - newImgHeight) / 2 + newImgHeight - event.offsetY;
								imgConfig.startY = event.offsetX - (newImgWidth - newImgHeight) / 2;
							} else if (rotateNum % 180 === 0 && rotateNum % 360 !== 0) {
								imgConfig.startX = newImgWidth - event.offsetX;
								imgConfig.startY = newImgHeight - event.offsetY;
							} else if (rotateNum % 270 === 0 && rotateNum % 360 !== 0) {
								imgConfig.startX = (newImgWidth - newImgHeight) / 2 + event.offsetY;
								imgConfig.startY = newImgWidth - event.offsetX - (newImgWidth - newImgHeight) / 2;
							} else {
								imgConfig.startX = event.offsetX;
								imgConfig.startY = event.offsetY;
							}
							$document.on('mousemove', mousemove);
							$document.on('mouseup', mouseup);
						});

						function mousemove(event) {
							imgConfig.y = event.clientY - imgConfig.startY - 10;
							imgConfig.x = event.clientX - imgConfig.startX - 10;
							element.css({
								'margin-top': imgConfig.y + 'px',
								'margin-left': imgConfig.x + 'px',
								transition: 'margin 0s'
							});
						}

						function mouseup() {
							$document.off('mousemove', mousemove);
							$document.off('mouseup', mouseup);
							element.css({transition: 'all .6s'});
						}

						element.on('mousewheel DOMMouseScroll', function (event) {
							event.preventDefault();
							const delta = (event.originalEvent.wheelDelta && (event.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
								(event.detail !== 0 && (event.detail > 0 ? -1 : 1)) || (event.originalEvent.deltaY && (event.originalEvent.deltaY < 0 ? 1 : -1));
							if (delta > 0) {
								zoomIn();
							} else if (delta < 0) {
								zoomOut();
							}
						});

						function setImgSize() {
							element.css({
								'margin-left': imgConfig.imgMarginLeft - ((imgConfig.position - 1) * imgConfig.imgWidth) / 2 + 'px',
								'margin-top': imgConfig.imgMarginTop - ((imgConfig.position - 1) * imgConfig.imgHeight) / 2 + 'px'
							});
							angular.element('.dialog-img').css({width: (imgConfig.imgWidth * imgConfig.position) + 'px', height: (imgConfig.imgHeight * imgConfig.position) + 'px'});
						}

						$scope.resetView = function () {
							imgConfig.position = 1;
							imgConfig.num = 0;
							setImgSize();
							angular.element('.img-view-content').css({transform: 'rotate(0deg) scale(1, 1)'});
						};

						function zoomIn() {
							imgConfig.position = imgConfig.position + 0.1;
							if (imgConfig.position > 5) {
								imgConfig.position = 5;
							}
							setImgSize();
						}

						$scope.zoomIn = function () {
							zoomIn();
						};

						function zoomOut() {
							imgConfig.position = imgConfig.position - 0.1;
							if (imgConfig.position < 0.1) {
								imgConfig.position = 0.1;
							}
							setImgSize();
						}

						$scope.zoomOut = function () {
							zoomOut();
						};

						$scope.rotateLeft = function () {
							imgConfig.num--;
							angular.element('.img-view-content').css({transform: 'rotate(' + 90 * imgConfig.num + 'deg) scale(1, 1)'});
						};
						$scope.rotateRight = function () {
							imgConfig.num++;
							angular.element('.img-view-content').css({transform: 'rotate(' + 90 * imgConfig.num + 'deg) scale(1, 1)'});
						};

						$scope.$watch('$viewContentLoaded', function () {
							angular.element('.img-view-content').css({'margin-top': '25%', 'margin-left': '48%'});
							imgConfig.position = 1;
							imgConfig.num = 0;
							$scope.hasImg = false;
							getWindowWH();
							const image = new Image();
							image.src = imgConfig.imgSrc;
							loadImg(image);
							image.onload = function () {
								loadImg(image);
								$scope.hasImg = true;
							};
							$.ajax({
								url: imgConfig.imgSrc,
								type: 'get',
								success: function () {
									// window.console.log(imgConfig.imgSrc);
								},
								error: function () {
									window.document.body.innerHTML = 'The Current File has been lost!';
								}
							});
						});

						function loadImg(image) {
							let width, height, ww = 860, wh, scaleX = 0, scaleY = 0, left, top;
							width = image.width;
							height = image.height;
							imgConfig.winHeight = imgConfig.winHeight - 30;
							wh = imgConfig.winHeight;
							if (width < ww && height < wh) {
								window.console.log(imgConfig);
							} else {
								scaleX = width / ww;
								scaleY = height / wh;
								if (scaleX > scaleY) {
									width = ww;
									height = parseInt((height / scaleX).toString());
								} else {
									width = parseInt((width / scaleY).toString());
									height = wh;
								}
							}
							left = (imgConfig.winWidth - width) / 2;
							top = (imgConfig.winHeight - height) / 2;
							if (top === 0) {
								top = 35;
							}
							imgConfig.imgWidth = width;
							imgConfig.imgHeight = height;
							imgConfig.imgMarginLeft = left;
							imgConfig.imgMarginTop = top;
							angular.element('.img-view-content').css({'margin-top': top + 'px', 'margin-left': left + 'px'});
							angular.element('.dialog-img').css({width: width + 'px', height: height + 'px'});

							const ifram = window.document.getElementById('imgIframe');
							const iframe_content = '<img src="' + imgConfig.imgSrc + '" style="width: 100%;height: 100%;">';
							const blob = new Blob([iframe_content], {type: 'text/html'});
							ifram.src = URL.createObjectURL(blob);

							$timeout(function () {
								window.URL.revokeObjectURL(ifram.src);
							}, 3000);
						}
						function getWindowWH() {
							if (window.innerWidth) {
								imgConfig.winWidth = window.innerWidth;
							} else if ((document.body) && (document.body.clientWidth)) {
								imgConfig.winWidth = document.body.clientWidth;
							}
							if (window.innerHeight) {
								imgConfig.winHeight = window.innerHeight;
							} else if ((document.body) && (document.body.clientHeight)) {
								imgConfig.winHeight = document.body.clientHeight;
							}
							if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
								imgConfig.winHeight = document.documentElement.clientHeight;
								imgConfig.winWidth = document.documentElement.clientWidth;
							}
						}
					}

				}
			};
		}]);
})(angular);