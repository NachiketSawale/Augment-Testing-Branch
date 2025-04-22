/*
 * Copyright(c) RIB Software GmbH
 */

import { IWipBillingschemaEntity } from './entities/wip-billingschema-entity.interface';
import { IDocumentEntity } from './entities/document-entity.interface';
import { IGeneralsEntity } from './entities/generals-entity.interface';
import { IBil2WipEntity } from './entities/bil-2wip-entity.interface';
import { IWipBoqCompositeEntity } from './entities/wip-boq-composite-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';
import { IWipHeaderEntity } from './entities/wip-header-entity.interface';

export class WipHeaderComplete implements CompleteIdentification<IWipHeaderEntity> {

	/**
	 * BillingSchemaToDelete
	 */
	public BillingSchemaToDelete?: IWipBillingschemaEntity[] | null = [];

	/**
	 * BillingSchemaToSave
	 */
	public BillingSchemaToSave?: IWipBillingschemaEntity[] | null = [];

	/**
	 * DocumentsToDelete
	 */
	public DocumentsToDelete?: IDocumentEntity[] | null = [];

	/**
	 * DocumentsToSave
	 */
	public DocumentsToSave?: IDocumentEntity[] | null = [];

	/**
	 * EntitiesCount
	 */
	public EntitiesCount?: number | null = 10;

	/**
	 * GeneralsToDelete
	 */
	public GeneralsToDelete?: IGeneralsEntity[] | null = [];

	/**
	 * GeneralsToSave
	 */
	public GeneralsToSave?: IGeneralsEntity[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId?: number | null = 10;

	/**
	 * Wip2BillToDelete
	 */
	public Wip2BillToDelete?: IBil2WipEntity[] | null = [];

	/**
	 * Wip2BillToSave
	 */
	public Wip2BillToSave?: IBil2WipEntity[] | null = [];

	/**
	 * WipBoqCompositeToDelete
	 */
	public WipBoqCompositeToDelete?: IWipBoqCompositeEntity[] | null = [];

	/**
	 * WipBoqCompositeToSave
	 */
	public WipBoqCompositeToSave?: IWipBoqCompositeEntity[] | null = [];

	/**
	 * WipHeader
	 */
	public WipHeader: IWipHeaderEntity[] | null = [];
}
