/**
 * Created by ysl on 12/29/2017.
 */
(function () {

	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyLogMessageController', [
		'$scope',
		'$interval',
		'basicsCompanyImportContentResultService',
		function ($scope,
		          $interval,
		          basicsCompanyImportContentResultService) {
			$scope.LogMessage = 'Loading log message.....';
			$scope.logLevel = {
				info: true,
				error: false,
				warning: false,
				debug: false
			};

			var logLevelEnum = {
				none: 0,
				info: 1,
				error: 3,
				warning: 2,
				debug: 4
			};

			function convertMessageType(type) {
				if(logLevelEnum.info === type){
					return '<span style="color:green">[Info]</span>';
				}

				if(logLevelEnum.error === type){
					return '<span style="color:red">[Error]</span>';
				}

				if(logLevelEnum.warning === type){
					return '<span style="color:#dada07">[Warning]</span>';
				}

				if(logLevelEnum.debug === type){
					return '<span style="color:gray">[Debug]</span>';
				}
			}

			function formatTime(timeString) {
				if(!timeString){
					return '';
				}
				if(angular.isString(timeString)){
					try{
						var d = new Date(timeString);
						return d.toLocaleString();
					}catch (e){
						return timeString;
					}
				}else{
					return timeString.toString();
				}
			}

			$scope.$watch('logLevel', function () {
				$scope.LogMessage = formateLogMessage(basicsCompanyImportContentResultService.log);
			}, true);

			function formateLogMessage(responseData) {
				if (!responseData) {
					return;
				}
				var formatedLogMessage = '';
				var logObjects = responseData;
				if(!Array.isArray(responseData))
				{
					 logObjects = JSON.parse(responseData);
				}
				_.forEach(logObjects, function (logObject) {
					if(!logObject){
						//formatedLogMessage += 'Unknown Error <br/>';
						return;
					}
					if (($scope.logLevel.info === true && logLevelEnum.info === logObject.MessageType) ||
						($scope.logLevel.error === true && logLevelEnum.error === logObject.MessageType) ||
						($scope.logLevel.warning === true && logLevelEnum.warning === logObject.MessageType) ||
						($scope.logLevel.debug === true && logLevelEnum.debug === logObject.MessageType)) {

						formatedLogMessage += convertMessageType(logObject.MessageType)+
							' [ ' + formatTime(logObject.LoggedTime) + ' ] : ' +
							replace(logObject.ErrorContent, '\r\n', '<br/>') + '<br/>';

						// formatedLogMessage += 'LoggedTime: ' + formatTime(logObject.LoggedTime) + '<br/>';
						// formatedLogMessage += 'MessageType: ' + convertMessageType(logObject.MessageType) + '<br/>';
						// //formatedLogMessage += 'IsValid: ' + JSON.stringify(logObject.IsValid) + '<br/>';
						// formatedLogMessage += 'Message:' + JSON.stringify(logObject.ErrorContent) + '<br/>';
						formatedLogMessage += '<br/>';
					}
				});
				return formatedLogMessage;
			}

			function replace(inputStr, oldStr, newStr) {
				if(!inputStr){
					return inputStr;
				}
				var regexOld = new RegExp(oldStr, 'g');
				return inputStr.replace(regexOld, newStr);
			}

			function setLog() {
				basicsCompanyImportContentResultService.getLogMessage($scope.modalOptions.taskEntity.Id, $scope.modalOptions.taskEntity.BasImportContentJobFk)
					.then(function (response) {
						$scope.LogMessage = formateLogMessage(response.data);
						basicsCompanyImportContentResultService.log = response.data;
					});
			}

			setLog();

			// var logFreshTimer = $interval(function () {
			//     setLog();
			// }, 10000);


			$scope.$on('$destroy', function () {
				// $interval.cancel(logFreshTimer);
			});
		}
	]);
})();