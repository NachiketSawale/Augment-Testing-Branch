import {EntityInfo} from '@libs/ui/business-base';
import {
	BusinesspartnerMainPrcStructureGridBehavior
} from '../../behaviors/businesspartner-main-prc-structure-grid-behavior.service';
import {BusinesspartnerPrcStructureDataService} from '../../services/businesspartner-prcstructure-data.service';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IBusinessPartner2PrcStructureEntity } from '@libs/businesspartner/interfaces';

export const BUSINESSPARTNER_PRCSTRUCTURE_INFO_ENTITY = EntityInfo.create<IBusinessPartner2PrcStructureEntity>({
	grid: {
		title: {
			text: 'Procurement Structure',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.procurementStructureContainerTitle',
		},
		behavior: (ctx) => ctx.injector.get(BusinesspartnerMainPrcStructureGridBehavior),
	},
	dataService: (ctx) => ctx.injector.get(BusinesspartnerPrcStructureDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BusinessPartner2PrcStructureDto' },
	permissionUuid: '77964d3aa8fb47a6af4bbcb4e65cdafb',
	layoutConfiguration: async ctx => {
		const bpRelatedLookupProvider = await (ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN));
		return {
			groups: [{ gid: 'default-group', attributes: ['BpdSubsidiaryFk'/* , 'PrcStructureCode', 'PrcStructureDescription',
				'PrcStructureComment', 'PrcStructureIsLive', 'PrcStructureAllowAssignment' */] }],
			overloads: {
				BpdSubsidiaryFk: {
					label: {
						text: 'Subsidiary',
						key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entitySubsidiary'
					},
					visible: true,
					readonly: true,
					lookup: bpRelatedLookupProvider.getSubsidiaryLookupOverload(),
				},
				/* PrcStructureCode: {
					label: {
						text: 'Code',
						key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.code'
					},
					visible: true,
					readonly: true,
					type: FieldType.Code,
					valueAccessor: {
						getValue(obj: IBusinessPartner2PrcStructureEntity): string | undefined {
							return obj.PrcStructure?.Code;
						}
					}
				},
				PrcStructureDescription: {
					label: {
						text: 'Description',
						key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.description'
					},
					visible: true,
					readonly: true,
					type: FieldType.Description,
					valueAccessor: {
						getValue(obj: IBusinessPartner2PrcStructureEntity): string | undefined {
							return obj.PrcStructure?.Description;
						}
					}
				},
				PrcStructureComment: {
					label: {
						text: 'Comment',
						key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.comment'
					},
					visible: true,
					readonly: true,
					type: FieldType.Comment,
					valueAccessor: {
						getValue(obj: IBusinessPartner2PrcStructureEntity): string | undefined {
							return obj.PrcStructure?.Comment;
						}
					}
				},
				PrcStructureIsLive: {
					label: {
						text: 'Active',
						key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityIsLive'
					},
					visible: true,
					readonly: true,
					type: FieldType.Boolean,
					valueAccessor: {
						getValue(obj: IBusinessPartner2PrcStructureEntity): boolean | undefined {
							return obj.PrcStructure?.IsLive;
						}
					}
				},
				PrcStructureAllowAssignment: {
					label: {
						text: 'Allow Assignment',
						key: 'basics.procurementstructure.allowAssignment'
					},
					visible: true,
					readonly: true,
					type: FieldType.Boolean,
					valueAccessor: {
						getValue(obj: IBusinessPartner2PrcStructureEntity): boolean | undefined {
							return obj.PrcStructure?.AllowAssignment;
						}
					}
				}, */
			}
		};
	}
});