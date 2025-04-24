1. Install NodeJs
	Path: S:\team\iTWO_Cloud\99 Installation\node-v6.9.1-x64.msi
	
2. Copy mocha files
   Source path: S:\team\iTWO_Cloud\MemberFolder\Mike\UnitTest\mocha
   Copy all the folders and files under the source path.
   Target path: something like this: C:\Users\chm\AppData\Roaming\npm (Please pay attention that AppData is hidden.)
  
3. Copy the file _make.publicapi.links.cmd. The file copies the test files of the modules to the binpool.
	Source path: S:\team\iTWO_Cloud\MemberFolder\Cici\PublicApi\_make.publicapi.links.cmd
	Target path: under your trunk folder
	Modify this file according to your case. Please take examples in the file.
	
4. Take Material as an example.
	Please update the codes in Basics.Material and Basics.Common from svn first.
	A. Create a new folder 'test' as Basics.Material. Please see the path: http://rib-s-svn01:81/svn/repos/RIBvisual/trunk/Basics/Development/Material/Material.Client.Web (Angular)/basics.material/test
	B. Change the folder name '.../test/publicapi/basics' to what your module name like: '.../test/publicapi/boq'
	C. Remove the file 'login.spec.js' from your own module. Only one this file in Basics.Material is necessary.
		like remove file '...\boq.wic\test\publicapi\boq\test\login.spec.js'.
	C. Modified the cmd file '_make.publicapi.test.links.cmd'.
		Change 'call :createSymLink basics' To what your module named like: 'call : createSymLink boq' (Please pay attention here, 'boq' is the module name)
	D. Execute the cmd file '_make.publicapi.test.links.cmd'.
	
5. Write your test case
	Please take file 'login.spec.js' for example and create new files to handle your different cases.
	You can find some common codes in the basics.common like globals and util.
	
6. Run your test case
	Launch the WebStorm. Take folder '...\BinPool\test' as your project.
	Edit Configuration.
		A. Add New Configuration (choose Mocha)
		B. Input Name
		C. Input Working directory: D:\SourceCode\BinPool\test\publicapi
		D. Input Extra Mocha options: --opts common/mocha.opts
		E. Tick Include subdirectories.
		F. Ok
		
	Modify file ...\publicapi\common\globals.js
	Change the property: global.globalConfig.services.path. Change it to your own services path.
	
Then you can run your test.