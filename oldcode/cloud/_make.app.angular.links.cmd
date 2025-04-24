@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink cloud translation
call :createSymLink cloud desktop
call :createSymLink cloud common
call :createSymLink cloud uitesting
call :createSymLink2 cloud help webapihelp
call :createSymLinkWithoutAngularFolder PdfOverlay

echo symbolic link done ...
if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%.%submodul%"
:: set target="%myself%\%submodul%"
::echo mklink /j %link% %target%
@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link%
	if exist %link% (
		echo It's not a link, we delete whole folder 
		rmdir /s /q %link% >>mklink.log
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink2
@echo off
set myown=%1
set link="%binpool%\%config%\%myown%"
@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link% >>mklink.log
	if exist %link% (
		echo It's not a link, we delete whole folder 
		rmdir /s /q %link%  >>mklink.log
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\Debug.Angular\%modul%.%submodul%"
set target="%myself%\%submodul%"

call :removeSymLink %1 %2

::echo mklink /j %link% %target%
mklink /j %link% %target% >>mklink.log
echo. >>mklink.log

goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink2
@echo off
set modul=%1
set submodul=%2
set myown=%3
set link="%binpool%\Debug.Angular\%myown%"
set target="%myself%\%submodul%"

call :removeSymLink2 %3

::echo mklink /j %link% %target%
mklink /j %link% %target%  >>mklink.log
echo. >>mklink.log

goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLinkWithoutAngularFolder
@echo off
set modul=%1
set link="%binpool%\Debug.Angular\%modul%"
set target="%myself%\%modul%"

call :removeSymLink %1

::echo mklink /j %link% %target%
mklink /j %link% %target% >>mklink.log
echo. >>mklink.log

goto :eof

