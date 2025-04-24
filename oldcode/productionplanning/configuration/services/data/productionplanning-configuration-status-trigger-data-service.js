(angular => {
	/* global globals */
	'use strict';

	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).service('ppsStatusInheritedTriggerDataService', ppsStatusInheritedTriggerDataService);

	ppsStatusInheritedTriggerDataService.$inject = ['$http'];

	function ppsStatusInheritedTriggerDataService($http) {
		const service = {};
		const listLoaded = new Platform.Messenger();
		const entityToTranslationMap = {
			12: 'productionplanning.item.entityItem',
			13: 'productionplanning.common.product.entity',
			15: 'productionplanning.productionset.entityProductionset',
		};
		let data = [];

		service.load = () => {
			if (data.length > 0) {
				listLoaded.fire();
				return;
			}

			$http.get(globals.webApiBaseUrl + 'productionplanning/configuration/ppsstatustriggerrule/gettriggers')
				.then(function (response) {
					data = response.data;
					listLoaded.fire();
				});
		};

		service.registerListLoaded = callback => {
			listLoaded.register(callback);
		};

		service.unregisterListLoaded = callback => {
			listLoaded.unregister(callback);
		};

		service.getStatusTriggerData = function () {
			const list = data;
			if (list.length === 0) {
				return [];
			}

			for (const item of list) {
				PpsStatusTriggerFactory.create(item.Id, item.PpsEntitySourceFk, item.PpsEntityTargetFk);
			}

			return PpsStatusTriggerFactory.getTriggers();
		};

		class PpsStatusTriggerFactory {
			static _triggerMap = new Map();

			constructor() {
				if (new.target === PpsStatusTriggerFactory) {
					throw new Error('cannot initialize PpsStatusTriggerFactory');
				}
			}

			static create(id, sourceId, targetId) {
				if (!this._triggerMap.has(sourceId)) {
					this._triggerMap.set(sourceId, new PpsStatusTrigger(id, sourceId));
				}

				const source = this._triggerMap.get(sourceId);
				source.addTarget(new PpsStatusTrigger(id, targetId, source));

				return source;
			}

			static getTriggers() {
				return [...PpsStatusTriggerFactory._triggerMap.values()];
			}
		}

		class PpsStatusTrigger {
			to = ' productionplanning.configuration.statusInheritedTriggering.to ';

			constructor(triggerId, entityId, source = null) {
				this.id = triggerId;
				this.entityId = entityId;
				this.source = source;
				this.description = '';
				if (source) {
					this.description += source.description + this.to;
				}
				this.description += entityToTranslationMap[entityId];
				this.target = [];
			}

			addTarget(trigger) {
				if (!trigger instanceof PpsStatusTrigger) {
					throw new Error('target should be a PpsStatusTrigger');
				}
				if (this === trigger) {
					throw new Error('cannot add itself');
				}
				if (this.target.filter(i => i.id === trigger.id).length > 0) {
					// existed
					return;
				}
				this.target.push(trigger);
			}

			getTargetIds() {
				return this.target.map(i => i.id);
			}

			hasAnyTarget() {
				return this.target.length > 0;
			}

			hasSource() {
				return !!this.source;
			}
		}

		return service;
	}
})(angular);