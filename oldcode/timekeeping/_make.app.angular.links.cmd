@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\..\BinPool
set config=Debug.Angular
if /I "%1" equ "Debug" set config=Debug.Angular
echo %~dpn0 --^> We use Config=%config%
set myself=%~dp0

call :createSymLink timekeeping common
call :createSymLink timekeeping employee
call :createSymLink timekeeping layout
call :createSymLink timekeeping paymentgroup
call :createSymLink timekeeping settlement
call :createSymLink timekeeping period
call :createSymLink timekeeping recording
call :createSymLink timekeeping shiftmodel
call :createSymLink timekeeping timeallocation
call :createSymLink timekeeping timesymbols
call :createSymLink timekeeping worktimemodel
call :createSymLink timekeeping timecontrolling
call :createSymLink timekeeping certificate

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
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link%
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
mklink /j %link% %target%
echo.


goto :eof
