/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IFormContainerLink } from '@libs/ui/business-base';
import { IJobEntity } from '../model/entities/job-entity.interface';
import { FieldType, FormRow, IGridConfiguration } from '@libs/ui/common';
import { IParameterList } from '../model/entities/parameter-list.interface';

@Injectable({
	providedIn: 'root',
})
export class ServicesSchedulerUIJobDetailBehavior implements IEntityContainerBehavior<IFormContainerLink<IJobEntity>, IJobEntity> {
	/**
	 * Parameter grid configuration.
	 */
	private gridConfiguration: IGridConfiguration<IParameterList> = {
		uuid: 'ec4d55d3ebd94dcf941e536de78aff3c',
		idProperty: 'Name',
		columns: [
			{
				id: 'Name',
				model: 'Name',
				label: {
					key: 'services.schedulerui.parameterList.name',
				},
				type: FieldType.Description,
				width: 100,
				sortable: true,
				visible: true,
			},
			{
				id: 'Value',
				model: 'Value',
				label: {
					key: 'services.schedulerui.parameterList.value',
				},
				type: FieldType.Description,
				width: 200,
				sortable: true,
				visible: true,
			},
			{
				id: 'Type',
				model: 'Type',
				label: {
					key: 'services.schedulerui.parameterList.type',
					text: 'Type',
				},
				type: FieldType.Description,
				width: 60,
				sortable: true,
				visible: true,
			},
			{
				id: 'Required',
				model: 'Required',
				label: {
					key: 'services.schedulerui.parameterList.required',
					text: 'Required',
				},
				type: FieldType.Boolean,
				width: 60,
				sortable: true,
				visible: true,
			},
			{
				id: 'Description',
				model: 'Description',
				label: {
					key: 'services.schedulerui.parameterList.description',
					text: 'Description',
				},
				type: FieldType.Description,
				width: 300,
				sortable: true,
				visible: true,
			},
		],
	};

	/**
	 * This method is invoked right when the container component
	 * is being created.
	 * @param {IFormContainerLink<IJobEntity>} containerLink
	 * A reference to the facilities of the container
	 */
	public onCreate(containerLink: IFormContainerLink<IJobEntity>): void {
		if (containerLink.entityList) {
			containerLink.entityList?.listChanged$.subscribe((item) => {
				item.map((item) => (item.ParameterList = JSON.parse(item.ParameterList as string)));
			});
		}
		if (containerLink.formConfig) {
			const parameter: FormRow<IJobEntity> = {
				groupId: 'basicData',
				id: 'Parameter',
				required: true,
				readonly: true,
				model: 'ParameterList',
				label: {
					key: 'services.schedulerui.columns.parameter',
					text: 'Parameter',
				},
				visible: true,
				type: FieldType.Grid,
				configuration: this.gridConfiguration as IGridConfiguration<object>,
				height: 200,
			};
			containerLink.formConfig.rows.push(parameter);
		}
	}
}
