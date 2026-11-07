"""Build the 7-page slide PDF and the separately verified 1-page privacy note."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import pymupdf

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'submission';OUT.mkdir(exist_ok=True)
pdfmetrics.registerFont(TTFont('Arial',r'C:\Windows\Fonts\arial.ttf'))
pdfmetrics.registerFont(TTFont('ArialBold',r'C:\Windows\Fonts\arialbd.ttf'))
pdfmetrics.registerFontFamily('Arial',normal='Arial',bold='ArialBold')

deck=canvas.Canvas(str(OUT/'PingMeMaybe_VITVellore.pdf'),pagesize=(960,540))
deck.setTitle('Udyam Saathi | Ping Me Maybe | VIT Vellore')
for i in range(1,8):
 deck.drawImage(str(ROOT/f'.build/slides/slide-{i}.png'),0,0,width=960,height=540)
 if i == 7:
  deck.linkURL('https://github.com/rizzit17/ping-me-maybe', (55,52,430,71), relative=0)
 deck.showPage()
deck.save()

body=ParagraphStyle('Body',fontName='Arial',fontSize=10,leading=13.5,textColor=colors.HexColor('#383834'),spaceAfter=8)
heading=ParagraphStyle('Heading',parent=body,fontName='ArialBold',fontSize=11.5,leading=15,textColor=colors.HexColor('#d50000'),spaceBefore=7,spaceAfter=5)
title=ParagraphStyle('Title',parent=body,fontName='ArialBold',fontSize=22,leading=27,textColor=colors.HexColor('#242422'),spaceAfter=7)
parts=[Paragraph('Privacy and security choices',title),Paragraph('<b>Ping Me Maybe</b> / Vellore Institute of Technology, Vellore<br/>Udyam Saathi / Airtel Sync 2026 Digital Track',body)]
sections=[
('Purpose and consent','Discovery needs business type, team size, city, budget and current tools. Government identifiers are unnecessary at this stage. Separate consent enables document extraction and mock registry checks. Owners can decline KYC and still explore products or quotes.'),
('Document processing and retention','OCR reads images on the owner’s device. Images, extracted fields, identifiers and consent remain in tab memory and do not go to the advisor. Refreshing clears KYC. Withdrawing consent clears the documents and verification results; pending OCR results are discarded. Session storage retains only non-identifying preferences and demo order items. A visible reset clears those too.'),
('AI, credentials and external services','The server keeps Gemini or OpenAI credentials in environment variables. Chat sends the message, basic business preferences and catalogue context to the selected provider; the interface warns against personal details in chat. Google’s Gemini free tier may use submitted content to improve products, so this demonstration uses fictional inputs only. OCR software and language files load from public CDNs; fonts load from Google Fonts. These requests expose normal network metadata.'),
('Validation and user control','The catalogue engine controls prices and eligibility. Mock checks cover GSTIN checksum/status, document dates, registration-name consistency and registered-address matching. Owners inspect OCR fields before confirmation. Ambiguous text, missing authority and mismatches require manual review. Results mask identifiers. A local assistance queue demonstrates handoff without sending external messages.'),
('Production gates and boundaries','All supplied businesses and documents are synthetic. No real government lookup, payment, e-sign or service activation occurs. Document checks use the case date, 15 July 2026. Prototype safeguards do not establish statutory telecom KYC or DPDP compliance. Production needs authorised identity integrations, operator/legal approval, access controls, encrypted storage and transport, audit logging, incident response and an approved deletion/retention schedule. Privacy review must cover consent, purpose limitation, minimisation and provider terms before launch.')]
for h,p in sections:parts.extend([Paragraph(h,heading),Paragraph(p,body)])
doc=SimpleDocTemplate(str(OUT/'PingMeMaybe_VITVellore_Privacy.pdf'),pagesize=A4,rightMargin=43,leftMargin=43,topMargin=36,bottomMargin=36,title='Privacy and security choices - Ping Me Maybe')
doc.build(parts)
privacy=pymupdf.open(OUT/'PingMeMaybe_VITVellore_Privacy.pdf')
assert len(privacy)==1,f'Privacy note has {len(privacy)} pages'
privacy[0].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).save(ROOT/'.build/privacy-preview.png')
assert len(pymupdf.open(OUT/'PingMeMaybe_VITVellore.pdf'))==7
print('Built a seven-page deck PDF and one-page privacy PDF.')
