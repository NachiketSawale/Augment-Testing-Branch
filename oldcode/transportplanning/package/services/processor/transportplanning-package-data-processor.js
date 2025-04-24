/**
 * Created by las on 8/18/2017.
 */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	/**
	 * @ngdoc service
	 * @name transportplanningPackageDataProcessor
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningPackageDataProcessor is the service to set fields  dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).factory('transportplanningPackageDataProcessor', transportplanningPackageDataProcessor);

	transportplanningPackageDataProcessor.$inject = [
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'$injector',
		'_',
		'transportplanningTransportRouteStatusLookupService',
		'transportplanningPackageTypeHelperService',
		'packageTypes',
	'transportplanningPackageStatusLookupService',
	'ppsCommonCodGeneratorConstantValue',
		'basicsCompanyNumberGenerationInfoService',
		'productionplanningCommonProductStatusLookupService'];

	function transportplanningPackageDataProcessor(platformRuntimeDataService,
		basicsLookupdataLookupDescriptorService,
		$injector,
		_,
		routeStatusServ,
		packageTypeHelperServ,
		packageTypes,
		transportplanningPackageStatusLookupService,
		ppsCommonCodGeneratorConstantValue,
		basicsCompanyNumberGenerationInfoService,
		productionplanningCommonProductStatusLookupService) {

		var service = {};
		var editableEventTypeSlotFields = []; // editable event date slot columns

		function setCompanyFkByDispHeader(dto) {
			var dispHeadersCache = basicsLookupdataLookupDescriptorService.getData('DispatchHeader');
			if(dto.LgmDispatchHeaderFk && dispHeadersCache) {
				var header = dispHeadersCache[dto.LgmDispatchHeaderFk];
				if (header) {
					dto.CompanyFk = header.CompanyFk;
				}
			}
		}

		function setEventDateSlotReadonlyByPkgType(item) {
			if(item.TrsPkgTypeFk !== packageTypes.Product && item.TrsPkgTypeFk !== packageTypes.Bundle) {
				if(editableEventTypeSlotFields.length > 0) {
					service.setColumnsReadOnly(item, editableEventTypeSlotFields, true);
				}
			}
		}

		service.setDangerGoodsROByPkgType = function (item){
			var isReadOnly = item.TrsPkgTypeFk === packageTypes.TransportRequisition || item.TrsPkgTypeFk === packageTypes.Package  || item.TrsPkgTypeFk === packageTypes.Bundle;
				service.setColumnsReadOnly(item, ['DangerclassFk','PackageTypeFk','DangerQuantity','UomDGFk'], isReadOnly);
				};

		service.registCustomColumns = function () {
			// get editable event date slot columns
			editableEventTypeSlotFields = [];
			var customColumnsServiceFactory = $injector.get('ppsCommonCustomColumnsServiceFactory');
			var pkgCustomColumnsService = customColumnsServiceFactory.getService(moduleName);
			pkgCustomColumnsService.eventTypeSlots.forEach(function (slot) {
				if(!slot.IsReadOnly) {
					editableEventTypeSlotFields.push(slot.FieldName);
				}
			});
		};

		service.processItem = function processItem(item) {
			if (item) {
				var pkgstatusList = transportplanningPackageStatusLookupService.getList();
				var pkgstatus = _.find(pkgstatusList, {Id: item.TrsPkgStatusFk});
				if(pkgstatus.Backgroundcolor) {
					item.BackgroundColor = pkgstatus.Backgroundcolor;
				}

				var prodstatusList = productionplanningCommonProductStatusLookupService.getList();
				var prodstatus = _.find(prodstatusList, { Id: item.ProductStatus });
				if (!_.isUndefined(prodstatus)) {
					if (prodstatus.BackgroundColor) {
						item.ProductStatusBackgroundColor = prodstatus.BackgroundColor;
					}
				}

				setCompanyFkByDispHeader(item);

				//set reaonly columns by TrsRouteFk and TrsRteStatusFk
				var readonlyFields = [];
				if (item.TrsRteStatusFk) {
					var statusList = routeStatusServ.getList();
					var status = _.find(statusList, {Id: item.TrsRteStatusFk});
					var flag = (status && status.IsInTransport === true);
					if (flag) {
						readonlyFields.push('Code', 'TrsRouteFk', 'ProjectFk', 'TransportPackageFk', 'LgmDispatchHeaderFk', 'LgmDispatchRecordFk',
							'LgmJobSrcFk', 'LgmJobDstFk', 'TrsWaypointSrcFk', 'TrsWaypointDstFk', 'Quantity', 'UomFk', 'Good', 'Weight', 'UomWeightFk',
							'Length', 'UomLengthFk', 'Width', 'UomWidthFk', 'Height', 'UomHeightFk', 'trsgoodsfk');
					}
					if(status.BackgroundColor) {
						item.TrsRteBackgroundColor = status.BackgroundColor;
					}
				}

				//Set fields readonly when Version > 0. Some fields(like TrsPkgTypeFk) can only modify on creation.
				if (item.Version > 0) {
					readonlyFields.push('TrsPkgTypeFk');
					if (!packageTypeHelperServ.hasQty(item.TrsPkgTypeFk)) {
						readonlyFields.push('Quantity', 'UomFk');
					}

					if (item.ProjectFk !== null) {
						readonlyFields.push('ProjectFk');
					}
					if (item.TrsRouteFk !== null) {
						readonlyFields.push('TrsRouteFk');
					}
				}
				//Set propagable fields readonly if package is not root package
				if (item.TransportPackageFk !== null) {
					readonlyFields = _.union(readonlyFields, ['TrsRouteFk', 'ProjectFk', 'LgmJobSrcFk', 'LgmJobDstFk', 'TrsWaypointSrcFk', 'TrsWaypointDstFk']);
				}
				service.setColumnsReadOnly(item, readonlyFields, true);

				if(readonlyFields.indexOf('UomFk') <= -1){
					service.processItemUomFkByGood(item);
				}

				service.setColumnsReadOnly(item, ['LengthCalculated', 'WidthCalculated', 'HeightCalculated', 'WeightCalculated'], true);
				setEventDateSlotReadonlyByPkgType(item);
				service.setDangerGoodsROByPkgType(item);

				var categoryId = ppsCommonCodGeneratorConstantValue.CategoryConstant.TrsPackageCat;
				if(item.Version === 0 && categoryId > 0 &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsPackageNumberInfoService').hasToGenerateForRubricCategory(categoryId))
				{
					item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsPackageNumberInfoService').provideNumberDefaultText(categoryId, item.Code);
					service.setColumnsReadOnly(item, ['Code'], true);
				}
				else {
					service.setColumnsReadOnly(item, ['Code'], false);
				}

				setColsReadonlyIfUpstreamItemFkSet(item);
			}
		};

		service.processItemUomFkByGood = function (item) {
			//Set uom field readonly if Good is set and pkgType is Resource or Material.
			var isSetGoodByMatOrRes = (item.TrsPkgTypeFk === packageTypes.Material || item.TrsPkgTypeFk === packageTypes.Resource) && item.Good !== null;
			service.setColumnsReadOnly(item,['UomFk'],isSetGoodByMatOrRes);
		};

		service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
			if (columns.length <= 0) {
				return;
			}
			var fields = [];
			_.each(columns, function (column) {
				fields.push({field: column, readonly: flag});
			});
			platformRuntimeDataService.readonly(item, fields);
		};

		function setColsReadonlyIfUpstreamItemFkSet(item) {
			platformRuntimeDataService.readonly(item, !!item.PpsUpstreamItemFk);
		}

		return service;
	}
})(angular);