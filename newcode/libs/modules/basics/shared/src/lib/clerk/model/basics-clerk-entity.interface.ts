/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase,IEntityIdentification } from '@libs/platform/common';
/**
 * Basics Clerk entity interface
 */
export interface IBasicsClerkEntity extends IEntityBase,IEntityIdentification{
    ClerkFk?: number | null;
    ClerkRoleFk?: number | null;
    CommentText?: string | null;
    PrjDocumentFk?: number | null;
    ValidFrom?: string | null;
    ValidTo?: string | null;
    MainItemFk?: number;
    ContextFk?: number;
    CompanyFk?: number | null
}