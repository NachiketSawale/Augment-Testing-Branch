/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObjectEntity, IViewpointEntity, ViewpointComplete } from '../../model/models';
import { ModelObjectComplete } from '../../model/model-main-object-complete.class';
import { ModelMainObjectDataService } from '../../services/model-main-object-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class ModelMainViewpointDataService extends DataServiceFlatLeaf<IViewpointEntity, IModelObjectEntity, ModelObjectComplete> {
	public modelAnnotationCameraUtilitiesService: unknown;

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	
	public constructor(private objectDataService: ModelMainObjectDataService) {
		const options: IDataServiceOptions<IViewpointEntity> = {
			apiUrl: 'model/main/viewpoint',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'byModel',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IViewpointEntity, IModelObjectEntity, ModelObjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelViewpoints',
				parent: objectDataService,
			},
			entityActions: {
				createSupported: true,
				deleteSupported: true
			}
		};

		super(options);
		this.processor.addProcessor({
			process: (item) => this.processItem(item),
			revertProcess() {
			}
		});
	}

	private processItem(item: IViewpointEntity) {
		this.updateNormalizedId(item);
		this.updateViewerButtonsOnItem(item);
	}
	// protected override provideLoadPayload(): object {
	// const selModelId = modelViewerModelSelectionService.getSelectedModelId() || -1; TODO:modelViewerModel needs to migrate
	// return {modelId: selModelId, includeCamera: true};

	// }


	//TODO:modelViewerModel needs to migrate
	// protected override provideCreatePayload(): object {
	// let selId = modelViewerModelSelectionService.getSelectedModelId();
	// return {PKey1 : selId};
	// }

	protected override onCreateSucceeded(created: IViewpointEntity): IViewpointEntity {
		this.updateNormalizedId(created);
		this.updateViewerButtonsOnItem(created);
		return created;
	}

	public updateNormalizedId(item : IViewpointEntity) {
		return item.NormalizedId = item.Id > 0 ? `vp${item.Id}` : `cp${item.ModelFk}/${item.LegacyId}`;
	}

	public updateViewerButtonsOnItem(item :IViewpointEntity) {
		// const selModel = modelViewerModelSelectionService.getSelectedModel(); //TODO modelViewerSelectionservice
		// const isRelevantModelShown = selModel && selModel.isGlobalModelIdIncluded(item.ModelFk);

		// const camera = item.Camera;
		// if (camera) {
		// 	const doShowCamPos = isRelevantModelShown ? function showModelCamPos(viewerInfo) {
		// 		return showCamPos(camera, viewerInfo);
		// 	} : function showNoCamPos() {
		// 	};

		// 	_.set(item, 'ShowInViewer.actionList', modelViewerViewerRegistryService.createViewerActionButtons({
		// 		disabled: !isRelevantModelShown,
		// 		execute: doShowCamPos
		// 	}));
		// } else {
		// 	_.set(item, 'ShowInViewer.actionList', null);
		// }

		// svc.fireItemModified(item);
	}


	//TODO: modelViewerModelSelectionService
	// public override canCreate() {
	// 	return Boolean(modelViewerModelSelectionService.getSelectedModelId());
	// }

	protected createMenuItemsList() {
		// const selModelId = modelViewerModelSelectionService.getSelectedModelId() || -1; //TODO modelViewerModelSelectionService need to implement

		const endpoint = this.config.webApiBaseUrl + 'model/main/viewpoint/byModel';
		const params = {
			// modelId: selModelId,
			includeCamera: true,
			// restrictToImportant: restrictToImportant
		};
		this.http.get<ViewpointComplete>(endpoint, { params: params }).subscribe(res => {
			if (Array.isArray(res.ModelViewpoints)) {
				return res.ModelViewpoints.map(item => {
					return {
						id: 'camPos-' + item.Id,
						caption: item.Description,
						fn: function () {
							  // Not migrated modelAnnotationCameraUtilitiesService
							// this.showCamPos(item.Camera, this.getViewerInfoFunc().info);
						},
						scopeLevel: item.Scope
					};
				});
			}

			return [];
		}
		);
	}

    // Not migrated modelAnnotationCameraUtilitiesService
	// public showCamPos(camera: { PosX: number; PosY: number; PosZ: number; DirX: number; DirY: number; DirZ: number; HiddenMeshIds?: string; ClippingPlanes?: any[] }, 
	// 	viewerInfo: { getFilterEngine: () => { getBlacklist: () => { excludeAll: () => void; }; }; setCuttingPlane: (planes: any) => void; setCuttingActive: () => void;
	// 	 setCuttingInactive: () => void; showCamPos: (data: { pos: { x: number; y: number; z: number }; trg: { x: number; y: number; z: number } }) => void }) {
	// 	// overwrite blacklist
	// 	{
	// 		const bl = viewerInfo.getFilterEngine().getBlacklist();
	// 		bl.excludeAll();

	// 		if (camera.HiddenMeshIds) {
	// 			// const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(camera.HiddenMeshIds).useSubModelIds();
	// 			// bl.includeMeshIds(meshIds);
	// 		}
	// 	}

	// 	// cutting planes
	// 	{
	// 		if (Array.isArray(camera.ClippingPlanes) && camera.ClippingPlanes.length > 0) {
	// 			viewerInfo.setCuttingPlane(camera.ClippingPlanes);
	// 			viewerInfo.setCuttingActive();
	// 		} else {
	// 			viewerInfo.setCuttingInactive();
	// 		}
	// 	}

	// 	viewerInfo.showCamPos({
	// 		pos: {
	// 			x: camera.PosX,
	// 			y: camera.PosY,
	// 			z: camera.PosZ
	// 		},
	// 		trg: {
	// 			x: camera.PosX + camera.DirX,
	// 			y: camera.PosY + camera.DirY,
	// 			z: camera.PosZ + camera.DirZ
	// 		}
	// 	});
	// }

	public createFromViewer() {
		if (!this.modelAnnotationCameraUtilitiesService) {
			// this.modelAnnotationCameraUtilitiesService = $injector.get('modelAnnotationCameraUtilitiesService'); //TODO modelAnnotationCameraUtilitiesService
		}
	}

}








