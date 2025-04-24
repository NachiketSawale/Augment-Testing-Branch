(function (angular) {

	'use strict';
	var moduleName = 'logistic.dispatching';
	/**
	 * @ngdoc directive
	 * @name logisticDispatchingRecordTypeLookup
	 * @requires  logisticDispatchingRecordTypeLookupDataService
	 * @description ComboBox to select the record Type
	 */

	angular.module(moduleName).directive('logisticDispatchingRecordTypeLookup', ['$q', '$injector', 'platformGridAPI', 'logisticDispatchingRecordTypeLookupDataService', 'BasicsLookupdataLookupDirectiveDefinition', 'logisticDispatchingHeaderDataService', 'logisticDispatchingConstantValues',
		function ($q, $injector, platformGridAPI, lookupDataService, BasicsLookupdataLookupDirectiveDefinition, logisticDispatchingHeaderDataService, logisticDispatchingConstantValues) {
			// spec for valueMember, doesn't get from 'Id' column, but from other columns('EstResourceTypeFk')
			var defaults = {
				lookupType: 'recordtype',
				valueMember: 'Id',
				displayMember: 'ShortKeyInfo.Translated',
				uuid: '20a81f9c86be4dadb38b97abd0c9a55b',
				columns: [
					{
						id: 'ShortKey',
						field: 'ShortKeyInfo.Translated',
						name: 'ShortKey',
						formatter: 'description',
						name$tr$: 'basics.customize.shortkey'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				filterOptions: {
					serverSide: false,
					fn: function (entity, relEntity) {
						if(!_.isNil(entity.HasPerformingPoolJob && !_.isNil(entity.HasReceivingPoolJob))){ //be sure that entity is a dispatch record not for example a drop point article
							if (!entity.IsLive) {
								return false;
							}

							const header = logisticDispatchingHeaderDataService.getSelected();

							if (!header.HasPerformingPoolJob && !header.HasReceivingPoolJob) {
								return true;
							} else {
								return entity.Id !== logisticDispatchingConstantValues.record.type.material && entity.Id !== logisticDispatchingConstantValues.record.type.sundryService;
							}
						} else if(relEntity.CacheToolFk){
							return entity.Id === logisticDispatchingConstantValues.record.type.plant ||
								entity.Id === logisticDispatchingConstantValues.record.type.smallTool;
						}
						else {
							return entity.Id === logisticDispatchingConstantValues.record.type.plant ||
								entity.Id === logisticDispatchingConstantValues.record.type.material ||
								entity.Id === logisticDispatchingConstantValues.record.type.fabricatedProduct ||
								entity.Id === logisticDispatchingConstantValues.record.type.smallTool;
						}
					}
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: lookupDataService
			});
		}
	]);
})(angular);
