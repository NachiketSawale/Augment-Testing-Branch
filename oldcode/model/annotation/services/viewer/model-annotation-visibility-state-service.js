/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationVisibilityStateService';

	myModule.factory(svcName, modelAnnotationVisibilityStateService);

	modelAnnotationVisibilityStateService.$inject = ['_', 'modelAnnotationTypeIconService', 'PlatformMessenger'];

	function modelAnnotationVisibilityStateService(_, modelAnnotationTypeIconService, PlatformMessenger) {

		return {
			createStateStorage() {
				const internalState = {
					visibilitiesChanged: new PlatformMessenger(),
					fireVisibilitiesChanged(info) {
						internalState.visibilitiesChanged.fire(info);
					},
					visibilities: {}
				};

				for (let item of modelAnnotationTypeIconService.getItems()) {
					internalState.visibilities[item.id] = true;
				}

				return {
					isVisible(typeId) {
						return Boolean(internalState.visibilities[typeId]);
					},
					setVisible(typeId, visible) {
						const newValue = Boolean(visible);
						if (internalState.visibilities[typeId] !== newValue) {
							internalState.visibilities[typeId] = Boolean(visible);
							internalState.fireVisibilitiesChanged({
								newValue,
								changedTypeId: typeId
							});
						}
					},
					registerVisibilitiesChanged(handler) {
						internalState.visibilitiesChanged.register(handler);
					},
					unregisterVisibilitiesChanged(handler) {
						internalState.visibilitiesChanged.unregister(handler);
					},
					createToolItems(config) {
						const that = this;

						const result = {
							items: _.map(modelAnnotationTypeIconService.getItems(), function createItem(iconInfo) {
								return {
									id: `showAnnotationType${iconInfo.id}`,
									caption: iconInfo.text,
									type: 'check',
									value: that.isVisible(iconInfo.id),
									iconClass: iconInfo.res,
									fn: function () {
										that.setVisible(iconInfo.id, this.value);
									},
									annoTypeId: iconInfo.id
								};
							})
						};

						function updateButtons(info) {
							const item = _.find(result.items, {annoTypeId: info.changedTypeId});
							if (item) {
								item.value = info.newValue;
							}
						}

						if (_.isObject(config) && _.isFunction(config.updateTools)) {
							that.registerVisibilitiesChanged(updateButtons);
							result.destroy = function () {
								that.unregisterVisibilitiesChanged(updateButtons);
							};
						} else {
							result.destroy = function () {};
						}

						return result;
					}
				};
			}
		};
	}
})(angular);
