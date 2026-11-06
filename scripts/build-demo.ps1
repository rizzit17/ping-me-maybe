$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$scenes = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'demo-scenes.json') -Raw | ConvertFrom-Json
$audioDir = Join-Path $repoRoot '.build/video'
New-Item -ItemType Directory -Force -Path $audioDir | Out-Null
$voice = New-Object -ComObject SAPI.SpVoice
$voice.Rate = 1
$voice.Volume = 100
for ($i=0; $i -lt $scenes.Count; $i++) {
  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open((Join-Path $audioDir ('voice-{0:D2}.wav' -f $i)), 3, $false)
  $voice.AudioOutputStream = $stream
  $voice.Speak($scenes[$i].text) | Out-Null
  $stream.Close()
}
python (Join-Path $PSScriptRoot 'build-demo.py')
if ($LASTEXITCODE -ne 0) { throw 'Demo video export failed.' }
