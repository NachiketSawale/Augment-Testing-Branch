/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IBasicsClerkEntity, IBasicsCustomizeEvaluationStatusEntity} from '@libs/basics/interfaces';
import { BusinessPartnerLookupVEntity, IContactLookupEntity, ISubsidiaryLookupEntity } from '../lookup';
import { IEvaluationSchemaIconEntity } from './evaluation-schema-icon-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationSchemaEntity } from './evaluation-schema-entity.interface';



export interface IEvaluationDateSetResponseEntity {

	/*
	 * BusinessPartner
	 */
	BusinessPartner?: BusinessPartnerLookupVEntity[] | null;

	/*
	 * EvaluationStatus
	 */
	EvaluationStatus?: IBasicsCustomizeEvaluationStatusEntity[] | null;

	/*
	 * SchemaIcons
	 */
	SchemaIcons?: IEvaluationSchemaIconEntity[] | null;

	/*
	 * Subsidiary
	 */
	Subsidiary?: ISubsidiaryLookupEntity[] | null;

	/*
	 * dtos
	 */
	dtos?: IEvaluationEntity | null;

	/*
	 * Clerk
	 */
	Clerk?: IBasicsClerkEntity[] | null;

	/*
	 * EvaluationSchema
	 */
	EvaluationSchema?: IEvaluationSchemaEntity [] | null;

	/*
	 * contact
	 */
	contact?: IContactLookupEntity[] | null;
}
