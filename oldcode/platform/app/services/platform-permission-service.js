/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	// noinspection JSStringConcatenationToES6Template
	/**
	 * @ngdoc constant
	 * @name permissions
	 * @methodOf platform:permissions
	 * @description
	 * Permissions object containing constant values representing access rights - can be combined (or'ed)
	 */
	angular.module('platform').constant('permissions', {
		// Read permission (read access right)
		read: 0x01,
		// / Write permission (write access right)
		write: 0x02,
		// / Create permission (create access right)
		create: 0x04,
		// / Delete permission (delete access right)
		delete: 0x08,
		// / Execute permission (execute access right)
		execute: 0x10
	});

	/**
	 * @ngdoc constant
	 * @name permissionObjectType
	 * @methodOf platform:permissions
	 * @function
	 * @description permission object type enumeration, must provide same ids as defined by ObjectType enum in backend\framework\Platform\BusinessComponents\Permission.cs
	 */
	angular.module('platform').constant('permissionObjectType', {
		// Project
		project: 1,

		// Package
		package: 2,

		// Schedule
		schedule: 3,

		// Wic
		wic: 4,

		// BusinessPartner
		businessPartner: 5,

		// Defect Management
		defect: 6,

		// BusinessPartner Evaluation
		businessPartnerEvaluation: 7,

		// BusinessPartner Evaluation Group Data
		businessPartnerEvaluationGroupData: 8,

		// BusinessPartner Evaluation Sub Group Data
		businessPartnerEvaluationSubGroupData: 9,

		// Project Document
		projectDocument: 10,

		// Transport Requisition
		transportRequisition: 11,

		// Transport Route
		transportRoute: 12,

		// Estimate
		estimate: 13,

		// Model
		model: 14,

		// Boq
		boq: 15,

		// Company
		company: 16,

		// TimeAllocation
		timeAllocation: 17,

		// Site
		site: 18
	});

	/**
	 * @ngdoc service
	 * @name platform:platformPermissionService
	 * @function
	 * @requires $http, $q, platformContextService, _
	 * @description
	 * platformPermissionService provides support for loading and checking access right
	 */
	angular.module('platform').factory('platformPermissionService', platformPermissionService);

	platformPermissionService.$inject = ['$http', '$q', '$log', '$injector', 'platformContextService', '_', 'permissions', '$rootScope', 'globals', 'permissionObjectType'];

	function platformPermissionService($http, $q, $log, $injector, platformContextService, _, permissions, $rootScope, globals, permissionObjectType) {
		const cachedPermissions = {};
		const cachedDescriptor = {};
		const cachedFunctionalRoles = {};
		const cachedModuleFunctionalRole = {};
		const restrictedPermissions = {};
		const loadedIds = {};
		const service = {};
		const cachedParentObjectTypes = {};
		let parentObjectPermissionInfo = null;
		let permissionSelector = '';
		let activeFunctionalRole = null;
		let activeFunctionalRestrictions = {};

		platformContextService.contextChanged.register((type) => {
			let keys = _.keys(cachedPermissions['']);

			switch (type) {
				case 'companyConfiguration':
					service.loadPermissions(keys, true);
					break;

				case 'permissionObjectInfo':
					var info = platformContextService.permissionObjectInfo;

					if (info) {
						const oldPermissionSelector = permissionSelector;

						permissionSelector = info.substring(0, info.lastIndexOf('|'));

						if (permissionSelector !== oldPermissionSelector) {
							let loadedPermissions = cachedPermissions[permissionSelector];
							let promise = $q.when(true);

							if (!loadedPermissions) {
								loadedPermissions = cachedPermissions[permissionSelector] = {};
							} else {
								keys = _.without(keys, _.keys(loadedPermissions));
							}

							if (keys.length) {
								promise = service.loadPermissions(keys, false);
							}

							promise.then(function () {
								$rootScope.$emit('permission-service:updated');
								$rootScope.$emit('permission-service:changed');
							});
						}
					} else {
						permissionSelector = '';

						$rootScope.$emit('permission-service:updated');
						$rootScope.$emit('permission-service:changed');
					}
					break;
			}
		});

		/**
		 * @ngdoc function
		 * @name loadPermissions
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description loads given descriptor(s)
		 * @param descriptor {string|number|Array} descriptor(s) or descriptor id(s) to be loaded
		 * @param forceRole (boolean} set to true if role descriptors must be loaded
		 * @returns {Promise} promise resolved when permissions are loaded or already available
		 */
		service.loadPermissions = function loadPermissions(descriptor, forceRole) {
			forceRole = _.isUndefined(forceRole) ? true : forceRole;

			if (descriptor && descriptor.length > 0) {
				var data = [];
				var idData = [];
				var promises = [];
				var loadedPermissions = cachedPermissions[forceRole ? '' : permissionSelector];

				if (!loadedPermissions) {
					loadedPermissions = cachedPermissions[permissionSelector] = {};
				}

				// check for valid permission context, otherwise force exception
				if (!platformContextService.permissionClientId) {
					$log.error('PermissionService.loadPermissions(...) failed. There is no valid PermissionContextId.', platformContextService.permissionClientId);
				}

				_.each(_.isArray(descriptor) ? descriptor : [descriptor], function (descriptor) {
					if (_.isNumber(descriptor)) {
						if (_.isUndefined(loadedIds[descriptor])) {
							idData.push(descriptor);
						}
					} else if (descriptor.length !== 32) {
						descriptor = parseInt(descriptor);

						if (!_.isNaN(descriptor) && _.isUndefined(loadedIds[descriptor])) {
							idData.push(descriptor);
						}
					} else {
						if (_.isUndefined(loadedPermissions[descriptor])) {
							data.push(descriptor);
						}
					}
				});

				if (data.length) {
					promises.push($http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'services/platform/loadpermissions',
						data: data,
						params: {forceRole: forceRole || false}
					})
						.then(function (result) {
							_.each(result.data, function (item) {
								loadedPermissions[item.descriptor] = item.right;
							});

							return true;
						}));
				}

				if (idData.length) {
					promises.push($http({
						method: 'POST',
						url: globals.webApiBaseUrl + 'services/platform/loadpermissionsbyid',
						data: idData
					})
						.then(function (result) {
							_.each(result.data.mappings, function (item) {
								loadedIds[item.id] = item.descriptor;
							});

							_.each(result.data.permissions, function (item) {
								loadedPermissions[item.descriptor] = item.right;
							});

							return true;
						}));
				}

				if (!promises.length) {
					promises.push($q.when(true));
				}

				return promises.length === 1 ? promises[0] : $q.all(promises)
					.then(function () {
						return true;
					});
			}

			return $q.when(true);
		};

		/**
		 * @ngdoc function
		 * @name has
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for given permission
		 * @param descriptor {string|number|Array} descriptor(s) or descriptor ids to be checked
		 * @param permission {number} permission to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.has = function has(descriptor, permission, forceRole) {
			if (_.isArray(descriptor)) {
				return _.every(descriptor, function (descriptor) {
					return has(descriptor, permission, forceRole);
				});
			} else {
				if (_.isString(descriptor) && descriptor.length !== 32) {
					descriptor = loadedIds[parseInt(descriptor)];
				} else if (_.isNumber(descriptor)) {
					descriptor = loadedIds[descriptor];
				}

				forceRole = _.isUndefined(forceRole) ? false : forceRole;

				if (!descriptor && !cachedPermissions[forceRole ? '' : permissionSelector][descriptor]) {
					return false;
				}

				return (cachedPermissions[forceRole ? '' : permissionSelector][descriptor] & (restrictedPermissions[descriptor] || 0x1f) & (activeFunctionalRestrictions[descriptor] || 0x1f) & permission) === permission;
			}
		};

		/**
		 * @ngdoc function
		 * @name restrict
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description restrict given descriptor(s) to lower permission
		 * @param descriptor {string|Array} descriptor(s) to be restricted
		 * @param permission {number|null|undefined} permission to be set (resulting permission will be equal/lower than permission loaded from server) or null|undefined to remove restriction
		 * @param [suppressEvent] {boolean} optional; internally used to prevent unneeded notifications
		 */
		function restrict(descriptor, permission, suppressEvent) {
			if (_.isArray(descriptor)) {
				_.each(descriptor, function (descriptor) {
					restrict(descriptor, permission, true);
				});
			} else {
				if (_.isBoolean(permission)) {
					restrictedPermissions[descriptor] = 0x1f;
					console.warn('platformPermissionService.restrict | parameter permission==false is deprecated, please refactor restrict([...], false); to restrict([...]);');
				} else if(_.isNil(permission)) {
					restrictedPermissions[descriptor] = 0x1f;
				} else {
					restrictedPermissions[descriptor] = permission | 0x8000;
				}
			}

			if (!suppressEvent) {
				$rootScope.$emit('permission-service:updated');
				$rootScope.$emit('permission-service:changed');
			}
		}

		/**
		 * @ngdoc function
		 * @name restrict
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description restrict given descriptor(s) to lower permission
		 * @param descriptor {string|Array} descriptor(s) to be changed
		 * @param permission {number|false} permission to be set (resulting permission will be equal/lower than permission loaded from server) or false to remove restriction
		 */
		service.restrict = function (descriptor, permission) {
			restrict(descriptor, permission);
		};

		/**
		 * @ngdoc function
		 * @name loadFunctionalRoles
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description (pre)loads function roles into local cache
		 * @param roles {number|Array} role/roles to be preloaded
		 */
		service.loadFunctionalRoles = (roles) => {
			if(!_.isArray(roles)) {
				roles = [roles];
			}

			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'services/platform/functional-restrictions',
				data: roles
			}).then((result) => {
				result.data.forEach((item) => {
					cachedFunctionalRoles[item.role] = item.restrictions;
				});
			});
		};

		/**
		 * @ngdoc function
		 * @name functionalRole
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description set/get function role to be used/in use
		 * @param roleId {number | null | undefined} valid roleId: role to be used. null: unset functional role, undefined: will return active functional role or null
		 * @returns {number | null}
		 */
		service.functionalRole = (roleId = undefined) => {
			if(roleId === undefined) {
				return activeFunctionalRole;
			}

			if(activeFunctionalRole !== roleId) {
				activeFunctionalRole = roleId;
				activeFunctionalRestrictions = {};

				if(activeFunctionalRole !== null && !cachedFunctionalRoles[activeFunctionalRole]) {
					$http({
						method: 'GET',
						url: globals.webApiBaseUrl + 'services/platform/functional-restrictions',
						params: {
							roleId: activeFunctionalRole
						}
					}).then((result) => {
						cachedFunctionalRoles[result.data.role] = result.data.restrictions;
						activeFunctionalRestrictions = cachedFunctionalRoles[activeFunctionalRole] || {};

						$rootScope.$emit('permission-service:updated');
						$rootScope.$emit('permission-service:changed');
					});
				} else {
					if(activeFunctionalRole) {
						activeFunctionalRestrictions = cachedFunctionalRoles[activeFunctionalRole] || {};
					}

					$rootScope.$emit('permission-service:updated');
					$rootScope.$emit('permission-service:changed');
				}
			}

			return activeFunctionalRole;
		};

		/**
		 * @ngdoc function
		 * @name functionalRoleHas
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks permission of descriptor for a preloaded functional role
		 * @param roleId {number | null} preloaded role id or active role id
		 * @param descriptor {string} descriptor to be checked
		 * @param permission {number} permission to be checked
		 * @returns {boolean} true when requested permission
		 */
		service.functionalRoleHas = (roleId, descriptor, permission) => {
			if(_.isNil(roleId)) {
				roleId = activeFunctionalRole;
			}

			if(_.isNil(roleId)) {
				return true;
			}

			const restrictions = cachedFunctionalRoles[roleId];

			if(_.isNil(restrictions)) {
				throw new Error('platformPermissionService:functionalRoleHas | role must already be loaded');
			}

			return ((activeFunctionalRestrictions[descriptor] || 0x1f) & permission) === permission;
		};

		/**
		 * @ngdoc function
		 * @name hasRead
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for read permission
		 * @param descriptor {string|Array} descriptor(s) to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.hasRead = function hasRead(descriptor, forceRole) {
			return service.has(descriptor, permissions.read, forceRole);
		};

		/**
		 * @ngdoc function
		 * @name hasWrite
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for write permission
		 * @param descriptor {string|Array} descriptor(s) to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.hasWrite = function hasWrite(descriptor, forceRole) {
			return service.has(descriptor, permissions.write, forceRole);
		};

		/**
		 * @ngdoc function
		 * @name hasCreate
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for create permission
		 * @param descriptor {string|Array} descriptor(s) to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.hasCreate = function hasCreate(descriptor, forceRole) {
			return service.has(descriptor, permissions.create, forceRole);
		};

		/**
		 * @ngdoc function
		 * @name hasDelete
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for delete permission
		 * @param descriptor {string|Array} descriptor(s) to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.hasDelete = function hasDelete(descriptor, forceRole) {
			return service.has(descriptor, permissions.delete, forceRole);
		};

		/**
		 * @ngdoc function
		 * @name hasExecute
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description checks given descriptor(s) for execute permission
		 * @param descriptor {string|Array} descriptor(s) to be checked
		 * @param forceRole (boolean} set to true if logon role should be used
		 * @returns {boolean} true when read permission
		 */
		service.hasExecute = function hasExecute(descriptor, forceRole) {
			return service.has(descriptor, permissions.execute, forceRole);
		};

		/**
		 * @ngdoc Property
		 * @name fromStringLookup
		 * @function
		 * @methodOf service
		 * @description internal helper object to simplify converting string containing access right (rwcde) as single characters to permission flags
		 */
		const fromStringLookup = {
			r: permissions.read,
			w: permissions.write,
			c: permissions.create,
			d: permissions.delete,
			e: permissions.execute
		};

		/**
		 * @ngdoc function
		 * @name permissionsFromString
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description converts a string containing access rights as characters (rwcde) to permissions-flags
		 * @param rights {string} right as string
		 * @returns {integer} or-ed permissions flags
		 */
		service.permissionsFromString = function permissionsFromString(rights) {
			return _.reduce(rights, function (result, right) {
				result |= fromStringLookup[right];

				return result;
			}, 0);
		};

		/**
		 * @ngdoc function
		 * @name loadDescriptor
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description loads descriptor info of given descriptor
		 * @param descriptor {string} descriptor to be loaded
		 * @returns {Promise} promise resolved when descriptor info is loaded or already available
		 */
		service.loadDescriptor = function loadDescriptor(descriptor) {
			if (!descriptor || !_.isString(descriptor) || descriptor.length !== 32) {
				return $q.when(null);
			}

			var item = _.get(cachedDescriptor, descriptor, null);

			if (item) {
				return $q.when(item);
			}

			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'services/platform/loaddescriptor',
				params: {
					uuid: descriptor
				}
			})
				.then(function (result) {
					cachedDescriptor[descriptor] = result.data;

					return result.data;
				});
		};

		/**
		 * @ngdoc function
		 * @name registerModuleParentObjectTypes
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description
		 * @param moduleName {string} name of module like 'sales.main'
		 * @param objectTypes {array|number} (array of) permissionObjectType values
		 */
		service.registerParentObjectTypes = (moduleName, objectTypes) => {
			if(_.isEmpty(cachedParentObjectTypes)) {
				const pinningContextService = $injector.get('cloudDesktopPinningContextService');

				pinningContextService.onSetPinningContext.register(pinningContextChanged);
				pinningContextService.onClearPinningContext.register(pinningContextChanged);
			}

			if (!_.isArray(objectTypes)) {
				objectTypes = [objectTypes];
			}

			cachedParentObjectTypes[moduleName] = objectTypes;

			return $q.when(cachedParentObjectTypes);
		};

		/**
		 * @ngdoc function
		 * @name registerParentObjectPermissionInfo
		 * @function
		 * @methodOf platform:platformPermissionService
		 * @description
		 * @param moduleName {string} name of module like 'sales.main'
		 * @returns {Promise} objectPermissionInfo or null
		 */
		service.registerObjectPermissionFallback = (moduleName) => {
			const parentObjectTypes = cachedParentObjectTypes[moduleName] || [];
			const pinnedObjects = [];
			const pinningContextService = $injector.get('cloudDesktopPinningContextService');

			parentObjectPermissionInfo = {
				typeId: 0,
				key: 0,
				moduleName: moduleName,
				permissionObjectInfo: '',
			};

			parentObjectTypes.forEach((type) => {
				let token = null;

				switch (type) {
					case permissionObjectType.project:
						token = 'project.main';
						break;

					case permissionObjectType.schedule:
						token = 'scheduling.schedule';
						break;

					case permissionObjectType.estimate:
						token = 'estimate.main';
						break;

					case permissionObjectType.package:
						token = 'package.main';
						break;

					case permissionObjectType.model:
						token = 'model.main';
						break;
				}

				if (token) {
					const id = pinningContextService.getPinnedId(token);

					if (id) {
						pinnedObjects.push({
							typeId: type,
							key: id
						});
					}
				}
			});

			if (pinnedObjects.length > 0) {
				return $http.post(globals.webApiBaseUrl + 'services/platform/encode-object-ids', pinnedObjects)
					.then((response) => {
						if (response.data) {
							return response.data.reduce((result, item) => {
								if (_.isNil(result) && !_.isNil(item.permissionObjectInfo) && item.permissionObjectInfo.length > 0) {
									Object.assign(parentObjectPermissionInfo, item);

									return item.permissionObjectInfo;
								}
							}, null);
						}

						return null;
					});
			} else {
				return $q.when(null);
			}
		};

		function pinningContextChanged() {
			service.registerObjectPermissionFallback(parentObjectPermissionInfo.moduleName)
				.then(() => {
					platformContextService.applyObjectPermissionFallback();
				});
		}

		$rootScope.$on('platform:request-object-permission-fallback', (event, result) => {
			if(parentObjectPermissionInfo !== null) {
				result.permissionObjectInfo = parentObjectPermissionInfo.permissionObjectInfo;
			}
		});

		$rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState) => {
			if (toState.name !== fromState.name) {
				cachedModuleFunctionalRole[fromState.name] = activeFunctionalRole;
				service.functionalRole(cachedModuleFunctionalRole[toState.name] || null);
			}
		});

		return service;
	}
})();

