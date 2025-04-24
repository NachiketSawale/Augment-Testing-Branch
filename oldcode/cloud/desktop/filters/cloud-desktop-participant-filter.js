/**
 * Created by lst on 4/24/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'cloud.desktop';

	angular.module(moduleName).filter('cloudDesktopParticipantFilter',
		['$sce',
			function () {

				return function (conversation) {

					if (!conversation || !conversation.participants) {
						return '';
					}

					var participants = conversation.participants();

					if (conversation.isGroupConversation()) {
						return 'Conversation (' + (participants.length + 1) + ' Participants)';
					} else {
						return participants[0].displayName();
					}
				};

			}]);

})(angular);