/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { BusinesspartnerEvaluationschemaHeaderService } from '../services/schema-data.service';
import { BusinessPartnerEvaluationSchemaGroupService } from '../services/group-data.service';
import { EvaluationSchemaGroupGridBehaviorService } from '../behaviors/evaluation-schema-group-grid-behavior.service';
import { EvaluationSchemaGridBehaviorService } from '../behaviors/evaluation-schema-grid-behavior.service';
import { EvaluationSchemaGroupIconGridBehaviorService } from '../behaviors/evaluation-schema-group-icon-grid-behavior.service';
import { BusinessPartnerEvaluationschemaGroupIconService } from '../services/group-icon-data.service';
import { BusinesspartnerEvaluationschemaIconService } from '../services/schema-icon-data.service';
import { EvaluationSchemaIconGridBehaviorService } from '../behaviors/evaluation-schema-icon-grid-behavior.service';
import { EvaluationSchemaSubGroupGridBehaviorService } from '../behaviors/evaluation-schema-subgroup-grid-behavior.service';
import { BusinessPartnerEvaluationSchemaSubGroupService } from '../services/subgroup-data.service';
import { createLookup, FieldType, ILookupContext, ILookupFieldOverload, LookupSimpleEntity } from '@libs/ui/common';
import * as _ from 'lodash';
import { BusinessPartnerEvaluationSchemaItemService } from '../services/items-data.service';
import { EvaluationSchemaItemGridBehaviorService } from '../behaviors/evaluation-schema-item-grid-behavior.service';
import {
	IEvaluationGroupEntity,
	IEvaluationGroupIconEntity,
	IEvaluationSchemaEntity,
	IEvaluationSchemaIconEntity,
	IEvaluationItemEntity,
	IEvaluationSubgroupEntity,
	BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN,
} from '@libs/businesspartner/interfaces';
import {
	BasicsSharedLookupOverloadProvider,
	BasicUserFormLookupService
} from '@libs/basics/shared';
import { BusinessPartnerEvaluationSchemaItemValidationService } from '../services/validations/item-validation.service';
import {
	BusinessPartnerEvaluationSchemaSubGroupValidationService
} from '../services/validations/subgroup-validation.service';

export class BusinesspartnerEvaluationschemaModuleInfo extends BusinessModuleInfoBase {
	private readonly cloudCommonModuleName = 'cloud.common';
	private readonly headerEntityInfo = this.getHeaderEntityInfo();
	private readonly groupEntityInfo = this.getGroupEntityInfo();
	private readonly groupIconEntityInfo = this.getGroupIconEntityInfo();
	private readonly schemaIconEntityInfo = this.getSchemaIconEntityInfo();
	private readonly subGroupEntityInfo = this.getSubGroupEntityInfo();
	private readonly itemEntityInfo = this.getItemEntityInfo();

	public static readonly instance = new BusinesspartnerEvaluationschemaModuleInfo();

	private constructor() {
		super();
	}

	public override get internalModuleName(): string {
		return 'businesspartner.evaluationschema';
	}

	private get moduleSubModule(): string {
		return 'BusinessPartner.EvaluationSchema';
	}

	public override get entities(): EntityInfo[] {
		return [this.headerEntityInfo, this.groupEntityInfo, this.groupIconEntityInfo, this.schemaIconEntityInfo, this.subGroupEntityInfo, this.itemEntityInfo];
	}

	/**
	 * Returns the translation container UUID for the procurement package module.
	 */
	protected override get translationContainer(): string | undefined {
		return 'f2593fd36ea84742b249f2b798fb9c30';
	}

