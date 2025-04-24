/*
 * Copyright(c) RIB Software GmbH
 */


import { CompleteIdentification } from '@libs/platform/common';
import { IRequisitionDocumentEntity, IRequisitionEntity, IRequisitionitemEntity, IRequisitionRequiredSkillEntity } from '@libs/resource/interfaces';
import { RequisitionItemComplete } from './requisition-item-complete.class';


export class RequisitionComplete implements CompleteIdentification<IRequisitionEntity> {
	/**
	 * Id
	 */
	public Id: number = 0;

	/**
	 * RequiredSkillsToDelete
	 */
	public RequiredSkillsToDelete?: IRequisitionRequiredSkillEntity[] | null;

	/**
	 * RequiredSkillsToSave
	 */
	public RequiredSkillsToSave?: IRequisitionRequiredSkillEntity[] | null;

	/**
	 * Requisition
	 */
	public Requisition?: IRequisitionEntity | null;

	/**
	 * RequisitionDocumentToDelete
	 */
	public RequisitionDocumentToDelete?: IRequisitionDocumentEntity[] | null;

	/**
	 * RequisitionDocumentToSave
	 */
	public RequisitionDocumentToSave?: IRequisitionDocumentEntity[] | null;

	/**
	 * RequisitionId
	 */
	public RequisitionId: number = 0;

	/**
	 * RequisitionItemsToDelete
	 */
	public RequisitionItemsToDelete?: IRequisitionitemEntity[] | null;

	/**
	 * RequisitionItemsToSave
	 */
	public RequisitionItemsToSave?: RequisitionItemComplete[] | null;

	/**
	 * Requisitions
	 */
	public Requisitions?: IRequisitionEntity[] | null;

	/**
	 * entities
	 */
	public entities: number = 0;
}
