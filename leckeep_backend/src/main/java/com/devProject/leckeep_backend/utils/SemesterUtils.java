package com.devProject.leckeep_backend.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class SemesterUtils {
    private static final Pattern SEMESTER_PATTERN = Pattern.compile("^(?:semester\\s*)?([1-8])$", Pattern.CASE_INSENSITIVE);
    private static final String SEMESTER_PREFIX = "Semester ";

    private SemesterUtils() {
    }

    public static String normalizeSemester(String semester) {
        if (semester == null || semester.isBlank()) {
            return SEMESTER_PREFIX + "1";
        }

        Matcher matcher = SEMESTER_PATTERN.matcher(semester.trim());
        if (!matcher.matches()) {
            throw new IllegalArgumentException("Semester must be between 1 and 8");
        }

        return SEMESTER_PREFIX + matcher.group(1);
    }
}
