/**
 * Created by zwz on 10/19/2018.
 */
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	/**
	 * @ngdoc service
	 * @name transportplanningPackageDataServicePropertychangedManager
	 * @function
	 * @requires
	 *
	 * @description
	 * transportplanningPackageDataServicePropertychangedManager is use for handling property changed of package.
	 *
	 */
	angular.module(moduleName).factory('transportplanningPackageDataServicePropertychangedManager', service);

	service.$inject = ['$injector', '_', 'cloudCommonGridService', 'packageTypes', 'basicsLookupdataLookupDescriptorService', 'transportplanningPackageGoodsHandler'];

	function service($injector, _, cloudCommonGridService, packageTypes, basicsLookupdataLookupDescriptorService, packageGoodsHandler) {
		var service = {};

		service.onPropertyChanged = function (entity, field, dataService) {
			var prop = 'on' + field + 'Changed';
			if (service[prop]) {
				if(_.isNil(dataService)){
					dataService = getDataService(entity);
				}
				service[prop](entity, field, dataService);
			}
		};

		service.onProjectFkChanged = service.onLgmJobSrcFkChanged = service.onLgmJobDstFkChanged = function (entity, field, dataService) {
			if (dataService) {
				setChildPackagesFields(entity, [field], dataService);
			}
			else {
				setChildPackagesFields(entity, [field], $injector.get('transportplanningPackageMainService'));
				setChildPackagesFields(entity, [field], $injector.get('transportplanningTransportPackageDataService'));
			}
		};

		service.onTrsWaypointSrcFkChanged = service.onTrsWaypointDstFkChanged = function (entity, field, dataService) {
			var relField = {
				'TrsWaypointSrcFk': 'LgmJobSrcFk',
				'TrsWaypointDstFk': 'LgmJobDstFk'
			}[field];
			if (dataService) {
				setWaypointFk(entity, field, relField, dataService);
			}
			else {
				setWaypointFk(entity, field, relField, $injector.get('transportplanningPackageMainService'));
				setWaypointFk(entity, field, relField, $injector.get('transportplanningTransportPackageDataService'));
			}
		};

		function setWaypointFk(pkg, field, relField, dataService) {
			var item = dataService.getItemById(pkg.Id);
			if (item && item === pkg) {
				if (pkg[field] === null) {
					pkg[relField] = null;
					setChildPackagesFields(pkg, [field, relField], dataService);
				}
				else {
					basicsLookupdataLookupDescriptorService.loadItemByKey('transportplanningTransportWaypointLookupDataService', pkg[field]).then(function (data) {
						if (data) {
							pkg[relField] = data.LgmJobFk;
							setChildPackagesFields(pkg, [field, relField], dataService);
						}
					});
				}
			}
		}

		function setChildPackagesFields(pkg, fields, dataService) {
			var item = dataService.getItemById(pkg.Id);
			if (item && item === pkg) {
				if (fields === null || fields.length <= 0) {
					return;
				}
				if (pkg.ChildPackages === null || pkg.ChildPackages.length <= 0) {
					return;
				}
				var list = [];
				cloudCommonGridService.flatten(pkg.ChildPackages, list, 'ChildPackages');
				_.each(list, function (p) {
					_.each(fields, function (field) {
						p[field] = pkg[field];
					});
					if (dataService.getServiceName() === 'transportplanningTransportPackageDataService') {
						dataService.markItemAsModified(p);//if dataService is transportplanningPackageMainService, we don't need to do markItemAsModified for ChildPackages of current pkg
					}
				});
				dataService.gridRefresh();
			}
		}

		service.onTrsRouteFkChanged = function (entity, field, dataService) {
			if (dataService && dataService.SetTrsRouteFkAndRefreshGrid) {
				dataService.SetTrsRouteFkAndRefreshGrid(entity, field);
			}
			else {
				$injector.get('transportplanningPackageMainService').SetTrsRouteFkAndRefreshGrid(entity, field);
			}
		};

		service.onLgmDispatchHeaderFkChanged = function (entity) {
			//reset value of field Good when LgmDispatchHeaderFk changed
			entity.LgmDispatchRecordFk = null;
		};

		service.onTrsPkgTypeFkChanged = function (entity, field, dataService) {
			//reset value of field Good when TrsPkgTypeFk changed
			entity.Good = null;
			clearRelativePropertiesForGoods(entity);
			refreshGrid(dataService);
		};

		service.onGoodChanged = function (entity, field, dataService) {
			packageGoodsHandler.setRelativePropertiesByGoods(entity, dataService);
			// record transport goods has been assigned, for transport goods data filter
			var options = packageTypes.properties[entity.TrsPkgTypeFk];
			if (options.assignedRecordKey) {
				var hasGoodsPkgs = _.filter(dataService.getList(), function (item) {
					return item.TrsPkgTypeFk === entity.TrsPkgTypeFk && !!item.Good;
				});
				var goods = _.map(hasGoodsPkgs, function (pkg) {
					return {Id: pkg.Good};
				});
				var storage = $injector.get('basicsCommonBaseDataServiceReferenceActionExtension');
				storage.clearAssignedItemsRecord(options.assignedRecordKey);
				$injector.get('basicsCommonBaseDataServiceReferenceActionExtension').recordAssignedItems(options.assignedRecordKey, goods);
			}
		};

		function clearRelativePropertiesForGoods(pkg) {
			pkg.Weight = null;
			pkg.UomWeightFk = 0;
			pkg.UomFk = null;
			//set UomFk readonly or editable after Good Modified.
			$injector.get('transportplanningPackageDataProcessor').processItemUomFkByGood(pkg);

			//any way,ResResourceFk/MaterialFk should be null when the goods is null
			pkg.ResResourceFk = null;
			pkg.MaterialFk = null;

			// clear danagerous goods info when package type is change
			pkg.DangerclassFk = null;
			pkg.PackageTypeFk = null;
			pkg.DangerQuantity = null;
			pkg.UomDGFk = null;
			$injector.get('transportplanningPackageDataProcessor').setDangerGoodsROByPkgType(pkg);
		}

		function refreshGrid(dataService) {
			if (dataService) {
				dataService.gridRefresh();
			}
			else {
				$injector.get('transportplanningPackageMainService').gridRefresh();
				$injector.get('transportplanningTransportPackageDataService').gridRefresh();
			}
		}

		function getDataService(entity) {
			var tmpServ = $injector.get('transportplanningPackageMainService');
			var item = _.find(tmpServ.getList(), function (item) {
				return item === entity; // If tmpServ is the current data service, the results of tmpServ.getList() should exist an item that is equal to the param entity.
			});
			if (item) {
				return tmpServ;
			}
			else {
				return $injector.get('transportplanningTransportPackageDataService');
			}
		}

		return service;
	}
})(angular);