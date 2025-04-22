/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';
import { UserInputEditorToolbarItems } from '../model/enum/user-input-editor-toolbar-items.enum';
import { IUserInputToolbarItems } from '../model/interfaces/user-input-toolbar-items.interface';


/**
 * userInputEditorItems: To store the user-input-action editor's toolbar items.
 */
export const userInputEditorItems: { [key in UserInputEditorToolbarItems]: IUserInputToolbarItems } = {
	[UserInputEditorToolbarItems.NumberFields]: {
		Caption: 'basics.workflow.actionEditor.userInputActionEditor.numberField',
		Icons: 'control-icons ico-number',
		Items: [
			{
				Description: 'Money',
				ItemType: FieldType.Money
			},
			{
				Description: 'Integer',
				ItemType: FieldType.Integer
			},
			{
				Description: 'Percent',
				ItemType: FieldType.Percent
			},
			{
				Description: 'Float(3 Digit)',
				ItemType: FieldType.Quantity
			},
			{
				Description: 'Float(5 Digit)',
				ItemType: FieldType.ExchangeRate
			},
			{
				Description: 'Float(6 Digit)',
				ItemType: FieldType.Factor
			},
			{
				Description: 'Code',
				ItemType: FieldType.Code
			},
			{
				Description: 'Date(UTC)',
				ItemType: FieldType.DateTimeUtc
			}
		]
	},
	[UserInputEditorToolbarItems.TextFields]: {
		Caption: 'basics.workflow.actionEditor.userInputActionEditor.textField',
		Icons: 'control-icons ico-text',
		Items: [
			{
				Description: 'Single Line Text',
				ItemType: FieldType.Description
			},
			{
				Description: 'Multi Line Text (2000)',
				ItemType: FieldType.Remark
			},
			{
				Description: 'Multi Line Text (255)',
				ItemType: FieldType.Comment
			},
			{
				Description: 'Email',
				ItemType: FieldType.Email
			},
			{
				Description: 'Comment box',
				ItemType: FieldType.Comment
			}
		]
	},
	[UserInputEditorToolbarItems.SelectFields]: {
		Caption: 'basics.workflow.actionEditor.userInputActionEditor.selectField',
		Icons: 'control-icons ico-ctrl-combo',
		Items: [
			{
				Description: 'Boolean',
				ItemType: FieldType.Boolean
			},
			{
				Description: 'Dropdown',
				ItemType: FieldType.Select
			}
		]
	},
	[UserInputEditorToolbarItems.DesignItems]: {
		Caption: 'basics.workflow.actionEditor.userInputActionEditor.designItems',
		Icons: 'control-icons ico-ctrl-divider',
		Items: [
			{
				Description: 'Dropdown',
				ItemType: FieldType.Select
			}
		]
	},
	[UserInputEditorToolbarItems.Links]: {
		Caption: 'basics.workflow.actionEditor.userInputActionEditor.links',
		Icons: 'control-icons ico-linkto',
		Items: [

			{
				Description: 'Label',
				ItemType: FieldType.Text
			}
		]
	}
};


