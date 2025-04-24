/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const myModule = angular.module('model.annotation');
	const svcName = 'modelAnnotationCameraUtilitiesService';

	myModule.factory(svcName, modelAnnotationCameraUtilitiesService);

	modelAnnotationCameraUtilitiesService.$inject = ['_', '$q'];

	function modelAnnotationCameraUtilitiesService(_, $q) {
		return {
			enrichCameraEntityFromView(viewerInfo, cameraEntity) {
				const camInfo = viewerInfo.getCurrentCamPos();
				if (!camInfo) {
					return $q.reject('Camera position not retrieved.');
				}

				const cutInfo = viewerInfo.getCuttingActive() ? viewerInfo.getCuttingPlane() : null;

				const blacklistPromise = viewerInfo.getFilterEngine().getBlacklist().getMeshIds();

				const snapshotPromise = viewerInfo.takeSnapshot({
					width: 1024,
					height: 768
				});

				return $q.all({
					blacklist: blacklistPromise,
					snapshot: snapshotPromise
				}).then(function (results) {
					const blacklistInfo = results.blacklist;

					const cameraEntityPromise = $q.when(_.isFunction(cameraEntity) ? cameraEntity() : cameraEntity);
					return cameraEntityPromise.then(function (effectiveCameraEntity) {
						_.assign(effectiveCameraEntity, camInfo);
						effectiveCameraEntity.Snapshot = results.snapshot;
						if (!blacklistInfo.isEmpty()) {
							effectiveCameraEntity.HiddenMeshIds = blacklistInfo.useGlobalModelIds().toCompressedString();
						}
						if (Array.isArray(cutInfo) && cutInfo.length > 0) {
							effectiveCameraEntity.ClippingPlanes = cutInfo;
						}

						return effectiveCameraEntity;
					});
				});
			}
		};
	}
})(angular);
