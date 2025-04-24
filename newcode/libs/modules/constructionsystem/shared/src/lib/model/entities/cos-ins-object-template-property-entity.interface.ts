/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosInsObjectTemplatePropertyEntityGenerated } from './cos-ins-object-template-property-entity-generated.interface';
import { PropertyValueType } from '../enum/property-value-type.enum';

export interface ICosInsObjectTemplatePropertyEntity extends ICosInsObjectTemplatePropertyEntityGenerated {
	/**
	 * BasUomFk
	 */
	Value?: boolean | string | number | Date | null;

	/**
	 * ValueType
	 */
	ValueType?: PropertyValueType | null;
}
