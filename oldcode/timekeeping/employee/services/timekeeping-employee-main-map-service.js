(function (angular) {
    'use strict';
    let module = 'timekeeping.employee';
    angular.module(module).service('timekeepingEmployeeMainMapService', ['globals', '_', 'platformUtilService', 'timekeepingEmployeeDataService', 'platformMultiAddressService', '$q', '$http',
        function (globals, _, platformUtilService, timekeepingEmployeeDataService, multiAddressService, $q, $http) {
            let self = this;

            function getEmployeeMapData() {
                let employeeList = timekeepingEmployeeDataService.getList();
                if (!_.isEmpty(employeeList)) {
                    let addressMap = new Map();
                    let placeOfWorkMap = new Map();

                    _.each(employeeList, function (emp) {
                        if (!_.isNil(emp.AddressFk)) {
                            addressMap.set(emp.Id, emp.AddressFk);
                        }
                        if (!_.isNil(emp.PlaceOfWorkFk)) {
                            placeOfWorkMap.set(emp.Id, emp.PlaceOfWorkFk);
                        }
                    });

                    return { addressMap, placeOfWorkMap };
                }
            }

            function createFormatter(type) {
                const lineSep = '<br>';
                function getLine(infoObject, field) {
                    const value = _.get(infoObject, field);
                    return value ? (value + lineSep) : '';
                }

                return function (infoObject) {
                    let formattedString = getLine(infoObject, 'Code');
                    formattedString += getLine(infoObject, 'FirstName');
                    formattedString += getLine(infoObject, 'FamilyName');
                    formattedString += `<strong>Type:</strong> ${type}${lineSep}`;
                    return platformUtilService.getSanitized(formattedString); // Prevent XSS
                };
            }
			
			function createMapInfo(employeeMap, locations, businessPartners) {
				let mapInfoObjectList = [];
				let uniqueLocations = new Set(); // Track unique locations to avoid duplicates
			
				employeeMap.forEach(function (locationFk, employeeId) {
					if (!uniqueLocations.has(locationFk)) {
						uniqueLocations.add(locationFk);
			
						let employee = timekeepingEmployeeDataService.getItemById(employeeId);
						let infoObject = {};
						let location = _.find(locations, function (loc) {
							return loc.id === locationFk;
						});
						let businessPartner = _.find(businessPartners, function (bp) {
							return employee.BusinessPartnerFk === bp.Id;
						});
			
						infoObject = angular.extend(infoObject, location, businessPartner, employee);
			
						// Determine pin color
						if (employee.PlaceOfWorkFk ) {
							infoObject.pinColor = 'red'; // Place of Work pin&& employee.PlaceOfWorkFk === locationFk
						}
						 if (employee.AddressFk ) {
							infoObject.pinColor = 'blue'; // Address pin
						}
			
						infoObject.formatter = createFormatter();
						mapInfoObjectList.push(infoObject);
					}
				});
			
				return mapInfoObjectList;
			}
			

            function getLocationIds(map) {
                if (map && map.size) {
                    return Array.from(map.values());
                }
            }

            function setAddresses() {
                let { addressMap, placeOfWorkMap } = getEmployeeMapData() || {};
                if (addressMap || placeOfWorkMap) {
                    let addressIds = getLocationIds(addressMap);
                    let placeOfWorkIds = getLocationIds(placeOfWorkMap);

                    let addressPromise, placeOfWorkPromise;
                    multiAddressService.setAddressEntities([], module);

                    if (!_.isEmpty(addressIds)) {
                        addressPromise = $http.post(globals.webApiBaseUrl + 'basics/common/address/getaddressesbyid', addressIds).then(function (result) {
                            return result.data;
                        });
                    }

                    if (!_.isEmpty(placeOfWorkIds)) {
                        placeOfWorkPromise = $http.post(globals.webApiBaseUrl + 'basics/common/address/getaddressesbyid', placeOfWorkIds).then(function (result) {
                            return result.data;
                        });
                    }

                    $q.all([addressPromise, placeOfWorkPromise]).then(function (results) {
                        let addressList = results[0];
                        let placeOfWorkList = results[1];
                        let businessPartnerList;

                        if (results[2] && results[2].Main) {
                            businessPartnerList = results[2].Main;
                        }

                        let addressMapInfo = createMapInfo(addressMap, addressList, businessPartnerList, 'Address');
                        let placeOfWorkMapInfo = createMapInfo(placeOfWorkMap, placeOfWorkList, businessPartnerList, 'Place of Work');

                        multiAddressService.setAddressEntities([...addressMapInfo, ...placeOfWorkMapInfo], module);
                    });
                }
            }

            self.setAddresses = setAddresses;

            timekeepingEmployeeDataService.registerListLoaded(setAddresses);
        }
    ]);
})(angular);
