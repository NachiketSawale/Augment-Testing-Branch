import { SimulationNodeDatum } from 'd3';
import { IBasicsCustomizeRelationTypeEntity } from '@libs/basics/interfaces';
import { IBusinessPartnerSearchMainEntity } from '../lookup/business-partner-search/business-partner-search-main-entity.interface';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';

export enum NodeDataType {
	BusinessPartner = 'businessPartner',
	Subsidiary = 'subsidiary',
}

export interface IRelation {
	Id: number;
	SourceId: string;
	TargetId: string;
	RelationTypeFk: number;
}

export interface IRelationNode extends SimulationNodeDatum {
	Id: string;
	name?: string | null;
	data: IBusinessPartnerSearchMainEntity | ISubsidiaryEntity;
	image?: string | null;
	info: Record<string, string | null | undefined>;
	dataType: NodeDataType;
	isMain?: boolean;
	selected?: boolean;
	fixed?: boolean;
	px?: number;
	py?: number;
	showTooltip?: boolean;
}

export interface IRelationLink<T extends IRelationNode> {
	Id: number;
	source: T;
	target: T;
	relation: IRelation;
	relationType: IRelationType;
	color?: object;
	info: string;
	colorTypeId?: number;
}

export interface IRelationChartData {
	nodes: IRelationNode[];
	links: IRelationLink<IRelationNode>[];
	relationTypes: IBpRelationType[];
}

export interface IRelationType {
	id: number;
	name: string;
	color: string;
}

export interface IBpRelationType extends IBasicsCustomizeRelationTypeEntity {
	Color?: object;
}

export interface IBusinessPartnerInfo {
	Id: number;
	BusinessPartnerFk: number;
	SubsidiaryDto: ISubsidiaryEntity | null;
	Blob: string | null;
}