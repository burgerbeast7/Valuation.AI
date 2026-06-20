from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from app.schemas.prediction import PredictionRequest
from app.services.predictor import predictor_service
import io
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

router = APIRouter()

@router.post("/export/csv", tags=["export"])
async def export_csv(req: PredictionRequest):
    try:
        # Calculate prediction
        res = predictor_service.predict(req)
        
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write headers
        writer.writerow(["Parameter", "Input Value", "Unit/Description"])
        writer.writerow(["Annual Household Income", f"${(req.MedInc * 10000):,.2f}", "USD (MedInc)"])
        writer.writerow(["Median House Age", f"{req.HouseAge} years", "Age (HouseAge)"])
        writer.writerow(["Average Rooms", f"{req.AveRooms:.2f} rooms", "AveRooms"])
        writer.writerow(["Average Bedrooms", f"{req.AveBedrms:.2f} bedrooms", "AveBedrms"])
        writer.writerow(["Neighborhood Population", f"{req.Population:,.0f} people", "Population"])
        writer.writerow(["Average Occupancy", f"{req.AveOccup:.2f} occupants", "AveOccup"])
        writer.writerow(["Latitude Coordinate", f"{req.Latitude:.4f}° N", "Latitude"])
        writer.writerow(["Longitude Coordinate", f"{req.Longitude:.4f}° W", "Longitude"])
        writer.writerow([])
        writer.writerow(["Valuation Target Metrics", "Value", "Notes"])
        writer.writerow(["Estimated Market Value", f"${res.estimated_value:,.2f}", "Estimated value"])
        writer.writerow(["Confidence Bounds (+/-)", f"${res.confidence_interval:,.2f}", "Model margin of error"])
        writer.writerow(["California Census Median", f"${res.california_median:,.2f}", "1990 census median baseline"])
        writer.writerow(["Market Segment", res.market_segment, "Price bracket classification"])
        writer.writerow(["Valuation Percentile Rank", f"{res.percentile:.1f}%", "California district rank percentile"])
        
        # Seek back to beginning
        output.seek(0)
        csv_data = output.getvalue()
        
        return Response(
            content=csv_data,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=valuation_report.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV compile error: {str(e)}")

@router.post("/export/pdf", tags=["export"])
async def export_pdf(req: PredictionRequest):
    try:
        # Calculate prediction
        res = predictor_service.predict(req)
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Custom styles for ValuationAI branding
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=colors.HexColor('#0F172A'),
            spaceAfter=4
        )
        
        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#64748B'),
            spaceAfter=20
        )

        h1_style = ParagraphStyle(
            'SectionHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#6366F1'),
            spaceBefore=14,
            spaceAfter=8,
            keepWithNext=True
        )

        body_style = ParagraphStyle(
            'BodyTextCustom',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=13,
            textColor=colors.HexColor('#334155'),
            spaceAfter=8
        )
        
        cell_header_style = ParagraphStyle(
            'CellHeader',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=9,
            leading=11,
            textColor=colors.HexColor('#0F172A')
        )
        
        cell_value_style = ParagraphStyle(
            'CellValue',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=8.5,
            leading=11,
            textColor=colors.HexColor('#334155')
        )

        story = []
        
        # 1. Branding Header
        story.append(Paragraph("VALUATION.AI", title_style))
        story.append(Paragraph("California Real Estate Intelligence Dashboard • Valuation Synthesis Report", subtitle_style))
        story.append(Spacer(1, 10))
        
        # 2. Main Valuation Box
        val_data = [
            [Paragraph("<b>ESTIMATED DISTRICT VALUE</b>", cell_header_style), Paragraph("<b>MARKET SEGMENT</b>", cell_header_style)],
            [Paragraph(f"<font size='18' color='#6366F1'><b>${res.estimated_value:,.2f}</b></font>", cell_value_style), Paragraph(f"<font size='14'><b>{res.market_segment}</b></font>", cell_value_style)],
            [Paragraph(f"Confidence Boundary: ±${res.confidence_interval:,.0f} USD", cell_value_style), Paragraph(f"Percentile Rank: {res.percentile:.1f}% of CA Districts", cell_value_style)]
        ]
        val_table = Table(val_data, colWidths=[260, 260])
        val_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F8FAFC')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 12),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ]))
        story.append(val_table)
        story.append(Spacer(1, 20))
        
        # 3. Input Characteristics Table
        story.append(Paragraph("District Inputs & Baseline Comparisons", h1_style))
        story.append(Paragraph("The OLS model uses these specific socioeconomic characteristics of the census block group:", body_style))
        
        headers = [Paragraph("<b>Feature</b>", cell_header_style), Paragraph("<b>Input Value</b>", cell_header_style), Paragraph("<b>Unit / Baseline Info</b>", cell_header_style)]
        table_rows = [
            headers,
            [Paragraph("Median Household Income (MedInc)", cell_value_style), Paragraph(f"${(req.MedInc * 10000):,.0f}", cell_value_style), Paragraph("USD / CA Census Average: $38.7k", cell_value_style)],
            [Paragraph("Median House Age (HouseAge)", cell_value_style), Paragraph(f"{req.HouseAge:.0f} years", cell_value_style), Paragraph("Building age capped at 52 yrs", cell_value_style)],
            [Paragraph("Average Rooms (AveRooms)", cell_value_style), Paragraph(f"{req.AveRooms:.2f} rooms", cell_value_style), Paragraph("Average rooms per household plain", cell_value_style)],
            [Paragraph("Average Bedrooms (AveBedrms)", cell_value_style), Paragraph(f"{req.AveBedrms:.2f} bdrms", cell_value_style), Paragraph("Average bedrooms per household plain", cell_value_style)],
            [Paragraph("District Population", cell_value_style), Paragraph(f"{req.Population:,.0f} people", cell_value_style), Paragraph("Total residents residing in block group", cell_value_style)],
            [Paragraph("Household Occupancy (AveOccup)", cell_value_style), Paragraph(f"{req.AveOccup:.2f} members", cell_value_style), Paragraph("Average family size per household", cell_value_style)],
            [Paragraph("Latitude Coordinate", cell_value_style), Paragraph(f"{req.Latitude:.4f}° N", cell_value_style), Paragraph("GPS Latitude geographical coordinate", cell_value_style)],
            [Paragraph("Longitude Coordinate", cell_value_style), Paragraph(f"{req.Longitude:.4f}° W", cell_value_style), Paragraph("GPS Longitude geographical coordinate", cell_value_style)],
        ]
        
        char_table = Table(table_rows, colWidths=[200, 120, 200])
        char_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 6),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ]))
        story.append(char_table)
        story.append(Spacer(1, 20))
        
        # 4. Explainability & OLS Coefficient Contributions
        story.append(Paragraph("Model Explainability: Coefficient Contributions", h1_style))
        story.append(Paragraph("Calculated contribution offsets showing each feature's direct influence on the valuation:", body_style))
        
        contrib_headers = [Paragraph("<b>Feature</b>", cell_header_style), Paragraph("<b>Linear Contribution</b>", cell_header_style), Paragraph("<b>Statistical Explanation</b>", cell_header_style)]
        contrib_rows = [contrib_headers]
        for c in res.contributors:
            contrib_rows.append([
                Paragraph(c.feature, cell_value_style),
                Paragraph(f"<font color='{'#10B981' if c.impact=='positive' else '#EC4899' if c.impact=='negative' else '#64748B'}'><b>{c.contribution:+.4f}</b></font>", cell_value_style),
                Paragraph(c.description, cell_value_style)
            ])
            
        contrib_table = Table(contrib_rows, colWidths=[150, 120, 250])
        contrib_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
            ('PADDING', (0,0), (-1,-1), 6),
            ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F8FAFC')]),
        ]))
        story.append(contrib_table)
        story.append(Spacer(1, 20))
        
        # 5. Professional Disclaimer
        story.append(Paragraph("Disclaimer: This model is built for academic demo and data analysis representation using historical 1990 U.S. Census metrics and has not been adjusted for current real estate inflation index curves.", ParagraphStyle('Disclaimer', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=7.5, textColor=colors.HexColor('#94A3B8'))))
        
        doc.build(story)
        buffer.seek(0)
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=valuation_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF compile error: {str(e)}")
