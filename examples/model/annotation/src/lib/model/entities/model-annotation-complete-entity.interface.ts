/*
 * Copyright(c) RIB Software GmbH
 */

import { IModelAnnotationEntity } from './model-annotation-entity.interface';

/**
 * Stores an annotation with all descendant changes.
 */
export interface IModelAnnotationCompleteEntity {

	/*
	 * Id
	 */
	Id?: number | null;

	/*
	 * ModelAnnotations
	 */
	ModelAnnotations?: IModelAnnotationEntity | null;
}
