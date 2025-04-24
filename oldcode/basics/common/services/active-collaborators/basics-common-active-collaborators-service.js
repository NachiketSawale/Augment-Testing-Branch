/*
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonActiveCollaboratorsService', basicsCommonActiveCollaboratorsService);

	basicsCommonActiveCollaboratorsService.$inject = ['$rootScope', 'mainViewService', '_', '$http', 'globals', '$interval', 'PlatformMessenger'];

	function basicsCommonActiveCollaboratorsService($rootScope, mainViewService, _,$http, globals, $interval, PlatformMessenger) {
		const privateData = {
			area: '',
			context: '',
			collaboratorsUpdated: new PlatformMessenger()
		};

		let CollaboratorInterval = null;

		const fetchCollaborators  = _.debounce(function doUpdateCollaborators() {
			return $http.get(globals.webApiBaseUrl + 'basics/common/activecollaborators/editors', {
				params: {
					area: privateData.area || '',
					context: privateData.context || ''
				}
			}).then((response) => {
				privateData.collaboratorsUpdated.fire(response.data);
			}).catch((error) => {
				// If active collaborators could not be retrieved, this should not crash anything in the application.
				// In this case, the list of active collaborators should simply be emptied.
				privateData.collaboratorsUpdated.fire([]);
			});
		}, 5000, { maxWait: 3000 });

		function startCollaboration() {
			if (!CollaboratorInterval) {
				updateCollaborators();
				CollaboratorInterval = $interval(updateCollaborators, 30000);
			}
		}

		function stopCollaboration() {
			if (CollaboratorInterval) {
				$interval.cancel(CollaboratorInterval);
				CollaboratorInterval = null;
			}
		}

		function updateCollaborators() {
			fetchCollaborators();
		}

		const svc = {
			setContextInfo(ctxInfo) {
				if (typeof ctxInfo !== 'object') {
					ctxInfo = {
						context: ctxInfo
					};
				}

				let shouldUpdate = false;

				if (ctxInfo.area) {
					const newArea = ctxInfo.area || '';
					if (newArea !== privateData.area) {
						privateData.area = newArea;
						privateData.context = '';
						shouldUpdate = true;
					}
				}
				if (ctxInfo.context) {
					const newContext = ctxInfo.context || '';
					if (newContext !== privateData.context) {
						privateData.context = newContext;
						shouldUpdate = true;
					}
				}
				if (shouldUpdate) {
					updateCollaborators();
				}
			},
			updateCollaborators,
			stopCollaboration,
			startCollaboration,

			initDataService(serviceContainer, rootOptions) {
				if (rootOptions.collaborationContextProvider) {
					svc.setContextInfo({
						area: mainViewService.getCurrentModuleName()
					});

					if (typeof rootOptions.collaborationContextProvider === 'function') {
						serviceContainer.service.registerSelectionChanged(function () {
							svc.setContextInfo(rootOptions.collaborationContextProvider());
						});
						svc.setContextInfo(rootOptions.collaborationContextProvider());
					} else if (typeof rootOptions.collaborationContextProvider === 'object') {
						if (rootOptions.collaborationContextProvider.subscribe) {
							rootOptions.collaborationContextProvider.subscribe(function (ctxInfo) {
								svc.setContextInfo(ctxInfo);
							});
						} else if (rootOptions.collaborationContextProvider.register) {
							rootOptions.collaborationContextProvider.register(function (ctxInfo) {
								svc.setContextInfo(ctxInfo);
							});
						}
					}
				}
			},

			registerCollaboratorsUpdated(handler) {
				privateData.collaboratorsUpdated.register(handler);
			},
			unregisterCollaboratorsUpdated(handler) {
				privateData.collaboratorsUpdated.unregister(handler);
			}
		};

		$rootScope.$on('$stateChangeSuccess', function () {
			privateData.collaboratorsUpdated.fire([]);
			svc.setContextInfo({
				area: mainViewService.getCurrentModuleName()
			});
			updateCollaborators();
			startCollaboration();
		});



		return svc;
	}
})(angular);