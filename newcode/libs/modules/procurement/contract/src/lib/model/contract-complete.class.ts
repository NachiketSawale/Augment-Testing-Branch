/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity, IConItemEntity } from './entities';
import { IPrcSubreferenceEntity, IPrcDocumentEntity, IPrcGeneralsEntity } from '@libs/procurement/common';
import { IConTotalEntity, IPrcHeaderEntity, IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ConItemComplete } from './con-item-complete.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IBoqParentCompleteEntity } from '@libs/boq/main';
import { ICommonBillingSchemaEntity } from '@libs/basics/shared';
import { IHeaderPparamEntity } from '@libs/basics/pricecondition';
import { IPrcBoqExtendedComplete } from '../services/procurement-contract-boq.service';
import { IConAccountAssignmentEntity } from './entities/con-account-assignment-entity.interface';
import { IConMasterRestrictionEntity } from './entities/con-master-restriction-entity.interface';
import { IChangeEntity } from './entities/change-entity.interface';

export class ContractComplete implements CompleteIdentification<IConHeaderEntity>, IBoqParentCompleteEntity {
	public ConHeader?: IConHeaderEntity;
	public ConHeaders?: IConHeaderEntity[];  
	public EntitiesCount?: number;
	public MainItemId?: number;
	public PrcHeader?: IPrcHeaderEntity;
	public PrcItemToDelete?: Array<IConItemEntity>;
	public PrcItemToSave?: Array<ConItemComplete>;
	public TotalToDelete?: Array<IConTotalEntity>;
	public TotalToSave?: Array<IConTotalEntity>;
	public PrcDocumentToSave?: Array<IPrcDocumentEntity>;
	public PrcDocumentToDelete?: Array<IPrcDocumentEntity>;
	public BillingSchemaToSave?: Array<ICommonBillingSchemaEntity>;
	public BillingSchemaToDelete?: Array<ICommonBillingSchemaEntity>;
	public PrcSubreferenceToSave?: Array<IPrcSubreferenceEntity>;
	public PrcSubreferenceToDelete?: Array<IPrcSubreferenceEntity>;
	public HeaderPparamToSave?: Array<IHeaderPparamEntity>;
	public HeaderPparamToDelete?: Array<IHeaderPparamEntity>;
	public PrcBoqExtendedToSave?: Array<IPrcBoqExtendedComplete>; 
	public PrcBoqExtendedToDelete?: Array<IPrcBoqExtendedEntity>;  
	public ConAccountAssignmentDtoToSave?: Array<IConAccountAssignmentEntity>;
	public ConAccountAssignmentDtoToDelete?: Array<IConAccountAssignmentEntity>;
	public ProjectChangeToSave?:Array<IChangeEntity>; 
	public ProjectChangeToDelete?:Array<IChangeEntity>;  
	public ConMasterRestrictionToSave?: Array<IConMasterRestrictionEntity>;
	public ConMasterRestrictionToDelete?: Array<IConMasterRestrictionEntity>;
	public PrcGeneralsToSave?:Array<IPrcGeneralsEntity>;
	public PrcGeneralsToDelete?:Array<IPrcGeneralsEntity>;
}
