import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NgModule } from '@angular/core';
import { GridApiService } from '../../services/grid-api.service';
import { PlatformConfigurationService, PlatformDragDropService, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { IGridConfiguration } from '../../model/grid-configuration.interface';
import { ColumnDef } from '../../model/column-def.type';
import { FieldType } from '../../../model/fields';
import { GridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Define specific types for the grid items
interface GridItem {
  Id: number;
  Code: string;
  isPresent: boolean;
  name: string;
  age: number;
  location: string;
  designation: string;
}

// Mock Data
const mockItems: GridItem[] = [
  { Id: 1, Code: 'A1', isPresent: true, name: 'John', age: 30, location: 'NY', designation: 'Engineer' },
  { Id: 2, Code: 'A2', isPresent: false, name: 'Jane', age: 25, location: 'LA', designation: 'Designer' },
  { Id: 3, Code: 'A3', isPresent: true, name: 'Doe', age: 35, location: 'SF', designation: 'Manager' },
];

const mockColumns: ColumnDef<GridItem>[] = [
  {
    type: FieldType.Integer,
    id: 'Id',
    required: true,
    model: 'Id',
    label: {
      text: 'Id',
      key: 'Id',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Code,
    id: 'Code',
    required: true,
    model: 'Code',
    maxLength: 16,
    label: {
      text: 'Code',
      key: 'Code',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Translation,
    id: 'DescriptionInfo',
    required: false,
    model: 'isPresent',
    label: {
      text: 'Description',
      key: 'Description',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Code,
    id: 'name',
    required: false,
    model: 'name',
    label: {
      text: 'Name',
      key: 'Name',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Integer,
    id: 'age',
    required: false,
    model: 'age',
    label: {
      text: 'Age',
      key: 'Age',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Code,
    id: 'location',
    required: false,
    model: 'location',
    label: {
      text: 'Location',
      key: 'Location',
    },
    visible: true,
    sortable: true,
  },
  {
    type: FieldType.Code,
    id: 'designation',
    required: false,
    model: 'designation',
    label: {
      text: 'Designation',
      key: 'Designation',
    },
    visible: true,
    sortable: true,
  },
];

const mockGridConfiguration: IGridConfiguration<GridItem> = {
  uuid: '00000000000000000000000000000000',
  columns: mockColumns,
  items: mockItems,
};

@Component({
  selector: 'ui-common-grid-storybook',
  template: `
    <ui-common-grid [configuration]="configuration"></ui-common-grid>
  `,
})
class StorybookGridComponent {
    public configuration = mockGridConfiguration;
  }

  @NgModule({
    declarations: [StorybookGridComponent],
    imports: [MatDialogModule, BrowserAnimationsModule, GridComponent],
    providers: [GridApiService, PlatformDragDropService],
  })
class StorybookGridModule {}

export default {
  title: 'GridComponent',
  component: StorybookGridComponent,
  decorators: [
    moduleMetadata({
      imports: [GridComponent,MatDialogModule,FormsModule,HttpClientModule],
      declarations: [TranslatePipe],
      providers: [GridApiService, PlatformDragDropService,PlatformTranslateService,
              PlatformConfigurationService,],
    }),
  ],
} as Meta;

const Template: Story<StorybookGridComponent> = (args: StorybookGridComponent) => ({
  props: args,
});

export const Default = Template.bind({});
Default.args = {};