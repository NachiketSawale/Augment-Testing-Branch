/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationEntityGenerated } from './evaluation-entity-generated.interface';

export interface IEvaluationEntity extends IEvaluationEntityGenerated {
    /**
     * image
     */
    image: string;
    
    /**
     * IconSrc
     */
	IconSrc: string;
}