	private getHeaderEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationSchemaEntity> = {
			dataService: (ctx) => ctx.injector.get(BusinesspartnerEvaluationschemaHeaderService),
			grid: {
				title: { text: 'Schemata', key: this.internalModuleName + '.headerGridContainerTitle' },
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaGridBehaviorService),
			},
			form: {
				title: { text: 'Schema Details', key: this.internalModuleName + '.headerFormContainerTitle' },
				containerUuid: 'ea75e48752624f3389ecc286ede0f763',
			},
			dtoSchemeId: {
				typeName: 'EvaluationSchemaDto',
				moduleSubModule: this.moduleSubModule,
			},
			layoutConfiguration: async (ctx) => {
				const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
				return {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['DescriptionInfo', 'Sorting', 'IsDefault', 'RubricCategoryFk', 'EvaluationMotiveFk', 'FormFk'],
						},
					],
					overloads: {
						Id: {
							label: {
								text: 'Id',
							},
							visible: true,
						},
						DescriptionInfo: {
							label: {
								text: 'Description',
								key: this.cloudCommonModuleName + '.entityDescription',
							},
							visible: true,
						},
						Sorting: {
							label: {
								text: 'Sorting',
								key: this.cloudCommonModuleName + '.entitySorting',
							},
							visible: true,
						},
						IsDefault: {
							label: {
								text: 'Is Default',
								key: this.cloudCommonModuleName + '.entityIsDefault',
							},
							visible: true,
						},
						RubricCategoryFk: {
							label: {
								text: 'Rubric Category',
								key: this.cloudCommonModuleName + '.entityBasRubricCategoryFk',
							},
							visible: true,
							lookupOptions: (
								bpRelatedLookupProvider.getEvaluationSchemaRubricCategoryLookupOverload({
									readonly: true,
									customClientSideFilter: {
										execute(item: LookupSimpleEntity, context: ILookupContext<LookupSimpleEntity, IEvaluationSchemaEntity>): boolean {
											return _.get(item, 'RubricFk') === 33;
										},
									},
								}) as ILookupFieldOverload<IEvaluationSchemaEntity>
							).lookupOptions,
						},
						EvaluationMotiveFk: {
							label: { text: 'Evaluation Motive', key: 'businesspartner.main.entityEvaluationMotiveFk' },
							visible: true,
							type: FieldType.Lookup,
							readonly: true,
							lookupOptions: (bpRelatedLookupProvider.getEvaluationMotiveLookupOverload() as ILookupFieldOverload<IEvaluationSchemaEntity>).lookupOptions,
						},
						FormFk: {
							label: {
								text: 'User Form',
								key: this.internalModuleName + '.entityFormFk'
							},
							readonly: false,
							type: FieldType.Lookup,
							lookupOptions:createLookup({
								dataServiceToken: BasicUserFormLookupService,
								serverSideFilter: {
									key: 'dd',
									execute() {
										return 'rubricId=33';
									}
								},
								showClearButton: true,
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated',
							}),
							visible: true,
						}
					},
				};
			},
			permissionUuid: '6003e88eb8734da693f6fbb8dbee621e',
		};

		return EntityInfo.create(entityInfo);
	}

	private getGroupEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationGroupEntity> = {
			dataService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationSchemaGroupService),
			grid: {
				title: {
					text: 'Groups',
					key: this.internalModuleName + '.title.groups',
				},
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaGroupGridBehaviorService),
			},
			form: {
				title: {
					text: 'Group Details',
					key: this.internalModuleName + '.title.groupDetail',
				},
				containerUuid: 'f89d0a40d28d475481656124683f757c',
			},
			dtoSchemeId: {
				moduleSubModule: this.moduleSubModule,
				typeName: 'EvaluationGroupDto',
			},
			layoutConfiguration: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['DescriptionInfo', 'CommentText', 'Sorting', 'Weighting', 'IsDefault', 'IsOptional'], //不可加入Id,否则detail显示为空
					},
				],
				overloads: {
					Id: {
						label: {
							text: 'Id',
						},
						visible: true,
					},
					DescriptionInfo: {
						label: {
							text: 'Description',
							key: this.cloudCommonModuleName + '.entityDescription',
						},
						visible: true,
					},
					CommentText: {
						label: {
							text: 'Comment Text',
							key: this.cloudCommonModuleName + '.entityCommentText',
						},
						visible: true,
					},
					Sorting: {
						label: {
							text: 'Sorting',
							key: this.cloudCommonModuleName + '.entitySorting',
						},
						visible: true,
					},
					Weighting: {
						label: {
							text: 'Weighting',
							key: this.internalModuleName + '.entityWeighting',
						},
					},
					IsDefault: {
						label: {
							text: 'Is Default',
							key: this.cloudCommonModuleName + '.entityIsDefault',
						},
						visible: true,
					},
					IsOptional: {
						label: {
							text: 'Optional',
							key: this.internalModuleName + '.entityIsOptional',
						},
						visible: true,
					},
					InsertedAt: {},
					InsertedBy: {},
					UpdatedAt: {},
					UpdatedBy: {},
					Version: {},
				},
			},
			permissionUuid: 'd6320711b95d403199ad36bcc9b2be12',
		};
		return EntityInfo.create(entityInfo);
	}

	private getGroupIconEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationGroupIconEntity> = {
			form: {
				title: {
					text: 'Group Icon Detail',
					key: this.internalModuleName + '.title.groupIconDetail',
				},
				containerUuid: '84b6893d227c42c2ba2275b15ef12c78',
			},
			grid: {
				title: {
					text: 'Group Icons',
					key: this.internalModuleName + '.title.groupIcons',
				},
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaGroupIconGridBehaviorService),
			},
			dataService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationschemaGroupIconService),
			dtoSchemeId: {
				moduleSubModule: this.moduleSubModule,
				typeName: 'EvaluationGroupIconDto',
			},
			layoutConfiguration: async (ctx) => {
				const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
				return {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['PointsFrom', 'PointsTo', 'Icon', 'CommentText'],
						},
					],
					overloads: {
						PointsFrom: {
							label: {
								text: 'From Points',
								key: this.internalModuleName + '.entityPointsFrom',
							},
							visible: true,
						},
						PointsTo: {
							label: {
								text: 'To Points',
								key: this.internalModuleName + '.entityPointsTo',
							},
							visible: true,
						},
						Icon: {
							label: {
								text: 'Icon',
								key: this.internalModuleName + '.entityIcon',
							},
							visible: true,
							type: FieldType.Lookup,
							lookupOptions: (bpRelatedLookupProvider.getEvaluationSchemaIconLookupOverload() as ILookupFieldOverload<IEvaluationGroupIconEntity>).lookupOptions,
							width: 80,
						},
						CommentText: {
							label: {
								text: 'Comment Text',
								key: this.internalModuleName + '.entityIconCommentText',
							},
							visible: true,
						},
					},
				};
			},
			permissionUuid: '25b798025ae0458eb34a5249101c428c',
		};

		return EntityInfo.create(entityInfo);
	}

	private getSchemaIconEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationSchemaIconEntity> = {
			containerBehavior: undefined,
			dataService: (ctx) => ctx.injector.get(BusinesspartnerEvaluationschemaIconService),
			dtoSchemeId: {
				typeName: 'EvaluationSchemaIconDto',
				moduleSubModule: this.moduleSubModule,
			},
			form: {
				title: {
					text: 'Schema Icon Details',
					key: this.internalModuleName + '.iconFormContainerTitle',
				},
				containerUuid: 'ff3d3400cc6949dcb9d55e09c6762062',
			},
			grid: {
				title: {
					text: 'Schema Icons',
					key: this.internalModuleName + '.iconGridContainerTitle',
				},
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaIconGridBehaviorService),
			},
			layoutConfiguration: async (ctx) => {
				const bpRelatedLookupProvider = await ctx.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
				return {
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['PointsFrom', 'PointsTo', 'Icon'],
						},
					],
					overloads: {
						PointsFrom: {
							label: {
								text: 'From Points',
								key: this.internalModuleName + '.entityPointsFrom',
							},
							visible: true,
						},
						PointsTo: {
							label: {
								text: 'To Points',
								key: this.internalModuleName + '.entityPointsTo',
							},
							visible: true,
						},
						Icon: {
							label: {
								text: 'Icon',
								key: this.internalModuleName + '.entityIcon',
							},
							visible: true,
							type: FieldType.Lookup,
							lookupOptions: (bpRelatedLookupProvider.getEvaluationSchemaIconLookupOverload() as ILookupFieldOverload<IEvaluationSchemaIconEntity>).lookupOptions,
							width: 80,
						},
					},
				};
			},
			permissionUuid: '85e27c1f72d041f38215ee8478ce6ea3',
		};

		return EntityInfo.create(entityInfo);
	}

	private getSubGroupEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationSubgroupEntity> = {
			dataService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationSchemaSubGroupService),
			grid: {
				title: {
					text: 'Sub Groups',
					key: this.internalModuleName + '.title.subgroups',
				},
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaSubGroupGridBehaviorService),
			},
			form: {
				title: {
					text: 'Sub Group Details',
					key: this.internalModuleName + '.title.subgroupDetail',
				},
				containerUuid: '8d56ffa82e6144379648cf32d1a6d856',
			},
			dtoSchemeId: {
				moduleSubModule: this.moduleSubModule,
				typeName: 'EvaluationSubgroupDto',
			},
			layoutConfiguration: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['DescriptionInfo', 'CommentText', 'PointsPossible', 'PointsMinimum', 'Sorting', 'Weighting', 'IsDefault', 'IsOptional', 'IsEditable', 'IsMultiSelect', 'Formula', 'FormFieldFk'],
					},
				],
				overloads: {
					Id: {
						label: {
							text: 'Id',
						},
						visible: true,
					},
					DescriptionInfo: {
						label: {
							text: 'Description',
							key: this.cloudCommonModuleName + '.entityDescription',
						},
						visible: true,
					},
					CommentText: {
						label: {
							text: 'Comment Text',
							key: this.internalModuleName + '.entityCommentText',
						},
						visible: true,
					},
					Sorting: {
						label: {
							text: 'Sorting',
							key: this.cloudCommonModuleName + '.entitySorting',
						},
						visible: true,
					},
					Weighting: {
						label: {
							text: 'Weighting',
							key: this.internalModuleName + '.entityWeighting',
						},
					},
					PointsPossible: {
						label: {
							text: 'Possible Points',
							key: this.internalModuleName + '.entityPointsPossible',
						},
					},
					PointsMinimum: {
						label: {
							text: 'Possible Minimum',
							key: this.internalModuleName + '.PointsMinimum',
						},
					},
					IsEditable: {
						label: {
							text: 'Editable',
							key: this.internalModuleName + '.entityIsEditable',
						},
					},
					IsMultiSelect: {
						label: {
							text: 'Multi Select',
							key: this.internalModuleName + '.entityIsMultiSelect',
						},
					},
					Formula: {
						label: {
							text: 'Formula',
							key: this.cloudCommonModuleName + '.formula',
						},
					},
					IsDefault: {
						label: {
							text: 'Is Default',
							key: this.cloudCommonModuleName + '.entityIsDefault',
						},
						visible: true,
					},
					IsOptional: {
						label: {
							text: 'Optional',
							key: this.internalModuleName + '.entityIsOptional',
						},
						visible: true,
					},
					GroupOrder: {
						label: {
							text: 'GroupOrder',
							key: this.internalModuleName + '.groupOrder',
						},
						visible: true,
					},
					FormFieldFk: {
						...(BasicsSharedLookupOverloadProvider.provideUserFormFieldLookupOverload(true, {
							execute(item, context): boolean {
								const parentService = context.injector.get(BusinesspartnerEvaluationschemaHeaderService);
								const schema = parentService.getSelectedEntity();
								return item.FormFk === schema?.FormFk && parentService.formFieldIds.indexOf(item.Id) < 0;
							}
						}) as ILookupFieldOverload<IEvaluationSubgroupEntity>),
						label: {
							text: 'Form Field',
							key: this.internalModuleName + '.entityFormField'
						},
						width: 150,
						readonly: false,
						visible: true,
					},
					InsertedAt: {},
					InsertedBy: {},
					UpdatedAt: {},
					UpdatedBy: {},
					Version: {},
				},
			},
			permissionUuid: 'd252a6f857a84387a1e20abbc7db588b',
			validationService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationSchemaSubGroupValidationService)
		};
		return EntityInfo.create(entityInfo);
	}

	private getItemEntityInfo(): EntityInfo {
		const entityInfo: IEntityInfo<IEvaluationItemEntity> = {
			grid: {
				title: {
					text: 'Items',
					key: this.internalModuleName + '.title.items',
				},
				behavior: (ctx) => ctx.injector.get(EvaluationSchemaItemGridBehaviorService),
			},
			form: {
				title: {
					text: 'Item Details',
					key: this.internalModuleName + '.title.itemDetail',
				},
				containerUuid: '55c26aa6a9834f57b3089439ca49a6a6',
			},
			dataService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationSchemaItemService),
			dtoSchemeId: {
				moduleSubModule: this.moduleSubModule,
				typeName: 'EvaluationItemDto',
			},
			layoutConfiguration: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['DescriptionInfo', 'Sorting', 'Points', 'RemarkInfo', 'IsDefault', 'FormFieldFk']
					}
				],
				overloads: {
					DescriptionInfo: {
						label: {
							text: 'Description',
							key: this.cloudCommonModuleName + '.entityDescription'
						},
						visible: true
					},
					Sorting: {
						label: {
							text: 'Sorting',
							key: this.cloudCommonModuleName + '.entitySorting'
						},
						visible: true
					},
					IsDefault: {
						label: {
							text: 'Is Default',
							key: this.cloudCommonModuleName + '.entityIsDefault'
						},
						visible: true
					},
					FormFieldFk: {
						...(BasicsSharedLookupOverloadProvider.provideUserFormFieldLookupOverload(true, {
							execute(item, context): boolean {
								const parentService = context.injector.get(BusinesspartnerEvaluationschemaHeaderService);
								const schema = parentService.getSelectedEntity();
								return item.FormFk === schema?.FormFk && parentService.formFieldIds.indexOf(item.Id) < 0;
							}
						}) as ILookupFieldOverload<IEvaluationItemEntity>),
						label: {
							text: 'Form Field',
							key: this.internalModuleName + '.entityFormField'
						},
						width: 150,
						readonly: false,
						visible: true
					},
					RemarkInfo: {
						label: {
							text: 'Remark',
							key: this.internalModuleName + '.entityRemark'
						},
						maxLength: 2000,
						visible: true
					},
					Points: {
						label: {
							text: 'Points',
							key: this.internalModuleName + '.entityPoints'
						}
					}
				}
			},
			permissionUuid: 'c57fbc4eb15844d0a29b6361bc131941',
			validationService: (ctx) => ctx.injector.get(BusinessPartnerEvaluationSchemaItemValidationService)
		};

		return EntityInfo.create(entityInfo);
	}

	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat([this.cloudCommonModuleName, 'businesspartner.main']);
	}
}
