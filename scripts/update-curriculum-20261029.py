"""Import reviewed HWPX curriculum without changing source Excel files."""
import json,re,pathlib,zipfile,hashlib
from lxml import etree as E
ROOT=pathlib.Path(__file__).resolve().parents[1];REVIEW=ROOT.parents[1]/'교육과정_검토';NS={'h':'http://www.hancom.co.kr/hwpml/2011/paragraph'}
path=ROOT/'curriculum-data.js';baseline=ROOT/'검토/교육과정-20261029/curriculum-before.js';s=(baseline if baseline.exists() else path).read_text();data=json.loads(s[s.index('{'):].rstrip().rstrip(';'))
def norm(v):return re.sub(r'\s+','',str(v)).replace('Ⅰ','I').replace('Ⅱ','II')
def num(v):
 m=re.search(r'(\d+)\s*$',str(v));return int(m.group(1)) if m else 0
def read(file):
 with zipfile.ZipFile(file) as z:rt=E.fromstring(z.read('Contents/section0.xml'))
 return rt.findall('.//h:tbl',NS)
def grid(t):
 g={};a={}
 for c in t.findall('./h:tr/h:tc',NS):
  ad=c.find('h:cellAddr',NS);sp=c.find('h:cellSpan',NS);r=int(ad.get('rowAddr'));co=int(ad.get('colAddr'));v=' '.join(''.join(x.text or '' for x in p.findall('.//h:t',NS)) for p in c.findall('./h:subList/h:p',NS)).strip();a[r,co]=v
  for rr in range(r,r+int(sp.get('rowSpan'))):
   for cc in range(co,co+int(sp.get('colSpan'))):g[rr,cc]=v
 return g,a
def records(t,ti):
 g,a=grid(t);gen=ti<4;courses=[];start=6 if ti==0 else 7 if gen else 9 if ti==7 else 8;step=2 if ti==7 else 1
 for r in range(int(t.get('rowCnt'))):
  sc=3 if ti==0 else 4;name=a.get((r,sc),'');typecol=2 if ti==0 else 3;typ=g.get((r,typecol),'');area=g.get((r,1 if ti==0 else 2),'')
  if not gen and (not name or typ not in ['공통','일반','진로','융합']):
   sc=3;name=a.get((r,sc),'');typ=g.get((r,2),'');area='전문교과'
   if typ not in ['공통','일반','실무']:continue
  elif typ not in ['공통','일반','진로','융합']:continue
  if not name:continue
  section=g.get((r,0),'학교지정')
  if not gen:section='학교지정선택' if any('택' in g.get((r,start+j*step),'') for j in range(6)) else '학교지정'
  section=re.sub(r'\s+','',section)
  opcol=5 if ti==0 else 6 if gen else 8 if ti==7 else 7;basecol=opcol-1 if gen else opcol-2
  markers={}
  for j,term in enumerate(['1-1','1-2','2-1','2-2','3-1','3-2']):
   col=start+j*step;v=g.get((r,col),'');m=re.search(r'택\s*(\d+)\]\s*(\d+)',v)
   if m:markers[term]=f'[택{m[1]}] / {m[2]}'
   else:
    value=num(v)
    if step==2 and (r,col+1) in a:value+=num(a[r,col+1])
    if value:markers[term]=str(value)
  if not markers:continue
  separate=any('별도' in g.get((r,start+j*step),'') for j in range(6))
  courses.append(dict(name=name,area=area,category=typ,section=section,baseCredits=g.get((r,basecol),''),credits=num(g.get((r,opcol),'')),semesters=list(markers),markers=markers,row=r+1,creditTreatment='separate' if separate else 'regular'))
 return courses,g,a
