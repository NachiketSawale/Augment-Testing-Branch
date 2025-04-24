/*
 * Copyright(c) RIB Software GmbH
 */
import {IDocumentProjectEntity} from '../entities/document-project-entity.interface';

export interface IValidateBpfkEntity{
    Document: IDocumentProjectEntity,
    Field2Validate?: number | null,
    NewIntValue?: number | null,
    NewStringValue: string,
    ValidationErrorMessage:string,
    ValidationResult: boolean
}