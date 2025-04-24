/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEngDrawingComponentEntity } from './eng-drawing-component-entity.interface';

export interface IQuantityAssignmentResultGenerated {

	/*
	 * DrawingComponentsToSave
	 */
	DrawingComponentsToSave?: IEngDrawingComponentEntity[] | null;

	/*
	 * QuantityMappingToDelete
	 */
	//TODO: QuantityMappingToDelete?: IQuantityMappingInfo[] | null;

	/*
	 * QuantityMappingToSave
	 */
	//TODO: QuantityMappingToSave?: IQuantityMappingInfo[] | null;
}
