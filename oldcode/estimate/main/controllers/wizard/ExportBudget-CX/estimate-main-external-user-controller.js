/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	angular.module('estimate.main').controller('estimateMainExternalUserController', ['$scope', '$injector', 'estimateMainExternalUserService',
		function ($scope, $injector,estimateMainExternalUserService) {

			$scope.selections = {valueMember:'Id', displayMember:'Username',serviceName: 'estimateMainExternalUserService' };


			$scope.noCxApiUser = false;

			estimateMainExternalUserService.setScope($scope);

			$scope.Context.iTWOcxCredential = $scope.Context.iTWOcxCredential || {};

			$scope.Entity = {
				UserId: $scope.Context.iTWOcxCredential ? $scope.Context.iTWOcxCredential.UserId : 0
			};

			$scope.Entity.CxUserName = $scope.Entity.CxUserName || $scope.Context.iTWOcxCredential.UserName;
			$scope.Entity.CxPassword = $scope.Entity.CxPassword || $scope.Context.iTWOcxCredential.Password;

			$scope.onSelectedChanged = function(item) {
				let userId = item;
				let user = estimateMainExternalUserService.getItem(userId);
				if(user){
					$scope.Context.iTWOcxCredential.UserName = user.Username;
					$scope.Context.iTWOcxCredential.Password = user.Password;
					$scope.Context.iTWOcxCredential.UserId = user.Id;

					estimateMainExternalUserService.loadCxProject();
				}
			};

			$scope.loginToiTWOcx = function () {
				$injector.get('$timeout')(function () {
					if(!!$scope.Entity.CxUserName && !!$scope.Entity.CxPassword){
						$scope.Context.iTWOcxCredential.UserName = $scope.Entity.CxUserName;
						$scope.Context.iTWOcxCredential.Password = $scope.Entity.CxPassword;
						estimateMainExternalUserService.loginToITWOcx();
					}
				});

			};
		}]);


	angular.module('estimate.main').controller('estimateMainExternalUserControllerV10', [/* '$scope', '$injector', 'estimateMainExternalUserServiceV1', */
		function (/* $scope, $injector,estimateMainExternalUserService */) {

		}]);

})(angular);