full=read(REVIEW/'2027학년도 교육과정편성표_전체선택과목_검토반영.hwpx');opened=read(REVIEW/'2027학년도 교육과정편성표_개설과목_검토반영.hwpx')
for dept,tis,integ in [('general',[1,2,3],0),('military',[5,6,7],4)]:
 target=data['plans'] if dept=='general' else data.setdefault('militaryPlans',{})
 opencs,_,opena=records(opened[integ],integ)
 opennotes={(norm(c['name']),term):opena.get((c['row']-1,13),'') for c in opencs for term in c['semesters']} if dept=='general' else {}
 openkeys={(norm(c['name']),term) for c in opencs for term in c['semesters']}
 for ti,year in zip(tis,[2027,2026,2025]):
  key=f'incoming{year}';cs,g,a=records(full[ti],ti);old=target.get(key,{});olds={norm(c['name']):c for c in old.get('courses',[])}
  for c in cs:
   previous=olds.get(norm(c['name']));c['id']=previous['id'] if previous else f'{dept}_{year}_{norm(c["name"])}';c['cohortPlanKey']=key;c['department']=dept
   c['openingStatusBySemester']={term:('open' if (norm(c['name']),term) in openkeys else 'not-open') if year+int(term[0])-1==2027 else 'unconfirmed' for term in c['semesters']}
   c['enrollmentNote']=next((opennotes.get((norm(c['name']),term),'') for term in c['semesters'] if c['openingStatusBySemester'][term]=='open' and '수강' in opennotes.get((norm(c['name']),term),'')), '')
   if c['creditTreatment']=='separate':c['deliveryMode']='online-school';c['separateCreditNote']='온라인학교 연계 별도 이수 · 정규 편성 학점 합계에서 제외'
  label='보통과' if dept=='general' else '부사관과'
  summary={};first=7 if dept=='general' else 9 if year==2025 else 8;step=2 if dept=='military' and year==2025 else 1
  course_label='이수학점 소계' if dept=='general' else '교과 이수학점 합계(보통교과+전문교과)'
  sr=next(r for (r,col),v in a.items() if col==0 and v==course_label)
  for j,term in enumerate(['1-1','1-2','2-1','2-2','3-1','3-2']):
   regular=num(a[sr,first+j*step]);summary[term]=dict(courseCredits=regular,creativeCredits=3,totalCredits=regular+3,separateCredits=sum(num(c['markers'].get(term,'')) for c in cs if c['creditTreatment']=='separate'))
  target[key]={**old,'label':f'{year}학년도 신입생'+('(예정)' if year==2027 else ''),'description':f'{label} {year}학년도 신입생 3개년 편성 · 실제 개설 여부는 2027학년도 확인분을 표시합니다.','sheetName':f'{year}학년도 신입생({label})','courses':cs,'summary':summary,'sourceRevision':'2026-10-29 컨설팅 검토본','department':dept}
 # Use cohort IDs and rows when deriving the mixed 2027 academic-year view.
 current=[];summary={}
 for grade,year in enumerate([2027,2026,2025],1):
  cohort=target[f'incoming{year}']
  for c in cohort['courses']:
   terms=[t for t in c['semesters'] if t.startswith(str(grade)+'-')]
   if terms:current.append({**c,'semesters':terms,'markers':{t:c['markers'][t] for t in terms},'row':len(current)+1,'choiceGroupIdBySemester':{}})
  summary.update({t:v for t,v in cohort['summary'].items() if t.startswith(str(grade)+'-')})
 # Preserve native choice-group boundaries even when cohort rows are compressed into the mixed view.
 for term in summary:
  last=None;group=0
  for c in current:
   if term not in c['semesters']:continue
   marker=c['markers'][term];same=(marker,c['section'])
   if '택' in marker:
    if same!=last:group+=1
    c['choiceGroupIdBySemester'][term]=f'{term}-{group}'
    last=same
   else:last=None
 target['current2027']={'label':'2027학년도 전학년','description':f'{"보통과" if dept=="general" else "부사관과"} · 1학년 2027 입학생, 2학년 2026 입학생, 3학년 2025 입학생의 해당 학년 편성입니다.','sheetName':'2027학년도 전학년','courses':current,'summary':summary,'department':dept,'gradeCohorts':{'1':'incoming2027','2':'incoming2026','3':'incoming2025'}}
data['updated']='2026-10-29';data['source']='2025·2026·2027 신입생 편성표 및 2027 전학년 실제 개설표(교육과정 컨설팅 검토본)';data['openingAcademicYear']=2027;data['referenceYear']=2026
path.write_text('window.ANJWA_CURRICULUM_DATA = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
print(json.dumps({dept:{k:len(v['courses']) for k,v in data[dept].items()} for dept in ['plans','militaryPlans']},ensure_ascii=False))
