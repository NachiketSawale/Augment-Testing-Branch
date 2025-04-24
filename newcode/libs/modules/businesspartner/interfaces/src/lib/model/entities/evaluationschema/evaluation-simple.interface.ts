/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntitySelection, IParentRole } from '@libs/platform/data-access';
import { InjectionToken } from '@angular/core';
import { IMenuItemsList } from '@libs/ui/common';
import { ScreenEvaluationCompleteEntity } from './screen-evaluation-complete-entity.class';
import { IEvaluationDocumentToSaveEntity } from './evaluation-document-to-save-entity.interface';
import { IEvaluationEntity } from './evaluation-entity.interface';
import { IEvaluationGroupDataEntity } from './evaluation-group-data-entity.interface';

export const EvaluationExtendCreateOptionsToken = new InjectionToken<IExtendCreateOptions>('EVALUATION_EXTEND_CREATE_OPTIONS');

export const EvaluationExtendUpdateOptionsToken = new InjectionToken<IExtendUpdateOptions>('EVALUATION_EXTEND_UPDATE_OPTIONS');

export const EvaluationToolbarListToken = new InjectionToken<EvaluationToolbarList>('evaluationToolbarList');

export interface ISummary {
	Total: number;
}

export interface ILegendStyle {
	text: string;
	hidden: boolean;
	fillStyle: string;
	strokeStyle: string;
}

export interface IEvaluationChangedParam {
	data: IEvaluationChangedParamData;
	eventName: string;
	sender: IEntitySelection<object>;
}

export interface IEvaluationChangedParamData {
	evaluation?: IEvaluationEntity | null;
	parent?: IEvaluationEntity | null;
	entities?: IEvaluationEntity[];
	resetEvaluation?: IEvaluationEntity[];
}

export interface IExtendDataReadParams {
	filter: string;
}

export type CallbackFun<T> = (data?: T) => object | void;

export interface IExtendCreateOptions {
	EvaluationMotiveId?: number;
	businessPartnerId?: number;
	canEditReferences: boolean;
	canSave: boolean;
	evaluationSchemaId?: number;
	projectFk?: number;
	qtnHeaderFk?: number;
	saveImmediately: boolean;
	isCreate: boolean;
}

export interface IExtendUpdateOptions {
	canEditReferences: boolean;
	canSave: boolean;
	evaluationId?: number;
	getDataFromLocal: boolean;
	permissionObjectInfo?: string | null;
	saveImmediately: boolean;
	isUpdate: boolean;
}

export enum EvaluationSaveType {
	ISCREATE,
	ISUPDATE,
}

export enum EvaluationPermissionEnum {
	EVAL,
	EVALGROUP,
	EVALCLERK,
	EVALGROUPCLERK,
	EVALSUBGROUPCLERK,
	EVALITEM,
}

export enum EvaluationSchemaChangedType {
	create,
	view,
}

export interface IEvaluationGroupCreateParam {
	EvaluationId: number;
	EvaluationSchemaId?: number;
	MainItemId?: number;
	changedType: EvaluationSchemaChangedType;
}

export interface IEvaluationGroupLoadParam {
	MainItemId?: number;
	changedType: EvaluationSchemaChangedType;
}

export interface IDescriptorDto {
	Id: number;
	Description: string;
}

export enum EvaluationClerkType {
	EVAL = 1,
	GROUP,
	SUBGROUP,
}

export enum EvaluationServiceTypes {
	EVALUATION_DATA = 'EVALUATION_DATA',
	EVALUATION_DETAIL = 'EVALUATION_DETAIL',
	DOCUMENT_DATA = 'DOCUMENT_DATA',
	GROUP_DATA = 'GROUP_DATA',
	ITEM_DATA = 'ITEM_DATA',
	EVALUATION_VALIDATION = 'EVALUATION_VALIDATION',
	DOCUMENT_VALIDATION = 'DOCUMENT_VALIDATION',
	GROUP_VALIDATION = 'GROUP_VALIDATION',
	ITEM_VALIDATION = 'ITEM_VALIDATION',
	EVALUATION_LAYOUT = 'EVALUATION_LAYOUT',
	EVALUATION_DETAIL_LAYOUT = 'EVALUATION_DETAIL_LAYOUT',
	EVALUATION_UI_STANDARD = 'EVALUATION_UI_STANDARD',
	EVALUATION_DETAIL_UI_STANDARD = 'EVALUATION_DETAIL_UI_STANDARD',
	EVALUATION_CLERK_DATA = 'EVALUATION_CLERK_DATA',
	EVALUATION_CLERK_VALIDATION = 'EVALUATION_CLERK_VALIDATION',
	EVALUATION_CLERK_UI_STANDARD = 'EVALUATION_CLERK_UI_STANDARD',
	EVALUATION_GROUP_CLERK_DATA = 'EVALUATION_GROUP_CLERK_DATA',
	EVALUATION_GROUP_CLERK_VALIDATION = 'EVALUATION_GROUP_CLERK_VALIDATION',
	EVALUATION_GROUP_CLERK_UI_STANDARD = 'EVALUATION_GROUP_CLERK_UI_STANDARD',
	EVALUATION_SUBGROUP_CLERK_DATA = 'EVALUATION_SUBGROUP_CLERK_DATA',
	EVALUATION_SUBGROUP_CLERK_VALIDATION = 'EVALUATION_SUBGROUP_CLERK_VALIDATION',
	EVALUATION_SUBGROUP_CLERK_UI_STANDARD = 'EVALUATION_SUBGROUP_CLERK_UI_STANDARD',
}

export interface EvaluationToolbarList {
	groupViewTools: IMenuItemsList;
	documentViewTools: IMenuItemsList;
	clerkCommonViewTools: IMenuItemsList;
}

export interface IEventEmitterParam<T> {
	result: T;
}

export interface IEvaluationModification {
	BusinessPartnerEvaluationToSave: ScreenEvaluationCompleteEntity[];
	EvaluationDocumentToSave: IEvaluationDocumentToSaveEntity[];
	MainItemId: number;
	EntitiesCount: number;
	CreateEntities: IEvaluationModificationCreateEntities[];
}

export interface IEvaluationModificationCreateEntities {
	CreateEntities: IEvaluationGroupDataEntity[];
	MainItemId: number;
}

export interface IEvaluationClerkDataCreateParam {
	serviceDescriptor: string;
	parentService: IParentRole<object, object> & IEntitySelection<object>;
	qualifier: string;
	evalClerkType: EvaluationClerkType;
	options: IEvaluationClerkDataCreateOption;
}

export interface IEvaluationClerkDataCreateOption {
	moduleName?: string;
	itemName?: string;
	canLoad?: (flag: boolean) => void;
}

export type TPoints = {
	points: number
}

export type TEvaluationSchemaChangedParam = IEvaluationGroupCreateParam | IEvaluationGroupLoadParam;

export type TEvaluationClerkInfo = {
	name: string,
	containerUUID: string,
	containerTitle: string,
	permissionName: string,
	hasRead?: boolean | null,
}