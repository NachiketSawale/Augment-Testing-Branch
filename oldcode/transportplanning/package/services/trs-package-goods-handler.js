(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.package';
	angular.module(moduleName).factory('transportplanningPackageGoodsHandler', GoodsHandler);

	GoodsHandler.$inject = ['_', '$http', '$q', '$injector', 'cloudCommonGridService', 'globals', 'packageTypes', 'basicsLookupdataLookupDescriptorService'];

	function GoodsHandler(_, $http, $q, $injector, cloudCommonGridService, globals, packageTypes, basicsLookupdataLookupDescriptorService) {

		function clearRelativePropertiesForGoods(pkg) {
			pkg.Weight = null;
			pkg.UomWeightFk = 0;
			pkg.UomFk = null;
			//any way,ResResourceFk/MaterialFk should be null when the goods is null
			pkg.ResResourceFk = null;
			pkg.MaterialFk = null;

			// clear danagerous goods info when package type is change
			pkg.DangerclassFk = null;
			pkg.PackageTypeFk = null;
			pkg.DangerQuantity = null;
			pkg.UomDGFk = null;
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

		function getUpdateGoodsDescriptionPromise(pkgs, promises) {
			_.forEach(pkgs, function (pkg) {
				if (!_.isNil(pkg.Good)) { // update goodsDescription if good is not null (by zwz 2019/10/11)
					var descriptionPropertyName = _.get(packageTypes.properties[pkg.TrsPkgTypeFk], 'descriptionPropertyName');
					if (descriptionPropertyName) {
						promises.push(getGoodsData(pkg.Good, pkg.TrsPkgTypeFk).then(function (goodsData) {
							pkg.GoodsDescription = _.get(goodsData, descriptionPropertyName);
						}));
					}
				}
				// update also the child-packages
				getUpdateGoodsDescriptionPromise(pkg.ChildPackages, promises);
			});
		}

		function updateGoodsDescription(pkgs, callback) {
			var promises = [];
			getUpdateGoodsDescriptionPromise(pkgs, promises);
			if (promises.length > 0) {
				$q.all(promises).then(function () {
					if (callback) {
						callback.call(this);
					}
				});
			}
		}

		function getGoodsData(pkgGoods, pkgGoodsType) {
			var lookupType = _.get(packageTypes.properties[pkgGoodsType], 'lookupType');
			var version = _.get(packageTypes.properties[pkgGoodsType], 'version');
			if (!lookupType) {
				return $q.when(null);
			}

			// handle basicsLookupdataLookupDescriptorService not support version 3 issue
			if (version === 3 && !basicsLookupdataLookupDescriptorService.hasLookupItem(lookupType, pkgGoods)){
				return basicsLookupdataLookupDescriptorService.loadItemByKey({
					options: {
						lookupType: lookupType,
						version: 3
					},
					ngModel: pkgGoods
				});
			}
			return basicsLookupdataLookupDescriptorService.loadItemByKey(lookupType, pkgGoods);
		}

		function setRelativePropertiesByGoods(pkg, dataService) {
			if (!pkg) {
				return;
			}
			if (pkg.Good === null) {
				clearRelativePropertiesForGoods(pkg);
				refreshGrid(dataService);
			}
			else {
				var options = packageTypes.properties[pkg.TrsPkgTypeFk];
				if (options) {
					if (pkg.selectedGood) {
						setRelativeProperties(pkg, pkg.selectedGood, options, dataService);
					} else {
						getGoodsData(pkg.Good, pkg.TrsPkgTypeFk).then(function (data) {
							setRelativeProperties(pkg, data, options, dataService);
						});
					}

				}
			}
			//set UomFk readonly or editable after Good Modified.
			$injector.get('transportplanningPackageDataProcessor').processItemUomFkByGood(pkg);
		}

		function setRelativeProperties(pkg, data, options, dataService) {
			if (data) {
				//user want to see the transport goods weight in the weight column
				pkg.UomWeightFk = _.get(data, options.weightUomPropertyName, 0) === null? 0 : _.get(data, options.weightUomPropertyName, 0);
				pkg.UomLengthFk = _.get(data, options.lengthUomPropertyName, 0) === null? 0 :  _.get(data, options.lengthUomPropertyName, 0);
				pkg.UomWidthFk =  _.get(data, options.widthUomPropertyName, 0) === null? 0 : _.get(data, options.widthUomPropertyName, 0);
				pkg.UomHeightFk = _.get(data, options.heightUomPropertyName, 0) === null? 0 : _.get(data, options.heightUomPropertyName, 0);

				//user want to see the transport goods uom in the uom column
				pkg.UomFk = data[options.uomFkPropertyName];

				//for package database store transport resource fk or material fk
				pkg.ResResourceFk = data[options.resourceFkPropertyName];
				pkg.MaterialFk = data[options.materialFkPropertyName];
				pkg.Weight = data[options.weightPropertyName];

				pkg.GoodsDescription = _.get(data, options.descriptionPropertyName);

				if(pkg.TrsPkgTypeFk === packageTypes.Plant){
					pkg.DangerclassFk = _.get(data, options.dangerClassPropertyName);
					pkg.PackageTypeFk = _.get(data, options.packageTypePropertyName);
					pkg.DangerQuantity = _.get(data, options.dangerQuantityPropertyName);
					pkg.UomDGFk = _.get(data, options.dangerUomProperty);
				}

				$http.post(globals.webApiBaseUrl + 'transportplanning/package/calculateGoods', [pkg]).then(function(response) {
					_.assign(pkg, response.data[0]);
					refreshGrid(dataService);
				});
			}
		}

		return {
			updateGoodsDescription: updateGoodsDescription,
			setRelativePropertiesByGoods: setRelativePropertiesByGoods
		};
	}
})(angular);