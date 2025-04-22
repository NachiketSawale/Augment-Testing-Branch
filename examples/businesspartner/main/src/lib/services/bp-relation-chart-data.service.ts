import { inject, Injectable } from '@angular/core';
import { IDescriptionInfo, PlatformTranslateService, PlatformHttpService} from '@libs/platform/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { extend, get, padStart, orderBy, cloneDeep } from 'lodash';
import { IBpRelationType, IBusinessPartnerInfo, IRelation, IRelationChartData, IRelationLoadedEntity, IRelationNode, ISubsidiaryEntity, NodeDataType } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';

@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerMainRelationChartDataService {
	private readonly httpService = inject(PlatformHttpService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly bpLookupService = inject(BusinessPartnerLookupService);
	private readonly bpDataService = inject(BusinesspartnerMainHeaderDataService);

	private cacheData: Record<number, IRelationChartData> = {};
	private subIdPrefix = 'sub_';
	private subsidiary2BpRelationType: IBpRelationType;
	private defaultSubsidiary2BpRelationType: IBpRelationType;
	private allBusinessPartnerRelationTypes: IBpRelationType[] = [];
	private relationSubsidiaries: ISubsidiaryEntity[] = [];
	private addressLabel = this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.relationInfoAddressLabel').text;
	private telephoneLabel = this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.relationInfoTelephoneLabel').text;
	public showBranchDimension = false;

	public constructor() {
		const defaultDescriptionInfo: IDescriptionInfo = {
			Description: '',
			DescriptionTr: 0,
			DescriptionModified: false,
			Translated: '',
			VersionTr: 0,
			Modified: false,
			OtherLanguages: null,
		};
		this.defaultSubsidiary2BpRelationType = {
			Id: 1000,
			DescriptionInfo: {
				...defaultDescriptionInfo,
				Translated: this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.sub2BpRelationTypeDesc').text,
			},
			OppositeDescriptionInfo: {
				...defaultDescriptionInfo,
				Translated: this.translateService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.sub2BpRelationTypeOppositeDesc').text,
			},
			Sorting: 1000,
			IsDefault: false,
			IsLive: true,
			RelationColor: 1279156,
			OppositeRelationColor: 8198001,
		};

		this.subsidiary2BpRelationType = this.defaultSubsidiary2BpRelationType;
	}

	public async load(depth: number, dontUseCache: boolean) {
		let oldData: IRelationChartData;
		const businessPartner = this.bpDataService.getSelectedEntity();

		if (!businessPartner) {
			return null;
		}

		let result = this.cacheData[businessPartner.Id];

		if (dontUseCache || !this.cacheData[businessPartner.Id]) {
			const defaultData = {
				nodes: [],
				links: [],
				relationTypes: [],
			};
			oldData = this.cacheData[businessPartner.Id] || cloneDeep(defaultData);
			this.cacheData[businessPartner.Id] = defaultData;
			// $rootScope.$broadcast('asyncInProgress', true);
			const data = await this.httpService.get<IRelationLoadedEntity>('businesspartner/main/relation/list', {
				params: {
					MainItemId: businessPartner.Id,
					Level: depth || 5,
				},
			});

			// $rootScope.$broadcast('asyncInProgress', false);
			data.AllBusinessPartnerRelationTypeDto = data.AllBusinessPartnerRelationTypeDto || [];
			this.allBusinessPartnerRelationTypes = data.AllBusinessPartnerRelationTypeDto;
			this.relationSubsidiaries = data.RelationSubsidiaryDto || [];

			if (data.Main.length) {
				if (this.showBranchDimension) {
					this.subsidiary2BpRelationType = data.AllBusinessPartnerRelationTypeDto.find((e) => e.Id === 1) || this.defaultSubsidiary2BpRelationType;
				}
				// lookupDescriptorService.attachData(response.data);

				this.bpLookupService.cache.setItems(data.BusinessPartner);

				let relationTypes = data.AllBusinessPartnerRelationTypeDto;
				relationTypes = orderBy(relationTypes, 'Sorting');
				this.setColor(relationTypes);
				this.cacheData[businessPartner.Id].relationTypes = relationTypes;
				let tempRelationIdIndex = 1;
				data.Main.forEach((relation) => {
					let bpNode: IRelationNode | null;
					let bp2Node: IRelationNode | null;
					let subNode: IRelationNode | null = null;
					let sub2Node: IRelationNode | null = null;
					if (this.showBranchDimension) {
						bpNode = this.initDataNode(oldData.nodes, relation.BusinessPartnerFk, data.BusinessPartnerInfo || []);
						bp2Node = this.initDataNode(oldData.nodes, relation.BusinessPartner2Fk, data.BusinessPartnerInfo || []);
						subNode = this.initSubDataNode(oldData.nodes, relation.BpSubsidiaryFk);
						sub2Node = this.initSubDataNode(oldData.nodes, relation.BpSubsidiary2Fk);
						if (bpNode && bp2Node) {
							if (subNode) {
								const bp2SubRelation = this.buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk.toString(), this.subIdPrefix + relation.BpSubsidiaryFk, this.subsidiary2BpRelationType.Id);
								this.initDataLink(this.cacheData[businessPartner.Id], bp2SubRelation, bpNode, subNode);
							}

							if (sub2Node) {
								const bp2ToSub2Relation = this.buildRelation(tempRelationIdIndex++, relation.BusinessPartner2Fk.toString(), this.subIdPrefix + relation.BpSubsidiary2Fk, this.subsidiary2BpRelationType.Id);
								this.initDataLink(this.cacheData[businessPartner.Id], bp2ToSub2Relation, bp2Node, sub2Node);
							}

							if (!subNode && !sub2Node) {
								const bpToBp2Relation = this.buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk.toString(), relation.BusinessPartner2Fk.toString(), relation.RelationTypeFk);
								this.initDataLink(this.cacheData[businessPartner.Id], bpToBp2Relation, bpNode, bp2Node);
							} else if (subNode && !sub2Node) {
								const subToBp2Relation = this.buildRelation(tempRelationIdIndex++, this.subIdPrefix + relation.BpSubsidiaryFk, relation.BusinessPartner2Fk.toString(), relation.RelationTypeFk);
								this.initDataLink(this.cacheData[businessPartner.Id], subToBp2Relation, subNode, bp2Node);
							} else if (!subNode && sub2Node) {
								const bpToSub2Relation = this.buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk.toString(), this.subIdPrefix + relation.BpSubsidiary2Fk, relation.RelationTypeFk);
								this.initDataLink(this.cacheData[businessPartner.Id], bpToSub2Relation, bpNode, sub2Node);
							} else if (subNode && sub2Node) {
								const subToSub2Relation = this.buildRelation(tempRelationIdIndex++, this.subIdPrefix + relation.BpSubsidiaryFk, this.subIdPrefix + relation.BpSubsidiary2Fk, relation.RelationTypeFk);
								this.initDataLink(this.cacheData[businessPartner.Id], subToSub2Relation, subNode, sub2Node);
							}
						}
					} else {
						bpNode = this.initDataNode(oldData.nodes, relation.BusinessPartnerFk, data.BusinessPartnerInfo || []);
						bp2Node = this.initDataNode(oldData.nodes, relation.BusinessPartner2Fk, data.BusinessPartnerInfo || []);
						if (bpNode && bp2Node) {
							const tempRelation = this.buildRelation(relation.Id, relation.BusinessPartnerFk.toString(), relation.BusinessPartner2Fk.toString(), relation.RelationTypeFk);
							this.initDataLink(this.cacheData[businessPartner.Id], tempRelation, bpNode, bp2Node);
						}
					}
				});
				const findObj = this.cacheData[businessPartner.Id].nodes.find((e) => e.Id === businessPartner.Id.toString());
				if (findObj) {
					findObj.isMain = true;
				}
			}
			result = this.cacheData[businessPartner.Id];
		}
		return result;
	}

	public relationArrows(relation: IRelation, source: IRelationNode, target: IRelationNode) {
		const lineLength = { x: 15, y: 5 };
		const direction = relation.SourceId === target.Id ? 1 : -1;
		const center = { x: ((source.x ?? 0) + (target.x ?? 0)) / 2, y: ((source.y ?? 0) + (target.y ?? 0)) / 2 };
		let vector = { ax: (source.x ?? 0) - (target.x ?? 0), ay: (source.y ?? 0) - (target.y ?? 0) };
		const vectorLength = Math.sqrt(vector.ax * vector.ax + vector.ay * vector.ay);
		vector = { ax: (vector.ax / vectorLength) * direction, ay: (vector.ay / vectorLength) * direction };

		const x1 = center.x + lineLength.x * vector.ax + lineLength.y * vector.ay;
		const y1 = center.y + lineLength.x * vector.ay - lineLength.y * vector.ax;
		const x2 = center.x;
		const y2 = center.y;
		const x3 = center.x + lineLength.x * vector.ax - lineLength.y * vector.ay;
		const y3 = center.y + lineLength.x * vector.ay + lineLength.y * vector.ax;

		return 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + ' L' + x3 + ',' + y3;
	}

	private initDataNode(oldNodes: IRelationNode[] | undefined | null, businessPartnerFk: number, businessPartnerInfo: IBusinessPartnerInfo[]) {
		const bps = this.bpLookupService.syncService?.getListSync();
		const bp = bps?.find((e) => e.Id === businessPartnerFk);
		const backNode = oldNodes ? oldNodes.find((e) => e.Id === businessPartnerFk.toString()) : undefined;
		const info = businessPartnerInfo.find((e) => e.BusinessPartnerFk === businessPartnerFk);

		if (bp && info) {
			const temp = {
				Id: bp.Id.toString(),
				name: bp.BusinessPartnerName1,
				data: bp,
				image: info.Blob && 'data:image/jpg;base64,' + info.Blob,
				info: {},
				dataType: NodeDataType.BusinessPartner,
			};

			const result: IRelationNode = backNode ? extend(backNode, temp) : temp;

			result.info[this.addressLabel] = info.SubsidiaryDto ? get(info.SubsidiaryDto, 'AddressDto.AddressLine') : null;
			result.info[this.telephoneLabel] = info.SubsidiaryDto ? get(info.SubsidiaryDto, 'TelephoneNumber1Dto.Telephone') : null;
			return result;
		}
		return null;
	}

	private initSubDataNode(oldNodes: IRelationNode[], subsidiaryId?: number | null) {
		if (!subsidiaryId) {
			return null;
		}
		const subsidiary = this.relationSubsidiaries.find((e) => e.Id === subsidiaryId);
		if (!subsidiary) {
			return null;
		}

		const backNode = oldNodes.find((e) => e.Id === this.subIdPrefix + subsidiaryId);
		const temp = {
			Id: this.subIdPrefix + subsidiaryId,
			name: subsidiary.Description,
			data: subsidiary,
			image: null,
			info: {},
			dataType: NodeDataType.Subsidiary,
		};
		const result: IRelationNode = backNode ? extend(backNode, temp) : temp;

		result.info[this.addressLabel] = subsidiary.AddressDto?.AddressLine;
		result.info[this.telephoneLabel] = subsidiary.TelephoneNumber1Dto?.Telephone;
		return result;
	}

	private initDataLink(cache: IRelationChartData, relation: IRelation, node1: IRelationNode, node2: IRelationNode) {
		const relationType = this.allBusinessPartnerRelationTypes.find((e) => e.Id === relation.RelationTypeFk);
		if (!relationType) {
			return;
		}

		const relationTypeName = relationType.DescriptionInfo?.Translated + ' -  ' + relationType.OppositeDescriptionInfo?.Translated;
		const colorType = relationType.Color;
		let node1Temp = cache.nodes.find((e) => e.Id === node1.Id);
		let node2Temp = cache.nodes.find((e) => e.Id === node2.Id);
		if (!node1Temp) {
			node1Temp = node1;
			cache.nodes.push(node1Temp);
		}
		if (!node2Temp) {
			node2Temp = node2;
			cache.nodes.push(node2Temp);
		}

		[node1, node2].forEach((node) => {
			if (
				!cache.nodes.some((item) => {
					return item.Id === node.Id;
				})
			) {
				cache.nodes.push(node);
			}
		});

		cache.links.push({
			Id: relation.Id,
			source: node1Temp,
			target: node2Temp,
			relation: relation,
			relationType: {
				id: relationType.Id,
				name: relationTypeName,
				color: '#' + padStart(relationType.Id.toString(16), 7, '#000000'),
			},
			color: colorType,
			info: relationTypeName,
		});
	}

	private buildRelation(id: number, sourceId: string, targetId: string, relationTypeId: number) {
		return {
			Id: id,
			SourceId: sourceId,
			TargetId: targetId,
			RelationTypeFk: relationTypeId,
		};
	}

	private setColor(relationTypeList: IBpRelationType[]) {
		relationTypeList.forEach((item) => {
			let numStr: string;
			if (item.Id >= 0) {
				numStr = item.RelationColor.toString(16);
			} else {
				numStr = item.OppositeRelationColor.toString(16);
			}
			const count = 6 - numStr.length;
			for (let i = 0; i < count; i++) {
				numStr = '0' + numStr;
			}
			item.Color = { 'background-color': '#' + numStr };
		});
	}
}