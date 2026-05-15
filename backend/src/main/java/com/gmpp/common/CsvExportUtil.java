package com.gmpp.common;

import java.util.List;
import java.util.stream.Collectors;

public final class CsvExportUtil {

    private CsvExportUtil() {
    }

    public static String toCsv(List<String> headers, List<List<String>> rows) {
        String headerLine = headers.stream().map(CsvExportUtil::escape).collect(Collectors.joining(","));
        String body = rows.stream()
                .map(row -> row.stream().map(CsvExportUtil::escape).collect(Collectors.joining(",")))
                .collect(Collectors.joining(System.lineSeparator()));
        return headerLine + System.lineSeparator() + body;
    }

    private static String escape(String value) {
        if (value == null) {
            return "\"\"";
        }
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}

