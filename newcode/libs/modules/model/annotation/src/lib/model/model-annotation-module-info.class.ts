/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { ANNOTATION_ENTITY_INFO } from './model-annotation-entity-info.model';
import { MODEL_ANNOTATION_DOCUMENT_ENTITY_INFO } from './model-annotation-document-entity-info.model';
import { MODEL_ANNOTATION_REFERENCE_ENTITY_INFO } from './model-annotation-reference-entity-info.model';

/**
 * The module info object for the `model.annotation` content module.
 */
export class ModelAnnotationModuleInfo extends BusinessModuleInfoBase {
	private static _instance?: ModelAnnotationModuleInfo;

	/**
	 * Returns the singleton instance of the class.
	 *
	 * @return The singleton instance.
	 */
	public static get instance(): ModelAnnotationModuleInfo {
		if (!this._instance) {
			this._instance = new ModelAnnotationModuleInfo();
		}

		return this._instance;
	}

	private constructor() {
		super();
	}

	/**
	 * Returns the internal name of the module.
	 *
	 * @return The internal module name.
	 */
	public override get internalModuleName(): string {
		return 'model.annotation';
	}

	/**
	 * Returns the internal pascal case name of the module.
	 *
	 * @return The internal pascal case module name.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Model.Annotation';
	}

	/**
	 * Returns the entity definitions in the module.
	 *
	 * @return The entity definitions.
	 */
	public override get entities(): EntityInfo[] {
		return [
			ANNOTATION_ENTITY_INFO,MODEL_ANNOTATION_DOCUMENT_ENTITY_INFO,MODEL_ANNOTATION_REFERENCE_ENTITY_INFO
		];
	}
}
