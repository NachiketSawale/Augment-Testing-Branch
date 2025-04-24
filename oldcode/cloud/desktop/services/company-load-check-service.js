/**
 * Created by rei on 10.12.2014.
 */

(function (angular) {
	'use strict';
	angular.module('cloud.desktop').factory('cloudDesktopCompanyService',
		['_', 'globals', '$q', '$http', 'platformContextService', 'platformUserInfoService', 'cloudDesktopInfoService',
			function (_, globals, $q, $http, platformContextService, platformUserInfoService, cloudDesktopInfoService) {

				var service = {};

				service.companies = undefined;
				service.companiesLoaded = false;
				let companiesMap;
				let roles;
				let rolesLookup;

				/*
				 */
				service.getCompanybyId = function (clientId) {
					return companiesMap.get(clientId);
				};

				/*
				 This method converts the roles array into an javascript object with properties of v.clientId value.
				 the represent a kind of map
				 */
				function rolesArrayToObject(roles) {
					var resultObj;
					resultObj = _.reduce(roles, function (result, v) {
						result[v.clientId] = {roleId: v.roleIds, clientId: v.clientId};
						return result;
					}, {});
					return resultObj;
				}

				/*
				 see service.getAllNodesUpToRoot  below
				 */
				function getAllNodesUpToRoot(nodeid, retList) {
					// console.log('getAllParentNodes', retList);
					if (!retList) {
						retList = [];
					}
					var parent = companiesMap.get(nodeid);
					if (parent) {
						retList.push(parent);
						if (parent.parentId) {
							return getAllNodesUpToRoot(parent.parentId, retList);
						}
					}
					return retList;
				}

				/**
				 * @function getAllNodesUpToRoot
				 * @param none
				 * @returns {*} list of all company nodes from one node to root node
				 */
				service.getAllNodesUpToRoot = getAllNodesUpToRoot;

				/**
				 * @function getCompanyToSignedIn
				 * returns parent company to signedIn company,
				 * if signedIn itself is a company it will return itself
				 * @param signedInCompanyId
				 * @returns {*}
				 */
				function getCompanyToSignedIn(signedInCompanyId) {
					// console.log('getAllParentNodes', retList);
					if (companiesMap) {
						var signedInCompany = companiesMap.get(signedInCompanyId);
						if (signedInCompany && signedInCompany.companyType === 1 /* is mandant */) {
							return signedInCompanyId;
						}
						if (signedInCompany.parentId) {
							return getCompanyToSignedIn(signedInCompany.parentId);
						}
					}
					return null;
				}

				/**
				 * @function getCompanyToSignedIn
				 * returns parent company to signedIn company,
				 * if signedIn itself is a company it will return itself
				 * @param signedInCompanyId
				 * @returns {*}
				 */
				service.getCompanyToSignedIn = getCompanyToSignedIn;

				function getRolesToParent(node) {

					/* local function */
					function getRoleInfotoNode(roles) {
						let rolesInfo = [];
						_.forEach(roles.roleId, function (role) {
							// build roleInfo objet, take origin roleInfo and extend it with ClientId, indicating who is the owner
							// of the role permission record
							if (rolesLookup[role]) {
								let roleInfo = {};
								angular.extend(roleInfo, rolesLookup[role]);
								roleInfo.description = roleInfo.value;
								if(rolesLookup[role].description){
									roleInfo.description += ' (' + rolesLookup[role].description + ')';
								}
								if (roleInfo)
									roleInfo.clientId = roles.clientId;
								rolesInfo.push(roleInfo);

							}
						}
						);
						return _.orderBy(rolesInfo, [role => role.description.toLowerCase()], ['description']);
					}

					if (!node) {
						return null;
					}

					// console.log ('getRolesToParent', node);
					var theRoles = roles[node.id];
					if (theRoles) {
						return getRoleInfotoNode(theRoles);
					}
					if (node.parentId) {
						var parent = companiesMap.get(node.parentId);
						return getRolesToParent(parent);
					}
					return null;
				}

				/*
				 this method returns the roles to
				 */
				service.getRolesToCompany = getRolesToParent;

				/*
				 this method extends each company with its parent.
				 */
				function companiesTreeToMap(companiesList) {
					var map;

					/* local function */
					function walkTruTree(company) {
						map.set(company.id, company);
						if (company.children) {
							_.forEach(company.children, walkTruTree);
						}
					}

					map = new Map();
					_.forEach(companiesList, function (company) {
						walkTruTree(company);
					});
					return map;
				}

				/**
				 *
				 * @param response
				 */
				function initCompaniesRoleRolesLookup(response) {
					service.companies = response.data.companies;
					roles = {};
					rolesLookup = {};

					if (service.companies) {
						companiesMap = companiesTreeToMap(service.companies);
					}
					if (response.data.roles) {
						roles = rolesArrayToObject(response.data.roles);
						// console.log(response.data);
						// console.log(roles);
					}
					if (response.data.rolesLookup) { // jshint ignore:line
						rolesLookup = _.keyBy(response.data.rolesLookup, 'key');
					}
					service.companiesLoaded = true;
				}

				/**
				 * This method reads the companies assiged to the current user.
				 * @method loadAssigedCompaniesToUser
				 * @param forceReadContext
				 * */
				service.loadAssigedCompaniesToUser = function loadAssignedCompaniesToUser(forceReadContext) {

					// reuse already loaded companies
					if (service.companiesLoaded) {
						var deferred = $q.defer();
						deferred.resolve(service.companies);
						return deferred.promise;
					}

					// read user data and read environment
					var userPromise = platformUserInfoService.getUserInfoPromise().then(function (/* userInfo */) {
						// readContextFromLocalStorage need a valid user id, there for wait until user is loaded
						if (forceReadContext) { // rei@15.2.2019 force reading of context from storage only if in logon mode, otherwise already loaded
							platformContextService.readContextFromLocalStorage();
						}
					});

					var companyPromise = $http.get(
						globals.webApiBaseUrl + 'basics/company/getassignedcompanieswithroles'
					).then(function (response) {
						if (response.data) {
							initCompaniesRoleRolesLookup(response);
						}
						return service.companies;
					});

					return $q.all([companyPromise, userPromise])
						.then(function (responses) {
							return responses[0];
							/* companyData */
						}, function (errdata) {
							console.log('loadAssigedCompaniesToUser failed!', errdata);
							return false;
						});
				};

				/**
				 * This method reads the companies assiged to the current user.
				 * @method loadAssigedCompaniesToUser
				 * @param companyCode {string}   company code i.e. '100.10'
				 * @param [roleId] {int}   1 for 'admin'
				 **/
				service.checkLoadAssigedCompaniesToUser = function checkLoadAssigedCompaniesToUser(companyCode, roleId) {

					return platformUserInfoService.getUserInfoPromise(true)
						.then(function () {
							var params;
							// readContextFromLocalStorage need a valid user id, hence wait until user is loaded
							platformContextService.readContextFromLocalStorage(); // make sure not having old secureRole stuff
							var checkCompanyCode = false;

							if (!companyCode) {
								if (_.isNil(platformContextService.signedInClientId) || _.isNil(platformContextService.clientId) || _.isNil(platformContextService.permissionClientId)
									|| _.isNil(platformContextService.permissionRoleId)
									||platformContextService.signedInClientId===0 || platformContextService.clientId===0 || platformContextService.permissionClientId===0
									||platformContextService.permissionRoleId===0
								) {
									console.log ('checkLoadAssignedCompaniesToUser() Cannot validate company, some parameter missing');
									// return $q.reject(false);
								}
								params = {
									params: {
										requestedSignedInCompanyId: platformContextService.signedInClientId,
										requestedCompanyId: platformContextService.clientId,
										requestedPermissionClientId: platformContextService.permissionClientId, // this clientId is holding the permission role
										requestedRoleId: platformContextService.permissionRoleId
									}
								};
							} else {
								params = {
									params: {
										requestedSignedInCompanyCode: companyCode,
										requestedRoleId: roleId
									}
								};
								checkCompanyCode = true;
							}
							return service.checkCompany(params, checkCompanyCode); // TODO: .net core porting: chm 2020-11-24: since api name cannot be overloaded, refactor it a bit.
						});
				};

				/**
				 * This method checks if the  current user has access to the company
				 * supplied via parameter params
				 * @method checkCompany
				 * @param params {object}
				 * @param checkCompanyCode
				 * @param params {bool}
				 **/
				service.checkCompany = function (params, checkCompanyCode) {
					var checkCompanyUrl = globals.webApiBaseUrl + (checkCompanyCode ? 'basics/company/checkcompanycode' : 'basics/company/checkcompany');
					return $http.get(checkCompanyUrl, params)
						.then(function (response) {
							// in case invalid company, we get returned "null"
							if (response.data) {
								if (response.data.isValid) {

									// if (true /*companyCode*/) {  // update platformContextService....
									// save company selection info into platform context, prepare for display in mainframe and save to localdb
									platformContextService.setCompanyConfiguration(
										response.data.signedInCompanyId,
										response.data.companyId,
										response.data.requestedPermissionCompanyId,
										response.data.requestedRoleId,
										response.data.secureClientRolePart, // rei@9.10.17
										response.data.signedInCompanyCode,  // rei@7.2.2019 ...
										response.data.signedInCompanyName,
										response.data.companyCode,
										response.data.companyName);
									platformContextService.saveContextToLocalStorage();

									// }
									// console.log('checkLoadAssigedCompaniesToUser setCompanyConfiguration done...');
									/* // not displayed 21.4.15@rei + moreCompanyInfo;
											 if ( (companyRole.signedInClientId !== companyRole.clientId) &&  response.data.companyName && response.data.companyName.length > 0) {
											 companyName += '/' + response.data.companyName; }
											*/
									cloudDesktopInfoService.update((response.data.signedInCompanyCode || '') + ' ' + response.data.signedInCompanyName, response.data.roleName);
									cloudDesktopInfoService.scheduleReadApplicationMessages(); // reading of messages activated now

									return $q.resolve(true);
								}
							} else {
								$log.error('Company code or role is invalid:', response.data.errorMessage);
								return $q.reject({
									errorCode: response.data.errorCode || 'Unknown',
									errorMessage: response.data.errorMessage || 'Invalid company response',
									errorDetail: response.data.errorDetail || 'No additional details provided.'
								});
							}
						})
						.catch(function (errorResponse) {
							const errorMessage = errorResponse.data && errorResponse.data.errorMessage
								? errorResponse.data.errorMessage
								: `An error occurred: ${errorResponse.statusText || 'Unknown error'}`;
							const errorDetails = errorResponse.data && errorResponse.data.errorDetail
								? errorResponse.data.errorDetail
								: 'No additional details provided.';

							$log.error('Error in checkCompany:', errorMessage, 'Details:', errorDetails);
							return $q.reject({
								errorCode: errorResponse.status,
								errorMessage: errorMessage,
								errorDetail: errorDetails
							});
						});
				};
				/*
				 clean / delete all service data....
				 */
				service.cleanupServiceData = function () {
					service.companies = undefined;
					companiesMap = undefined;
					roles = undefined;
					rolesLookup = undefined;
					service.companiesLoaded = false;
				};

				return service;
			}]);
})(angular);

