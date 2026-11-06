"""Create a narrated walkthrough from captured, verified prototype states."""
from pathlib import Path
import json,sys,subprocess,wave
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'.build/python'))
import imageio_ffmpeg
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
scenes=json.loads((ROOT/'scripts/demo-scenes.json').read_text(encoding='utf-8'))
build=ROOT/'.build/video';out=ROOT/'submission';out.mkdir(exist_ok=True)
lengths=[]
for i,scene in enumerate(scenes):
 with wave.open(str(build/f'voice-{i:02}.wav')) as w: duration=w.getnframes()/w.getframerate()+1.2
 lengths.append(duration)
assert sum(lengths)<180,f'Video would last {sum(lengths):.1f}s; shorten narration first.'
for i,scene in enumerate(scenes):
 caption=build/f'caption-{i:02}.txt';caption.write_text(scene['title'],encoding='utf-8')
 # drawtext uses a relative filename so Windows drive colons never enter filter syntax.
 # The desktop capture includes blank space outside the 1706x936 browser surface.
 vf=f"crop=1706:936:0:0,scale=1600:780:force_original_aspect_ratio=decrease,pad=1600:900:(ow-iw)/2:0:color=white,drawbox=x=0:y=780:w=iw:h=120:color=0x20201f:t=fill,drawbox=x=0:y=780:w=iw:h=5:color=0xe40000:t=fill,drawtext=fontfile='C\\:/Windows/Fonts/arial.ttf':textfile=caption-{i:02}.txt:fontcolor=white:fontsize=27:x=45:y=817"
 subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-y','-loop','1','-i',str(ROOT/'docs/images/demo'/scene['image']),'-i',str(build/f'voice-{i:02}.wav'),'-vf',vf,'-af','apad','-t',str(lengths[i]),'-r','12','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k',str(build/f'scene-{i:02}.mp4')],cwd=build,check=True)
concat=build/'concat.txt';concat.write_text(''.join(f"file 'scene-{i:02}.mp4'\n" for i in range(len(scenes))),encoding='utf-8')
final=out/'PingMeMaybe_VITVellore_Demo.mp4'
subprocess.run([FFMPEG,'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(concat),'-c','copy','-movflags','+faststart',str(final)],cwd=build,check=True)
(out/'demo-metadata.json').write_text(json.dumps({'durationSeconds':round(sum(lengths),2),'frames':'Verified screenshots of the running prototype, assembled as a narrated walkthrough. Not a continuous screen recording.','narration':'Windows SAPI synthetic voice','liveAdvisorInRecording':True},indent=2),encoding='utf-8')
print(f'Created {final.name}: {sum(lengths):.1f} seconds.')
