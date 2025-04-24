```App
1. install nodejs
2. get depend node_modules into your nodejs
	# copy S:\team\iTWO_Cloud\MemberFolder\nodejs into C:\Program Files\nodejs
3. test in cmd
	# gulp --version
	# protractor --version
	# karma --version
4. config your local path in config.js
	#systemRoot: 'D:\\RIBvisual\\BinPool\\Debug.Angular\\'
5. run test case
	# runGulp.bat
	# runProtractor.bat
```


```Doc
1. http://www.yearofmoo.com/2013/01/full-spectrum-testing-with-angularjs-and-karma.html
2. see protractor/docs/*.md
```


 js: [
    //cn team
    //'cloud.common',cn problems is fixed, next is german
    'cloud.lookup',
    'basics.lookupdata',
    'basics.costgroups',
    'basics.material',
    'basics.materialcatalog',
    'basics.assetmaster',
    'basics.characteristic',
    'basics.procurementstructure',
    'procurement.common',
    'procurement.contract',
    'procurement.invoice',
    'procurement.pes',
    'procurement.pricecomparison',
    'procurement.quote',
    'procurement.requisition',
    'procurement.rfq',
    'procurement.ticketsystem',
    'qto.formula',
    'qto.main',
    'businesspartner.main',
    'businesspartner.certificate',
    'businesspartner.evaluationschema',

    //'webapihelp',

//		//german team
//		'basics.costcodes',
//
//		'basics.clerk',
//		'basics.company',
//		'basics.config',
//		'basics.currency',
//		'basics.dependentdata',
//		'basics.unit',
//		'basics.userform',
//		'basics.workflow',
//		'boq.main',
//		'boq.project',
//		'cloud.clerk',
//		'cloud.company',
//		'cloud.configuration',
//		'cloud.desktop',
//		'cloud.uom',
//		'project.costcodes',
//		'project.location',
//		'project.main',
//		'scheduling.calendar',
//		'scheduling.lookup',
//		'scheduling.main',
//		'scheduling.schedule',
//		'scheduling.template',
//		'scheduling.templategroup'
  ]