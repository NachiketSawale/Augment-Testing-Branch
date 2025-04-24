/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceRowReadonlyExtension
	 * @function
	 * @description
	 * platformDataServiceRowReadonlyExtension adds selection behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceReloadEntitiesExtension', PlatformDataServiceReloadEntitiesExtension);

	PlatformDataServiceReloadEntitiesExtension.$inject = ['_', 'platformDataServiceSidebarSearchExtension', 'platformDataServiceDataProcessorExtension'];

	function PlatformDataServiceReloadEntitiesExtension(_, platformDataServiceSidebarSearchExtension, platformDataServiceDataProcessorExtension) {
		var self = this;

		function determineSearchFilterForEntities(entities, options) {
			var ids = [];

			if (options.entityRole.root.useIdentification) {
				if (_.isFunction(options.entityRole.root.provideIdentificationFn)) {
					_.forEach(entities, function (entity) {
						ids.push(options.entityRole.root.provideIdentificationFn(entity));
					});
				} else {
					_.forEach(entities, function (entity) {
						ids.push({Id: entity.Id});
					});
				}
			} else {
				_.forEach(entities, function (entity) {
					ids.push(entity.Id);
				});
			}

			return {
				PKeys: ids,
				IncludeNonActiveItems: true
			};
		}

		function reloadEntitiesByIds(filter, data) {
			return platformDataServiceSidebarSearchExtension.reloadEntitiesViaSearchFilter(filter, data, self);
		}

		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceReloadEntitiesExtension
		 * @description saves the internal state of a data item when it is selected
		 * @param entity {object} the entity which original state is to be saved.
		 * @returns state
		 */
		this.reloadEntities = function reloadEntities(entities, data, options) {
			var filter = determineSearchFilterForEntities(entities, options);
			return reloadEntitiesByIds(filter, data);
		};

		this.onReloadSucceeded = function onReloadSucceeded(response, data) {
			var dtos = data.getEntitiesFromLoadedData(response);
			if (_.isArray(dtos)) {
				if (_.isFunction(data.provideEntityIdentification)) {
					_.forEach(dtos, function (dto) {
						let ident = data.provideEntityIdentification(dto);
						var oldItem = _.find(data.itemList, function (item) {
							return _.isEqual(data.provideEntityIdentification(item), ident);
						});

						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, dto, true, data);
							platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
						}
					});
				} else {
					_.forEach(dtos, function (item) {
						var oldItem = _.find(data.itemList, {Id: item.Id});

						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, item, true, data);
							platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);
						}
					});
				}
			}
		};
	}
})();
