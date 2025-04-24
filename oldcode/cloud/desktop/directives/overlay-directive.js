/**
 * @ngdoc directive
 * @name cloud.common.directive:cloudCommonOverlay
 * @element div
 * @restrict A
 * @priority default value
 * @scope isolate scope
 * @description
 * Show a waiting-icon-box with a custom infotext.
 *
 * @example
 * <div data-cloud-common-overlay data-loading="companyOptions.loading" data-info2="companyOptions.loadingInfo" data-config="{ backdrop: true }></div>;
 */
(function (angular) {
	'use strict';

	// list config object
	angular.module('cloud.common').constant('cloudCommonFeedbackType', {
		short: 'short',
		medium: 'medium',
		long: 'long'
	});

	angular.module('cloud.common').directive('cloudCommonOverlay', ['$compile', 'platformTranslateService',
		function ($compile, platformTranslateService) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/overlay.html',
				scope: {
					complete: '=',
					feedbackType: '=',
					loading: '=',
					title: '=',
					info2: '=',
					cssClass: '=',
					icoClass: '=',
					config: '=',
					error: '=',
					infoHtml:'=',
					progressTime:'='
				},
				link: function (scope, elem) {
					let id;

					scope.$watch('loading', function (val) {
						if (val) {
							if (elem) {
								if (scope.feedbackType === 'long') {
									const progressElem = elem.find('#progress');
									if (progressElem && progressElem.length > 0) {
										id = setInterval(frame, 1000);
										let width = 0;

										function frame() {
											if (width >= 100) {
												clearInterval(id);
											} else {
												width += 100/(scope.progressTime ? scope.progressTime : 10);
												progressElem[0].style.width = width + '%';
											}
										}
									}
								}
							}
						} else {
							if (id) {
								clearInterval(id);
							}
						}
					});

					scope.$watch('complete', function (val) {
						if (val) {
							if (elem) {
								if (scope.feedbackType === 'long') {
									if (id) {
										clearInterval(id);
									}
									const progressElem = elem.find('#progress');
									if (progressElem && progressElem.length > 0) {
										progressElem[0].style.width = '100%';
										progressElem[0].classList.add('complete');
									}
								}
							}
						}
					});

					scope.$watch('error', function (val) {
						if (val) {
							if (elem) {
								if (scope.feedbackType === 'long') {
									if (id) {
										clearInterval(id);
									}
									const progressElem = elem.find('#progress');
									if (progressElem && progressElem.length > 0) {
										progressElem[0].classList.add('error');
									}
								}
							}
						}
					});


					scope.onClose = function onClose() {
						scope.loading = false;
						scope.feedbackType = null
						scope.title = null;
						scope.info2 = null;
						scope.error = null;
						scope.complete = null;
					}

					scope.getIconClass = function getIconClass() {
						if (scope.icoClass) {
							return scope.icoClass + ' feedback-ico control-icons margin-right-ld';
						}
						else {
							return 'feedback-ico control-icons margin-right-ld ico-ico-multiple-files';
						}
					};

					scope.text = function getText() {
						if (scope.config) {
							if (scope.config.info2$tr$) {
								platformTranslateService.translateObject(scope.config, undefined, {recursive: false});
								return scope.config.info2;
							} else if (scope.config.info2) {
								return scope.config.info2;
							}
						}

						return scope.info2;
					};
				}
			};
		}]
	);
})(angular);
