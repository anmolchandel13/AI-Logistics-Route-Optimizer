package com.logistics.optimizer.util;

import java.security.SecureRandom;

public class TrackingNumberGenerator {

    private static final String PREFIX = "LOG";
    private static final SecureRandom RANDOM = new SecureRandom();

    private TrackingNumberGenerator() {
        // Utility class
    }

    /**
     * Generates a unique tracking number like LOG-8A3F2B7D
     */
    public static String generate() {
        StringBuilder sb = new StringBuilder(PREFIX).append("-");
        for (int i = 0; i < 8; i++) {
            int val = RANDOM.nextInt(36);
            sb.append(val < 10 ? (char) ('0' + val) : (char) ('A' + val - 10));
        }
        return sb.toString();
    }
}
