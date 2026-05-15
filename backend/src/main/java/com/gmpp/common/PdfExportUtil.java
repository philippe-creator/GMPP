package com.gmpp.common;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

public final class PdfExportUtil {

    private PdfExportUtil() {
    }

    public static byte[] createTablePdf(String title, List<String> headers, List<List<String>> rows) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLACK);
            Paragraph p = new Paragraph(title, fontTitle);
            p.setAlignment(Paragraph.ALIGN_CENTER);
            p.setSpacingAfter(20);
            document.add(p);

            // Table
            PdfPTable table = new PdfPTable(headers.size());
            table.setWidthPercentage(100);

            // Header cells
            Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontHeader));
                cell.setBackgroundColor(new Color(15, 23, 42)); // Slate-900 like our theme
                cell.setPadding(5);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Body cells
            Font fontBody = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            for (List<String> row : rows) {
                for (String value : row) {
                    PdfPCell cell = new PdfPCell(new Phrase(value != null ? value : "", fontBody));
                    cell.setPadding(4);
                    table.addCell(cell);
                }
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    public static byte[] createDetailPdf(String title, List<DetailSection> sections) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(245, 158, 11)); // Accent color
            Paragraph p = new Paragraph(title, fontTitle);
            p.setAlignment(Paragraph.ALIGN_LEFT);
            p.setSpacingAfter(20);
            document.add(p);

            for (DetailSection section : sections) {
                // Section Title
                Font fontSection = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.BLACK);
                Paragraph s = new Paragraph(section.title(), fontSection);
                s.setSpacingBefore(15);
                s.setSpacingAfter(10);
                document.add(s);

                // Section Content (Key-Value pairs)
                PdfPTable table = new PdfPTable(2);
                table.setWidthPercentage(100);
                table.setWidths(new float[]{30, 70});

                Font fontKey = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);
                Font fontVal = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

                for (MapEntry entry : section.entries()) {
                    PdfPCell keyCell = new PdfPCell(new Phrase(entry.key(), fontKey));
                    keyCell.setBorder(Rectangle.NO_BORDER);
                    keyCell.setPaddingBottom(5);
                    table.addCell(keyCell);

                    PdfPCell valCell = new PdfPCell(new Phrase(entry.value(), fontVal));
                    valCell.setBorder(Rectangle.NO_BORDER);
                    valCell.setPaddingBottom(5);
                    table.addCell(valCell);
                }
                document.add(table);
            }

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF détaillé", e);
        }
    }

    public record DetailSection(String title, List<MapEntry> entries) {}
    public record MapEntry(String key, String value) {}
}
