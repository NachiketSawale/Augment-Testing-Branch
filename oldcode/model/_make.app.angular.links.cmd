@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Release" set config=Release.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink model administration
call :createSymLink model annotation
call :createSymLink model evaluation
call :createSymLink model project
call :createSymLink model main
call :createSymLink model viewer
call :createSymLink model simulation
call :createSymLink model changeset
call :createSymLink model change
call :createSymLink model map
call :createSymLink model wdeviewer
call :createIgeLink model ige
call :createSymLink model measurements
call :createSymLink model filtertrees
echo.  >>mklink.log



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
set link="%binpool%\%config%\%modul%.%submodul%"
set target="%myself%\%submodul%"

call :removeSymLink %1 %2

::echo mklink /j %link% %target%
mklink /j %link% %target%  >>mklink.log
echo.  >>mklink.log


goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeIgeLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%-%submodul%"
:: set target="%myself%\%submodul%"
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
:createIgeLink
@echo off
set modul=%1
set submodul=%2
set link="%binpool%\%config%\%modul%-%submodul%"
set target="%myself%\%submodul%\model-ige"

call :removeIgeLink %1 %2

::echo mklink /j %link% %target%
mklink /j %link% %target%  >>mklink.log
echo.  >>mklink.log


goto :eof
