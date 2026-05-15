package com.gmpp.intervention;

import java.util.List;

public record CompleteInterventionRequest(
        String observations,
        String etatConstate,
        FindingStatus findingStatus,
        String technicianSignature,
        String correctionReport,
        List<String> documentsJoints,
        List<String> photos
) {}
