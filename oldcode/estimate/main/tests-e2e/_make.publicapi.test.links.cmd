@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\..\..\..\..\BinPool
set myself=%~dp0

echo >mklink.log

call :createSymLink estimate


echo symbolic link done ...

echo.  >>mklink.log

if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\test\publicapi\%modul%"
:: set target="%myself%\%submodul%\%submodul%.Client.Web (Angular)\%modul%.%submodul%"
::echo mklink /j %link% %target%
@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link%  >>mklink.log
	if exist %link% (
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link% >>mklink.log
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\test\publicapi\%modul%"
set target="%myself%publicapi\%modul%"

call :removeSymLink %1

if not exist "%binpool%\test" (
	mkdir "%binpool%\test"  >>mklink.log
)

if not exist "%binpool%test\publicapi" (
	mkdir "%binpool%\test\publicapi"  >>mklink.log
)

::echo mklink /j %link% %target%
mklink /j %link% %target%  >>mklink.log
echo.  >>mklink.log


goto :eof