import { inject, Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { BusinessPartnerEvaluationSchemaIconLookupService, IEvaluationGroupDataEntity } from '@libs/businesspartner/interfaces';
import { EvaluationCommonService } from '../evaluation-common.service';
import { MODULE_INFO } from '../../model/entity-info/module-info.model';

@Injectable({
	providedIn: 'root',
})
export class EvaluationGroupDataLayoutService {
	private readonly evaluationCommonService: EvaluationCommonService = inject(EvaluationCommonService);

	public constructor() {}

	public get columns() {
		return [
			{
				id: 'isoptional',
				model: 'IsOptional',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityIsOptional',
					text: 'IsOptional',
				},
				type: FieldType.Boolean,
				readonly: true,
				visible: true,
			},
			{
				id: 'groupdescription',
				model: 'GroupDescription',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityEvaluationGroupFk',
					text: 'Group / Sub Group',
				},
				type: FieldType.Description,
				readonly: true,
			},
			{
				id: 'points',
				model: 'Points',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityPoints',
					text: 'Result',
				},
				type: FieldType.Percent,
				formatterOptions: {
					decimalPlaces: 2,
				},
				readonly: false,
			},
			{
				id: 'pointspossible',
				model: 'PointsPossible',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.evaluationSchemaModuleName + '.entityPointsPossible'),
				},
				type: FieldType.Integer,
				readonly: true,
			},
			{
				id: 'pointsminimum',
				model: 'PointsMinimum',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.evaluationSchemaModuleName + '.PointsMinimum'),
				},
				type: FieldType.Integer,
				readonly: true,
			},
			{
				id: 'weighting',
				model: 'Weighting',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityWeighting',
					text: 'Weighting',
				},
				type: FieldType.Percent,
				formatterOptions: {
					decimalPlaces: 1,
				},
				readonly: true,
			},
			{
				id: 'evaluation',
				model: 'Evaluation',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityEvaluation',
					text: 'Evaluation',
				},
				type: FieldType.Decimal,
				formatterOptions: {
					decimalPlaces: 2,
				},
				readonly: true,
			},
			{
				id: 'weightinggroup',
				model: 'WeightingGroup',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.entityEvaluationWeightingGroup',
					text: 'Weighting.Group',
				},
				type: FieldType.Percent,
				formatterOptions: {
					decimalPlaces: 1,
				},
				readonly: true,
			},
			{
				id: 'total',
				model: 'Total',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityTotal',
					text: 'Total',
				},
				type: FieldType.Decimal,
				formatterOptions: {
					decimalPlaces: 2,
				},
				readonly: true,
			},
			{
				id: 'icon',
				model: 'Icon',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityIcon',
					text: 'Icon',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerEvaluationSchemaIconLookupService,
				}),
				readonly: true,
			},
			{
				id: 'isticked',
				model: 'IsTicked',
				label: {
					key: MODULE_INFO.businesspartnerMainModuleName + '.isChecked',
					text: 'Checked',
				},
				type: FieldType.Boolean,
				visible: false,
			},
			{
				id: 'remark',
				model: 'Remark',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityRemark',
					text: 'Remarks',
				},
				type: FieldType.Remark,
			},
			{
				id: 'formula',
				model: 'Formula',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.formula',
					text: 'Formula',
				},
				type: FieldType.Comment,
				readonly: true,
			},
			{
				id: 'grouporder',
				model: 'GroupOrder',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.evaluationSchemaModuleName + '.groupOrder'),
				},
				type: FieldType.Text,
				readonly: true,
			},
			{
				id: 'commenttext',
				model: 'CommentText',
				label: {
					key: MODULE_INFO.cloudCommonModuleName + '.entityCommentText',
					text: 'Comment Text',
				},
				type: FieldType.Comment,
				readonly: true,
			},
			{
				id: 'iconcommenttext',
				model: 'IconCommentText',
				label: {
					text: this.evaluationCommonService.getTranslateText(MODULE_INFO.evaluationSchemaModuleName + '.iconCommentText'),
				},
				type: FieldType.Comment,
				readonly: true,
			},
		] as ColumnDef<IEvaluationGroupDataEntity>[];
	}
}
