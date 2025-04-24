/**
 * Created by grigoriadis on 27.01.2015.
 */
/* globals app */
(function (angular) {
	'use strict';

	angular.module('platform').factory('errorDialogService', ['$translate', '$sanitize', function ($translate, $sanitize) {
		var service = {};
		var exceptions = [];

		function sanitizeProperties(messageObj) {
			for (const key in messageObj) {
				if (messageObj.hasOwnProperty(key)) {
					const value = messageObj[key];
					if (typeof value === 'string') {
						messageObj[key] = $sanitize(value);
					}
				}
			}
		}

		function sanitizeException(exception) {
			if (typeof exception === 'object') {
				sanitizeProperties(exception);
			} else {
				exception = $sanitize(exception);
			}
		}

		service.addException = function (exception) {
			// console.log(JSON.stringify(exception));
			sanitizeException(exception);
			return exceptions.push(exception);
		};

		service.getLastException = function (withRemove) {
			return this.getException(exceptions.length - 1, withRemove);
		};

		function formatHex(code) {
			if (code && _.isNumber(code) && Math.abs(code) > 500) {
				return '0x' + code.toString(16);
			}
			return code;
		}

		service.getException = function (index, withRemove) {// jshint ignore:line
			var ex, tempEx;

			function getExceptionFromString(exceptionString) {
				// exceptions could be
				// - a wrong sql server is defined in IIS
				// - the app pool isn't running in IIS
				var ex, tempElem, searchedElem, stringParsed;

				ex = {
					errorCode: 500,
					errorMessage: exceptionString,
					errorDetail: undefined,
					errorVersion: app.productBuildVersion,
					detailMessage: '',
					detailStackTrace: '',
					detailMethod: '',
					detailMethodHtml: function () {
						return this.detailMethod.split('\n').join('<br>');
					},
					errorCodeMessage: function () {
						return this.errorMessage;
					}
				};

				// try to parse the string
				try {
					tempElem = document.createElement('html');
					tempElem.innerHTML = exceptionString;

					searchedElem = tempElem.getElementsByClassName('content-container');
					if (searchedElem.length) {
						ex.errorMessage = _.trim(searchedElem[0].innerText).split('\n').join('<br>');
						ex.detailMessage = _.reduce(Array.prototype.slice.call(searchedElem, 1, searchedElem.length), function (result, contentContainer) {
							return result + '<br>' + contentContainer.innerHTML;
						}, '');
						stringParsed = true;
					}

					if (!stringParsed) {
						searchedElem = tempElem.getElementsByTagName('title');
						if (searchedElem.length) {
							ex.errorMessage = _.trim(searchedElem[0].text);

							searchedElem = tempElem.getElementsByTagName('body');
							ex.detailMessage = searchedElem[0].innerHTML;
							stringParsed = true;
						}
					}
					// eslint-disable-next-line no-empty
				} catch (ex) {
				}

				return ex;
			}

			function getExceptionFromObject(exceptionObject) {
				let ex;

				function getExtendedErrorMessage(self) {
					let errorText = '<%=msg%>';

					return _.template(errorText)({
						msg: self.errorMessage,
						dtls: $translate.instant('platform.error.errorDetails'),
						detail: self.errorDetail
					});
				}

				function getStandardErrorMessage(self) {
					let errorText = '<%=msg%>';
					return _.template(errorText)({
						msg: self.errorMessage
					});
				}

				function getSmallErrorMessage(self) {
					let errorText = '<%=code%>';
					return _.template(errorText)({
						code: formatHex(self.errorCode)
					});
				}

				if (exceptionObject.status === 400) {
					// .net Core WebAPI validation error
					let errors = Object.entries(exceptionObject.errors);
					ex = {
						errorCode: 400,
						errorVersion: app.productBuildVersion,
						errorMessage: 'An unexcpected error in .net Core Validator occured.',
						errorDetail: errors.length ? (errors[0][0] + ' - ' + errors[0][1]) : null
					};
				} else {
					// - common exception
					// - BusinessLogicExeption from Backend
					// - etc
					ex = {
						errorCode: _.get(exceptionObject, 'ErrorCode', null) || _.get(exceptionObject, 'errorCode', null),
						errorVersion: app.productBuildVersion,
						errorMessage: _.get(exceptionObject, 'ErrorMessage') || _.get(exceptionObject, 'errorMessage') || _.get(exceptionObject, 'Message'),
						errorDetail: _.get(exceptionObject, 'ErrorDetail') || _.get(exceptionObject, 'errorDetail') || _.get(exceptionObject, 'MessageDetail'),
						detailMessage: _.get(exceptionObject, 'Exception.ErrorMessage') || _.get(exceptionObject, 'MessageDetail'),
						detailStackTrace: exceptionObject.StackTrace,
						detailMethod: _.get(exceptionObject, 'Exception.ExceptionMethod')
					};
				}

				ex.detailMethodHtml = function () {
					return this.detailMethod.split('\n').join('<br>');
				};
				ex.errorCodeMessage = function () {
					if (this.errorCode === 0) {
						return this.errorMessage;
					}
					if (this.errorDetail) {
						return getExtendedErrorMessage(this);
					}
					if (this.errorMessage) {
						return getStandardErrorMessage(this);
					}
					if (this.errorCode) {
						return getSmallErrorMessage(this);
					}
				};

				// some clean-up
				if (ex.detailMessage === ex.errorMessage) {
					ex.detailMessage = undefined;
				}
				//sanitizeProperties(ex);
				return ex;
			}

			if (index < exceptions.length) {
				tempEx = exceptions[index];

				if (_.isString(tempEx)) {
					ex = getExceptionFromString(tempEx);
				} else if (_.isObject(tempEx)) {
					ex = getExceptionFromObject(tempEx);
				}

				if (withRemove) {
					exceptions.splice(index, 1);
				}
			}

			if (ex) {
				ex.errorMessage = ex.errorMessage.replace(/\\n/g, '<br>');
			}

			return ex;
		};

		service.clear = function () {
			exceptions = [];
		};

		service.logExceptions = function (withRemove) {
			_.forEach(exceptions, function (item) {
				console.log(item);
			});
			if (withRemove) {
				this.clear();
			}
		};

		service.countExceptions = function () {
			return exceptions.length;
		};

		return service;
	}]);

})(angular);
