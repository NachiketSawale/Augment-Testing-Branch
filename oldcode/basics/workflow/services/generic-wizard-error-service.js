(function (angular) {
	'use strict';

	angular.module('basics.workflow').factory('genericWizardErrorService', genericWizardErrorService);

	genericWizardErrorService.$inject = ['_'];

	function genericWizardErrorService(_) {
		var service = {};
		var messageList = [];

		/**
		 *
		 * @param messageId id of the message
		 * @param messageText text of the message
		 * @param containerUuid uuid of the dependent container
		 */
		service.addMessage = function addMessage(messageId, messageText, containerUuidList, isWarning = false) {
			var isAlreadyAdded = _.some(messageList, {id: messageId});
			if (!_.isArray(containerUuidList)) {
				containerUuidList = [containerUuidList];
			}
			if (!isAlreadyAdded) {
				var message = {
					id: messageId,
					text: messageText,
					containerUuidList: containerUuidList,
					isWarning: isWarning
				};
				messageList.push(message);
			}
		};

		service.addMessageList = function addMessageList(errorList) {
			if (_.isArray(errorList)) {
				_.forEach(errorList, function (message) {
					var isAlreadyAdded = _.some(messageList, {id: message.id});

					if (!_.isArray(message.containerUuidList)) {
						message.containerUuidList = [message.containerUuidList];
					}

					if (!isAlreadyAdded) {
						messageList.push(message);
					}
				});
			}
		};

		service.removeMessage = function removeMessage(messageId) {
			if (!_.isEmpty(messageList)) {
				_.remove(messageList, {id: messageId});
			}
		};

		service.removeContainerMessages = function removeContainerMessages(containerUuid) {
			if (!_.isEmpty(messageList)) {
				_.remove(messageList, function (message) {
					return _.some(message.containerUuidList, function (uuid) {
						return uuid === containerUuid;
					});
				});
			}
		};

		service.removeStepMessages = function removeStepMessages(containerList) {
			if (!_.isEmpty(messageList)) {
				var containerUuidList = _.map(containerList, 'Instance.uuid');

				_.forEach(containerUuidList, function (containerUuid) {
					_.remove(messageList, function (message) {
						return _.some(message.containerUuidList, function (uuid) {
							return uuid === containerUuid;
						});
					});
				});
			}
		};

		service.removeAllMessages = function removeAllMessages() {
			messageList.length = 0;
		};

		service.resetMessageList = function resetMessageList() {
			messageList = [];
		};

		service.getMessageListForStep = function getMessageListForStep(containerList) {
			var containerUuidList = _.map(containerList, 'Instance.uuid');
			var messageListForStep = [];

			_.forEach(containerUuidList, function (containerUuid) {
				messageListForStep.push(..._.filter(messageList, function (message) {
					return _.some(message.containerUuidList, function (uuid) {
						return uuid === containerUuid;
					});
				}));
			});

			return messageListForStep;
		};

		service.getErrorMessageListForStep = function getErrorMessageListForStep(containerList) {
			var mList = service.getMessageListForStep(containerList);
			return _.filter(mList, function (message) {
				return !message.isWarning;
			});
		};

		service.getWarningMessageListForStep = function getWarningMessageListForStep(containerList) {
			var mList = service.getMessageListForStep(containerList);
			return _.filter(mList, function (message) {
				return message.isWarning;
			});
		};

		service.getAllErrorMessages = function getAllErrorMessages() {
			return _.filter(messageList, function (message) {
				return !message.isWarning;
			});
		};

		service.getAllWarningMessages = function getAllWarningMessages() {
			return _.filter(messageList, function (message) {
				return message.isWarning;
			});
		};

		service.getAllMessages = function getAllMessages() {
			return messageList;
		};

		return service;
	}
})(angular);
