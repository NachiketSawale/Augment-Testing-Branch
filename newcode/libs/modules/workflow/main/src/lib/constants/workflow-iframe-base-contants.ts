/*
 * Copyright(c) RIB Software GmbH
 */

export const LOCAL_IFRAME_ANGULARJS_PATH = '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.11/angular.js"></script>';

export const IFRAME_LODASH_CDN_PATH = '<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>';

export const IFRAME_JQUERY_CDN_PATH ='<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>';
/**
 * Holds path to load angularjs file.
 */
export const LOCAL_IFRAME_ANGULARJS_PATH1 = '<script src="http://192.168.0.200:8080/angular.min.js"></script>';

const createFactoryFn = `
const iframePayloadMap = new Map();
function createFactory(factoryName, methods) {
app.factory(factoryName, ['$rootScope', '$q', function($rootScope, $q) {
			let obj = {};
			methods.forEach((method)=>{
			const uniqueId = _.uniqueId('IFramePayload_');
			const defer = $q.defer();
				obj[method] = (...parameters) => {
					const iFrameMessage = {
						ServiceName: factoryName,
						MethodName: method,
						Parameters: parameters,
						IframePayloadId: uniqueId
					};
					iframePayloadMap.set(uniqueId, defer);
					window.parent.postMessage(iFrameMessage);
					return defer.promise;
				}
			});
			return obj;
		}]);
}
`;


/**
 * Holds base controller for iframe
 */
export const IFRAME_BASE_CONTROLLER_SCRIPT = `
	<script>
		var app = angular.module('iframeApp', []);

		${createFactoryFn}

		const serviceMap = new Map();

		app.factory('extendedInjector', ['$injector', function(injector) {
			var service = {};
			service.get = function(serviceName) {
				if(serviceMap.has(serviceName)) {
						return serviceMap.get(serviceName);
				} else {
					return injector.get(serviceName);
				}
			}
			return service;
		}]);

		app.controller('iframeController', ['$scope', '$window', 'extendedInjector','$q',
		 async function ($scope, $window, $injector, $q) {

			$scope.Context = {};

			setPrerequisites();
			function setPrerequisites() {
				const iFrameMessage = {
					ShouldSetPrerequisites: true
				};

				//Request context from component
				window.parent.postMessage(iFrameMessage);
			}

			function loadLegacyServicesToMap(serviceName, methods) {
			const serviceFn = {};
			methods?.forEach((method)=>{
				const uniqueId = _.uniqueId('IFramePayload_');
				const defer = $q.defer();
					serviceFn[method] = (...parameters) => {
						const iFrameMessage = {
							ServiceName: serviceName,
							MethodName: method,
							Parameters: parameters,
							IframePayloadId: uniqueId
						};
						iframePayloadMap.set(uniqueId, defer);
						window.parent.postMessage(iFrameMessage);
						return defer.promise;
					}
			});
			serviceMap.set(serviceName, serviceFn);
		}

			$scope.isLoaded = false;
			window.addEventListener("message", (message) => {
				const data = message.data;
				//Read message events and set or get context object
				if (data.ShouldSetContextInIFrame) {
					$scope.Context = data.Context;
					$scope.$apply();
				}

				if (data.ShouldGetContextFromIFrame) {
					const message = {
						Context: $scope.Context
					};
					$scope.sendContextFromiFrame(message);
				}

				if(data.ShouldSetPrerequisites) {
					data?.ServiceFnArr?.forEach((item) => {
						loadLegacyServicesToMap(item.legacyServiceName, item.methods);
					});
					$scope.isLoaded = true;
					$scope.Context = data.Context;
					$scope.$apply(scriptEvalWrapper());
				}

				const defer = iframePayloadMap.get(data.IframePayloadId);
				if(defer) {
					defer.resolve(message.data.ParentFnResult);
					iframePayloadMap.delete(message.data.IframePayloadId);
				}

				if(data.IsSubmit) {
					$scope.onOk();
				}
			});

			$scope.onOk = function() {
				const message = {
					IsSubmit: true,
					Context: $scope.Context
				};
				$scope.sendContextFromiFrame(message);
			};

			$scope.sendContextFromiFrame = (message) => {
				window.parent.postMessage(message);
			};

			function scriptEvalWrapper(){
				const scope = $scope;
				return async function script(scope) {@content}
			}
		}]);
	</script>
`;

/**
 * Holds base html for iframe
 */
export const IFRAME_BASE_HTML = `
	<div ng-app="iframeApp" ng-controller="iframeController">
		@content
	</div>
`;
