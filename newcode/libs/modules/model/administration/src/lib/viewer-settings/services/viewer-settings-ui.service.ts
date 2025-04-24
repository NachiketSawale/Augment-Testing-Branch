/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ConcreteField, ConcreteFieldOverload, FieldType, IField, IFieldOverload, ISelectItem } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Provides reusable definitions for the UI related to viewer settings.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationViewerSettingsUiService {

	private readonly translateSvc = inject(PlatformTranslateService);

	// rendering mode ----------------------------------------------------------------

	public configureRenderingModeField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureRenderingModeField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureRenderingModeField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.ImageSelect,
			itemsSource: {
				items: [{
					displayName: 'model.viewer.hoops.renderModeServer',
					id: 's'
				}, {
					displayName: 'model.viewer.hoops.renderModeClient',
					id: 'c'
				}]
			}
		};
	}

	// streaming mode ----------------------------------------------------------------

	public configureStreamingModeField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureStreamingModeField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureStreamingModeField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.ImageSelect,
			itemsSource: {
				items: [{
					displayName: 'model.viewer.hoops.streamingModeFull',
					id: 'f'
				}, {
					displayName: 'model.viewer.hoops.streamingModeLazy',
					id: 'l'
				}]
			}
		};
	}

	// drawing mode ----------------------------------------------------------------

	public configureDrawingModeField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureDrawingModeField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureDrawingModeField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.ImageSelect,
			itemsSource: {
				items: [{
					displayName: 'model.viewer.hoops.drawHidden',
					id: 'h'
				}, {
					displayName: 'model.viewer.hoops.drawShaded',
					id: 's'
				}, {
					displayName: 'model.viewer.hoops.drawWireframe',
					id: 'w'
				}, {
					displayName: 'model.viewer.hoops.drawWireframeOnShaded',
					id: 'a'
				}]
			}
		};
	}

	// anti-aliasing mode ----------------------------------------------------------------

	public configureAntiAliasingModeField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureAntiAliasingModeField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureAntiAliasingModeField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.Select,
			itemsSource: {
				items: [{
					displayName: 'model.viewer.aaNone',
					id: '-'
				}, {
					displayName: 'model.viewer.aaSMAA',
					id: 'smaa'
				}]
			}
		};
	}

	// projection mode ----------------------------------------------------------------

	public configureProjectionModeField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureProjectionModeField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureProjectionModeField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.ImageSelect,
			itemsSource: {
				items: [{
					displayName: 'model.viewer.projectionPerspective',
					id: 'p',
					iconCSS: 'tlb-icons ico-view-perspective'
				}, {
					displayName: 'model.viewer.projectionOrthograph',
					id: 'o',
					iconCSS:'tlb-icons ico-view-orthographic'
				}]
			}
		};
	}

	// camera view ----------------------------------------------------------------

	public configureCameraViewField<T extends object>(field: IField<T>): ConcreteField<T>;

	public configureCameraViewField<T extends object>(field: IFieldOverload<T>): ConcreteFieldOverload<T>;

	public configureCameraViewField<T extends object>(field: IField<T> | IFieldOverload<T>): ConcreteField<T> | ConcreteFieldOverload<T> {
		return {
			...field,
			type: FieldType.ImageSelect,
			// TODO: use reusable defs from model-common or model-interfaces
			itemsSource: {
				items: [{
					id: 'Iso',
					title: 'model.viewer.cameraIsoFrontRight',
					iconId: 'iso-front'
				}, {
					id: 'ReverseIso',
					title: 'model.viewer.cameraIsoBackLeft',
					iconId: 'iso-back'
				}].map(info => <ISelectItem<string>>{
					id: info.id,
					displayName: { key: info.title },
					iconCSS: `tlb-icons ico-view-${info.iconId}`
				})
			}
		};
	}
}
