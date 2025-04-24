	/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
	import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
	import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
   import { IActionEntity } from '@libs/project/interfaces';
   import { EntityInfo } from '@libs/ui/business-base';
	import { ProjectMainActionDataService } from '../../services/project-main-action-data.service';
	import { ProjectMainActionValidationService } from '../../services/project-main-action-validation.service';

	export const PROJECT_MAIN_ACTION_ENTITY_INFO: EntityInfo = EntityInfo.create<IActionEntity>({
		grid: {
			title: {key: 'project.main' + '.actionListTitle'},
		},
		form: {
			title: { key: 'project.main' + '.actionDetailsTitle' },
			containerUuid: 'a9c6b70e70be4043b540e2aa69a4b5c2',
		},
		dataService: ctx => ctx.injector.get(ProjectMainActionDataService),
		validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectMainActionValidationService),
		dtoSchemeId: {moduleSubModule: 'Project.Main', typeName: 'ActionDto'},
		permissionUuid: '67d04e0fce4442519adf8fb786749bbf',
		layoutConfiguration: {
			groups: [
				{gid: 'baseGroup', attributes: ['ActionTypeFk','Code','Description','Reference','Comment','Remark','ValidFrom','ValidTo','IsActive','IsDiaryRelevant','UserDefinedText01','UserDefinedText02','UserDefinedText03',
						'UserDefinedText04','UserDefinedText05','UserDefinedNumber01','UserDefinedNumber02','UserDefinedNumber03','UserDefinedNumber04','UserDefinedNumber05','EmployeeGroupFk'] },
			],
			overloads: {
				EmployeeGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeGroupLookupOverload(true),
				ActionTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideProjectActionTypeLookupOverload(true),
				/*'ControllingUnitFk','LogisticJobFk','ActivityFk','ActionTypeFk','ProjectChangeFk',*/
				/*'GroupFk','ProfessionalCategoryFk'*/
			},
			labels: {
				...prefixAllTranslationKeys('project.main.', {
					Reference: { key: 'entityReference' },
					Comment: { key: 'entityCommentText' },
					Remark: { key: 'entityRemark' },
					IsDiaryRelevant: { key: 'entityIsDiaryRelevant' },
					/*ControllingUnitFk: { key: 'entityControllingUnit' },
					ActivityFk: { key: 'entityActivity' },*/
					ActionTypeFk: { key: 'entityActionType' },
					UserDefinedText01: {key: 'entityUserDefinedText01'},
					UserDefinedText02: {key: 'entityUserDefinedText02'},
					UserDefinedText03: {key: 'entityUserDefinedText03'},
					UserDefinedText04: {key: 'entityUserDefinedText04'},
					UserDefinedText05: {key: 'entityUserDefinedText05'},
					UserDefinedDate01: {key: 'entityUserDefinedDate01'},
					UserDefinedDate02: {key: 'entityUserDefinedDate02'},
					UserDefinedDate03: {key: 'entityUserDefinedDate03'},
					UserDefinedDate04: {key: 'entityUserDefinedDate04'},
					UserDefinedDate05: {key: 'entityUserDefinedDate05'},
					UserDefinedNumber01: {key: 'entityUserDefinedNumber01'},
					UserDefinedNumber02: {key: 'entityUserDefinedNumber02'},
					UserDefinedNumber03: {key: 'entityUserDefinedNumber03'},
					UserDefinedNumber04: {key: 'entityUserDefinedNumber04'},
					UserDefinedNumber05: {key: 'entityUserDefinedNumber05'},
				}),
				...prefixAllTranslationKeys('logistic.job.', {
					/*LogisticJobFk: { key: 'entityJob' }, TODO*/
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ValidFrom: { key: 'entityValidFrom' },
					ValidTo: { key: 'entityValidTo' },
					IsActive: { key: 'entityIsActive' },
					/*ProjectChangeFk: { key: 'entityProjectChange' }, TODO*/
				}),

			},
		}

	});