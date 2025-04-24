(function () {
	'use strict';
	/*global angular, globals, _*/

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonLogPinboardViewController', [
		'$scope', 'basicsCommonCommentDataServiceFactory',
		'$injector', '$http',
		'ppsCommonLoggingHelper', 'ppsCommonLogUIStandardService', 'transportplanningTransportUtilService',
		'$controller', '$q',
		function ($scope, serviceFactory,
		          $injector, $http,
		          ppsCommonLoggingHelper, ppsCommonLogUIStandardService, utilSrv,
		          $controller, $q) {

			// to prevent load data when init scope, set parentItem.Id = undefined
			var resetParentId;
			var parentSrv = $injector.get($scope.getContentValue('parentService'));
			if(parentSrv){
				var parentItem = parentSrv.getSelected();
				if(parentItem){
					var orgParentId = parentItem.Id;
					resetParentId = function(){
						parentItem.Id = orgParentId;
					};
					parentItem.Id = undefined;
				}
			}
			$controller('basicsCommonCommentController', {'$scope': $scope}); // init $scope with basicsCommonCommentController
			if(resetParentId){
				resetParentId();
			}

			$scope.$on('$destroy', function () {
				service.parentDataService.unregisterSelectionChanged(service.load);
				service.parentDataService.unregisterSelectionChanged(service.refreshLoginClerk);
			});

			// init service
			var qualifier          = $scope.getContentValue('commentQualifier'),
				parentServiceName  = $scope.getContentValue('parentService'),
				serviceConfig = $injector.get($scope.getContentValue('configServiceName')).getConfig();
			var service = serviceFactory.get(qualifier, parentServiceName);
			if(!service.hasInit){
				service.hasInit = true;
				buildColumns(service.columns);
				var endRead = $scope.getContentValue('endRead');
				service.lastHttp = function (parentItem) {
					return $http.get(serviceConfig.lastUrl + endRead + parentItem.Id)
						.then(function (response) {
							setIsShow(response.data.Logs);
							return translateLogColumnName(response);
						});
				};
				service.remainHttp = function (parentItemId, parentLogId) {
					var url = serviceConfig.remainUrl + endRead + parentItemId;
					if(!_.isNil(parentLogId)) {
						url += '&&parentLogId=' + parentLogId;
					}
					return $http.get(url)
						.then(function (response) {
							setIsShow(response.data.Logs);
							return translateLogColumnName(response);
						});
				};
			}

			function setIsShow(comments) {
				if (!angular.isArray(comments) || comments.length === 0) {
					return;
				}
				_.forEach(comments, function (item) {
					item.isShow = true;
					handleChildren(item.Children, function (child) {
						child.isShow = true;
					});
				});
			}

			function handleChildren(children, action) {
				if (angular.isArray(children) && children.length > 0) {
					_.forEach(children, function (child) {
						if (angular.isFunction(action)) {
							action(child);
						}
						handleChildren(child.Children, action);
					});
				}
			}

			function buildColumns(columns){
				var colInd = _.find(columns, {id: 'indicator'});
				colInd.field = 'ClerkFk';
				var colHead = _.find(columns, {id: 'header'});
				colHead.field = 'ClerkFk';
				var clerkNameCvt = colHead.converter;
				colHead.converter = function (field, value, dataItem) {
					var clerkName = clerkNameCvt(field, value, dataItem);
					if(!clerkName){
						clerkName = dataItem.Updater;
					}
					return clerkName;
				};

				columns.length = 0;
				columns.push(colInd);
				columns.push(colHead);
				_.clone(ppsCommonLogUIStandardService.getStandardConfigForListView().columns).forEach(function (col) {
					columns.push(col);
				});
			}

			var translationServiceName  = $scope.getContentValue('translationService');
			function translateLogColumnName(response) {
				var deferred = $q.defer();
				ppsCommonLoggingHelper.translateLogColumnName(response.data.Logs, $injector.get(translationServiceName)).then(function () {
					deferred.resolve(response);
				});
				return deferred.promise;
			}

			service.parentDataService.unregisterSelectionChanged(service.load);
			// replace registerSelectionChanged(service.load) with calling loadSubItemList for reloading data
			// the original method loadSubItemList is empty, "override" it for supporting case that needs to reload data after executing wizard by selected item on parent container
			let containerId = $scope.getContentValue('id');
			service.loadSubItemList = function (){
				if (utilSrv.hasShowContainerInFront(containerId)) {
					service.load();
				}
			};

			service.parentDataService.unregisterSelectionChanged(service.refreshLoginClerk);
			service.parentDataService.registerSelectionChanged(service.refreshLoginClerk);

			service.load();
		}
	]);

})();
