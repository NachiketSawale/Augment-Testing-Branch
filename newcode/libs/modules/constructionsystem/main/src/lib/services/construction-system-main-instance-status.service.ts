/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { CosInstanceStatus } from '../model/enums/cos-instance-status.enum';
import { ICosInstanceStatusEntity } from './lookup/construction-system-main-status-lookup.service';

/**
 * use to handle Construction System Instance Status
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceStatusService {
	public createStatusCssIconObjects(): ICosInstanceStatusEntity[] {
		return [
			{
				Id: CosInstanceStatus.New,
				DisplayName: {
					key: 'constructionsystem.main.status.new',
					text: 'New',
				},
				IconCSS: 'control-icons ico-instance-new',
			},
			{
				Id: CosInstanceStatus.Evaluating,
				DisplayName: {
					key: 'constructionsystem.main.status.evaluating',
					text: 'evaluating',
				},
				IconCSS: 'control-icons ico-instance-evaluating',
			},
			{
				Id: CosInstanceStatus.Evaluated,
				DisplayName: {
					key: 'constructionsystem.main.status.evaluated',
					text: 'Evaluated',
				},
				IconCSS: 'control-icons ico-instance-evaluated',
			},
			{
				Id: CosInstanceStatus.EvaluateFailed,
				DisplayName: {
					key: 'constructionsystem.main.status.evaluateFailed',
					text: 'Evaluate Failed',
				},
				IconCSS: 'control-icons ico-instance-evaluate-failed',
			},
			{
				Id: CosInstanceStatus.Applying,
				DisplayName: {
					key: 'constructionsystem.main.status.applying',
					text: 'Applying',
				},
				IconCSS: 'control-icons ico-applying',
			},
			{
				Id: CosInstanceStatus.Applied,
				DisplayName: {
					key: 'constructionsystem.main.status.applied',
					text: 'Applied',
				},
				IconCSS: 'control-icons ico-applied',
			},
			{
				Id: CosInstanceStatus.ApplyFailed,
				DisplayName: {
					key: 'constructionsystem.main.status.applyFailed',
					text: 'Apply Failed',
				},
				IconCSS: 'control-icons ico-apply-failed',
			},
			{
				Id: CosInstanceStatus.Calculating,
				DisplayName: {
					key: 'constructionsystem.main.status.calculating',
					text: 'Calculating',
				},
				IconCSS: 'control-icons ico-calculating',
			},
			{
				Id: CosInstanceStatus.Calculated,
				DisplayName: {
					key: 'constructionsystem.main.status.calculated',
					text: 'Calculated',
				},
				IconCSS: 'control-icons ico-calculated',
			},
			{
				Id: CosInstanceStatus.CalculateFailed,
				DisplayName: {
					key: 'constructionsystem.main.status.calculateFailed',
					text: 'Calculate Failed',
				},
				IconCSS: 'control-icons ico-calculate-failed',
			},
			{
				Id: CosInstanceStatus.ObjectAssigning,
				DisplayName: {
					key: 'constructionsystem.main.status.assigning',
					text: 'Assigning',
				},
				IconCSS: 'control-icons ico-calculating',
			},
			{
				Id: CosInstanceStatus.ObjectAssigned,
				DisplayName: {
					key: 'constructionsystem.main.status.assigned',
					text: 'Assigned',
				},
				IconCSS: 'control-icons ico-calculated',
			},
			{
				Id: CosInstanceStatus.ObjectAssignFailed,
				DisplayName: {
					key: 'constructionsystem.main.status.assignFailed',
					text: 'Assign Failed',
				},
				IconCSS: 'control-icons ico-calculate-failed',
			},
			{
				Id: CosInstanceStatus.ObjectUnassigned,
				DisplayName: {
					key: 'constructionsystem.main.status.unassigned',
					text: 'Unassigned',
				},
				IconCSS: 'control-icons ico-calculate-unassigned',
			},
			{
				Id: CosInstanceStatus.Modified,
				DisplayName: {
					key: 'constructionsystem.main.status.modified',
					text: 'Modified',
				},
				IconCSS: 'control-icons ico-crefo3',
			},
			{
				Id: CosInstanceStatus.EvaluateCanceled,
				DisplayName: {
					key: 'constructionsystem.main.status.evaluateCanceled',
					text: 'Evaluate Canceled',
				},
				IconCSS: 'control-icons ico-instance-evaluate-failed',
			},
			{
				Id: CosInstanceStatus.CalculateCanceled,
				DisplayName: {
					key: 'constructionsystem.main.status.calculateCanceled',
					text: 'Calculate Canceled',
				},
				IconCSS: 'control-icons ico-calculate-failed',
			},
			{
				Id: CosInstanceStatus.ApplyCanceled,
				DisplayName: {
					key: 'constructionsystem.main.status.applyCanceled',
					text: 'Apply Canceled',
				},
				IconCSS: 'control-icons ico-apply-failed',
			},
			{
				Id: CosInstanceStatus.Waiting,
				DisplayName: {
					key: 'constructionsystem.main.status.waiting',
					text: 'Waiting',
				},
				IconCSS: 'control-icons ico-schedule',
			},
			{
				Id: CosInstanceStatus.Aborted,
				DisplayName: {
					key: 'constructionsystem.main.status.aborted',
					text: 'Aborted',
				},
				IconCSS: 'control-icons ico-stop',
			},
		];
	}
}
