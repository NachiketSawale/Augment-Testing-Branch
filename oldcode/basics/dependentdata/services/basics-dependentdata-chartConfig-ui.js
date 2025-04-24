(function () {
	'use strict';
	var moduleName = 'basics.dependentdata';
	angular.module(moduleName).factory('basicsDependentDataChartConfigDetailLayout', ['platformTranslateService',function (platformTranslateService) {
		var serviceLayout={};
		var defaultConfig={title:{show:true,position:'left',color:3355443},legend:{show:true,position:'left',color:3355443},group:{enable:false},scale:{x:{type:'linear'},y:{type:'linear'}}};
		var formLayout = {
			title: 'Chart Configure',
			dataItem:defaultConfig,
			formConfiguration: {
				fid: 'basics.dependentData.config.form',
				showGrouping: true,
				change: 'change',
				groups: [{gid: 'title',
					isOpen: true,
					isVisible: true,
					sortOrder: 1,
					header$tr$:'basics.dependentdata.entityTitleConfig'
				},
				{gid: 'legend',
					isOpen: true,
					isVisible: true,
					sortOrder: 2,
					header$tr$:'basics.dependentdata.entityLegendConfig'
				},{
					gid: 'group',
					isOpen: true,
					isVisible: true,
					sortOrder: 2,
					header$tr$:'basics.dependentdata.entityGroupConfig'
				},{
					gid: 'xAxes',
					isOpen: true,
					isVisible: true,
					sortOrder: 2,
					header$tr$:'basics.dependentdata.entityxAxesConfig'
				},{
					gid: 'yAxes',
					isOpen: true,
					isVisible: true,
					sortOrder: 2,
					header$tr$:'basics.dependentdata.entityyAxesConfig'
				}
				],
				rows: [{
					gid: 'title',
					label: 'Show',
					type: 'boolean',
					visible: true,
					sortOrder: 1,
					model: 'title.show'
				},
				{
					gid: 'title',
					label: 'Position',
					type: 'select',
					visible: true,
					sortOrder: 2,
					model: 'title.position',
					options: {
						items: [{id: 'top', description: 'Top'}, {id: 'left', description: 'Left'}, {id: 'right', description: 'Right'}, {id: 'bottom', description: 'Bottom'}],
						valueMember: 'id',
						displayMember: 'description'
					}
				},
				{
					gid: 'title',
					label: 'Color',
					type: 'color',
					visible: true,
					sortOrder: 3,
					model:'title.color'
				},
				{
					gid: 'legend',
					label: 'Show',
					type: 'boolean',
					visible: true,
					sortOrder: 1,
					model: 'legend.show'
				},
				{
					gid: 'legend',
					label: 'Position',
					type: 'select',
					visible: true,
					sortOrder: 2,
					model: 'legend.position',
					options: {
						items: [{id: 'top', description: 'Top'}, {id: 'left', description: 'Left'}, {id: 'right', description: 'Right'}, {id: 'bottom', description: 'Bottom'}],
						valueMember: 'id',
						displayMember: 'description'
					}
				},
				{
					gid: 'legend',
					label: 'Color',
					type: 'color',
					visible: true,
					sortOrder: 3,
					model:'legend.color'
				},
				{
					gid: 'group',
					label: 'Selectable',
					type: 'boolean',
					visible: true,
					sortOrder: 1,
					model: 'group.enable'
				},
				{
					gid: 'xAxes',
					sortOrder: 2,
					visible:true,
					model: 'scale.x',
					type: 'directive',
					directive: 'basics-dependent-data-scale',
					options:{
						displayMember: 'Description',
						valueMember: 'Id',
						type:'linear',
						items:[{Id: 'linear', Description: 'Numeric Linear'}, {Id: 'time', Description: 'Time'},{Id:'category',Description:'Category'}]
					}
				},
				{
					gid: 'yAxes',
					visible: true,
					sortOrder: 2,
					model: 'scale.y',
					type: 'directive',
					directive: 'basics-dependent-data-scale',
					options: {
						valueMember: 'Id',
						displayMember: 'Description',
						type:'linear',
						items:[{Id: 'linear', Description: 'Numeric Linear'}]
					}
				}

				]
			}
		};
		platformTranslateService.translateFormConfig(formLayout.formConfiguration);

		serviceLayout.formLayout=formLayout;
		serviceLayout.setScaleType=function(ChartTypeFk){
			if(3===ChartTypeFk) {
				formLayout.formConfiguration.rows[7].options.items=[{Id:'category',Description:'Category'}];
				formLayout.formConfiguration.rows[7].options.type='category';
			}
			else{
				formLayout.formConfiguration.rows[7].options.items=[{Id: 'linear', Description: 'Numeric Linear'}, {Id: 'time', Description: 'Time'},{Id:'category',Description:'Category'}];
				formLayout.formConfiguration.rows[7].options.type='linear';
			}
		};
		serviceLayout.setConfig=function(Config){
			formLayout.dataItem=Config?JSON.parse(Config):defaultConfig;
		};

		return serviceLayout;
	}]);

})();

