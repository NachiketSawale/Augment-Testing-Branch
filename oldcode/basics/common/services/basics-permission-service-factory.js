/**
 * Created by pel on 03/07/2023.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsPermissionServiceFactory', BasicsPermissionService);

	BasicsPermissionService.$inject = [
		'_',
		'$q',
		'$log',
		'$http',
		'globals',
		'permissions',
		'platformContextService',
		'platformPermissionService',
		'$injector'
	];

	function BasicsPermissionService(
		_,
		$q,
		$log,
		$http,
		globals,
		permissions,
		platformContextService,
		platformPermissionService,
		$injector
	)
	{
		var serviceCache = {};
		function getService(permissionDescriptorServiceName) {
			if (!serviceCache[permissionDescriptorServiceName]) {
				serviceCache[permissionDescriptorServiceName] = createService(permissionDescriptorServiceName);
			}
			return serviceCache[permissionDescriptorServiceName];
		}
		function createService(permissionDescriptorServiceName){
			var service = {};
			var cachedPermissions = {};
			var permissionSelector = '';
			var permissionDic =  $injector.get(permissionDescriptorServiceName).getPermissions();
			var systemContext = null;

			service.storeSystemContext = storeSystemContext;
			service.resetSystemContext = resetSystemContext;
			service.setPermissionObjectInfo = setPermissionObjectInfo;
			service.hasRead = hasRead;
			service.hasWrite = hasWrite;
			service.hasCreate = hasCreate;
			service.hasDelete = hasDelete;
			service.hasExecute = hasExecute;
			service.reset = reset;
			service.parseToolPermission = parseToolPermission;

			// /////////////////////

			function storeSystemContext() {
				if (!systemContext) {
					systemContext = angular.copy(platformContextService.getContext());
					systemContext.clientCode = undefined;
					systemContext.clientName = undefined;
					systemContext.signedInClientCode = undefined;
					systemContext.signedInClientName = undefined;
				}
			}

			function resetSystemContext() {
				var sysContext = platformContextService.getContext();
				angular.extend(sysContext, systemContext);
				sysContext.clientCode = undefined;
				sysContext.clientName = undefined;
				sysContext.signedInClientCode = undefined;
				sysContext.signedInClientName = undefined;
				$http.defaults.headers.common['Client-Context'] = angular.toJson(sysContext);
				systemContext = null;
			}

			function reset() {
				cachedPermissions = {};
				permissionSelector = '';
				systemContext = null;
			}

			function setPermissionObjectInfo(permissionObjectInfo) {
				var promise = $q.when(true);
				var oldPermissionSelector = permissionSelector;
				var keys = _.keys(cachedPermissions['']);
				var descriptors = _.map(permissionDic, function(desc){
					return desc.permission;
				});

				updateHttpClientContextHeader(permissionObjectInfo);

				if (permissionObjectInfo) {

					permissionSelector = permissionObjectInfo.substring(0, permissionObjectInfo.lastIndexOf('|'));

					if(permissionSelector !== oldPermissionSelector) {
						var loadedPermissions = cachedPermissions[permissionSelector];
						var hasCheckMissing = false;
						if (!loadedPermissions) {
							loadedPermissions = cachedPermissions[permissionSelector] = {};
						} else {
							keys = _.without(keys, _.keys(loadedPermissions));
							hasCheckMissing = true;
						}

						if (!hasCheckMissing && (!keys.length || keys.length === 0)) {
							promise = loadPermissions(descriptors, false);
						} else if (keys.length) {
							promise = loadPermissions(keys, false);
						}
					}
				}
				else {
					permissionSelector = '';
					if (!keys.length) {
						promise = loadPermissions(descriptors, true);
					}
					else {
						keys = _.without(keys, descriptors);
					}

					if (keys.length) {
						promise = loadPermissions(keys, true);
					}
				}

				return promise;
			}

			function loadPermissions(descriptor, forceRole) {
				if (descriptor !== null && descriptor !== undefined && descriptor !=='') {
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
						if (_.isUndefined(loadedPermissions[descriptor])) {
							data.push(descriptor);
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
			}

			function updateHttpClientContextHeader(permissionObjectInfo) {
				var sysContext = platformContextService.getContext();
				sysContext.permissionObjectInfo = permissionObjectInfo ? permissionObjectInfo : null;
				var clientCtx = _.clone(sysContext);
				if (clientCtx.secureClientRole) {  // do not put the ids onto the client header if its already there in secureClientRole
					clientCtx.signedInClientId = undefined;
					clientCtx.clientId = undefined;
					clientCtx.permissionClientId = undefined;
					clientCtx.permissionRoleId = undefined;
				}
				// clientname and signinClientname not required in context, we clean it
				clientCtx.clientCode = undefined;
				clientCtx.clientName = undefined;
				clientCtx.signedInClientCode = undefined;
				clientCtx.signedInClientName = undefined;
				$http.defaults.headers.common['Client-Context'] = angular.toJson(clientCtx);
				if (globals.trace && globals.trace.context) {
					var stacktrace = new Error().stack;
					stacktrace = stacktrace.replace('Error', '');
					var contextInfo = 'C.Id:' + sysContext.clientId + ' SC.Id:' + sysContext.signedInClientId + ' PC.Id:' + sysContext.permissionClientId + ' R.Id:' + sysContext.permissionRoleId;
					console.groupCollapsed('Http Context Header changed: ' + contextInfo + '(expand for details)');
					console.trace(stacktrace);
					console.groupEnd();
				}
			}

			function has(descriptor, permission) {
				if (!angular.isString(descriptor) || descriptor.length !== 32 || !cachedPermissions[permissionSelector] || !cachedPermissions[permissionSelector][descriptor]) {
					return false;
				}

				return (cachedPermissions[permissionSelector][descriptor] & 0x1f & permission) === permission;
			}
			function hasRead(descriptor) {
				return has(descriptor, permissions.read);
			}

			function hasWrite(descriptor) {
				return has(descriptor, permissions.write);
			}

			function hasCreate(descriptor) {
				return has(descriptor, permissions.create);
			}

			function hasDelete(descriptor) {
				return has(descriptor, permissions.delete);
			}

			function hasExecute(descriptor) {
				return has(descriptor, permissions.execute);
			}

			function parseToolPermission(tools) {
				function parse(tool) {
					if (_.isString(tool.permission)) {
						var splits = tool.permission.split('#');
						tool.permission = {};
						tool.permission[splits[0]] = platformPermissionService.permissionsFromString(splits[1]);
					}
				}
				_.each(tools.items, function (tool) {
					parse(tool);
					if (tool.list && tool.list.items && _.isArray(tool.list.items)) {
						_.each(tool.list.items, function (subTool) {
							parse(subTool);
						});
					}
				});
			}
			return service;
		}
		return {
			getService: getService
		};
	}
})(angular);
