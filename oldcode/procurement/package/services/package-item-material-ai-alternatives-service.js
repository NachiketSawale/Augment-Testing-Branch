/**
 * Created by gaz on 04/05/2018.
 */

(function () {

	'use strict';

	var moduleName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Platform */
	angular.module(moduleName).factory('procurementPackageItemMaterialAiAlternativesService', [
		'_',
		'$q',
		'$http',
		'platformGridAPI',
		'procurementContextService',
		'procurementPackageDataService',
		'platformRuntimeDataService',
		function (_,
			$q,
			$http,
			platformGridAPI,
			procurementContextService,
			procurementPackageDataService,
			platformRuntimeDataService) {

			var service = {};
			var _gridId = '8425d841574a458787927413986a109f';  // selected codes grid
			var _busyStatus = false;
			service.busyStatusChanged = new Platform.Messenger();
			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			};

			service.set = function (params) {
				setBusyStatus(true);
				var data = {};
				var selected = procurementPackageDataService.getSelected();
				if (selected && selected.ProjectFk) {
					data.ProjectId = selected.ProjectFk;
				}
				data.CompanyCurrencyId = procurementContextService.companyCurrencyId;
				data.AIReplaceMaterials = [];

				var mainDatas = params.packageItemsData.Main;
				var alternatives = params.packageItemsData.Alternatives;
				_.forEach(mainDatas, function (mainData) {
					var alternative = _.find(alternatives, {PrcItemId: mainData.Id, MaterialFk: mainData.MdcMaterialFk});
					if (mainData.IsCheckAi === true) {
						data.AIReplaceMaterials.push(alternative);
					}
				});

				return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitem/mtwoai/aireplaceitemmaterial', data);
			};

			service.updateReadOnly = function (items) {
				_.forEach(items, function (item) {
					if (item.MdcMaterialFk === item.OriginalMaterialFk) {
						platformRuntimeDataService.readonly(item, [
							{field: 'MdcMaterialFk', readonly: true},
							{field: 'IsCheckAi', readonly: true}]
						);
					}
				});
				return items;
			};

			service.validateMdcMaterialFk = function (entity, value, alternatives) {
				var alternative = _.find(alternatives, {PrcItemId: entity.Id, MaterialFk: value});
				if (angular.isObject(alternative)) {
					entity.SuggestedTotalCurrency = alternative.TotalCurrency;
				}
				entity.IsCheckAi = entity.OriginalMaterialFk !== value;
			};

			// needed for code lookup to get used codes
			service.getList = function () {
				return platformGridAPI.items.data(_gridId);
			};

			var selectedId = null;
			service.getSelectedId = function () {
				return selectedId;
			};
			service.setSelectedId = function (id) {
				selectedId = id;
			};

			service.init = function () {
				angular.noop();
			};

			return service;

		}
	]);
})(angular);