/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsPhaseEntityGenerated } from './pps-phase-entity-generated.interface';

export interface IPpsPhaseEntity extends IPpsPhaseEntityGenerated {

	PpsFormworkFk?: number | null;
	PpsProductFk?: number | null;
	ProductDescriptionFk?: number | null;

	/*
	* Invalid or not
	*	invalid: a phase is linked to multiple products or formworks
	*/
	IsInvalid: boolean;

	/*
	* Flag to indicate if data was part of a sequence.
	*/
	IsSequence: boolean;

}