package com.logistics.optimizer.service;

import com.logistics.optimizer.entity.RouteOptimization;
import com.logistics.optimizer.entity.Shipment;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@Slf4j
public class GeminiAIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    @Value("${gemini.api.url}")
    private String baseUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiAIService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public RouteOptimization analyzeRoute(Shipment shipment) {
        if ("mock".equals(apiKey) || apiKey == null || apiKey.isBlank()) {
            log.info("Using mock AI service (no Gemini API key configured)");
            return generateMockOptimization(shipment);
        }

        try {
            return callGeminiAPI(shipment);
        } catch (Exception e) {
            log.error("Gemini API call failed, falling back to mock: {}", e.getMessage());
            return generateMockOptimization(shipment);
        }
    }

    private RouteOptimization callGeminiAPI(Shipment shipment) {
        String prompt = buildPrompt(shipment);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 2048
                )
        );

        String url = baseUrl + "/" + model + ":generateContent?key=" + apiKey;

        String response = webClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return parseGeminiResponse(response, shipment);
    }

    private String buildPrompt(Shipment shipment) {
        return """
                You are an expert AI logistics route optimizer. Analyze the following shipment and provide a comprehensive route optimization analysis.
                
                SHIPMENT DETAILS:
                - Pickup Location: %s
                - Destination: %s
                - Weight: %.1f kg
                - Vehicle Type: %s
                - Cargo Type: %s
                - Priority: %s
                - Delivery Deadline: %s
                - Notes: %s
                
                Provide your analysis as a JSON object with EXACTLY these fields (return ONLY valid JSON, no markdown, no code blocks):
                {
                  "recommendedRoute": "Detailed step-by-step route description with road names and key waypoints",
                  "distanceKm": <number>,
                  "estimatedTime": "<human readable time like '5 hours 30 minutes'>",
                  "costEstimate": <number in USD>,
                  "fuelConsumptionLiters": <number>,
                  "carbonEmissionsKg": <number>,
                  "delayRisks": ["risk1 with explanation", "risk2 with explanation"],
                  "weatherImpact": "Description of potential weather impacts and recommendations",
                  "alternativeRoutes": [{"name": "Route B", "distance": "<km>", "time": "<time>", "pros": "<advantages>", "cons": "<disadvantages>"}],
                  "optimizationSuggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
                  "optimizationScore": <number between 60-98>
                }
                
                Make the analysis realistic, specific to the locations mentioned, and highly detailed. Consider traffic patterns, road conditions, fuel efficiency of the vehicle type, and special handling requirements for the cargo type.
                """.formatted(
                shipment.getPickupLocation(),
                shipment.getDestination(),
                shipment.getWeightKg(),
                shipment.getVehicleType().getDisplayName(),
                shipment.getCargoType().getDisplayName(),
                shipment.getPriority().name(),
                shipment.getDeliveryDeadline() != null ? shipment.getDeliveryDeadline().toString() : "Not specified",
                shipment.getNotes() != null ? shipment.getNotes() : "None"
        );
    }

    private RouteOptimization parseGeminiResponse(String response, Shipment shipment) {
        try {
            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            // Clean up any markdown formatting
            text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();

            JsonNode data = objectMapper.readTree(text);

            return RouteOptimization.builder()
                    .recommendedRoute(data.path("recommendedRoute").asText())
                    .distanceKm(data.path("distanceKm").asDouble())
                    .estimatedTime(data.path("estimatedTime").asText())
                    .costEstimate(data.path("costEstimate").asDouble())
                    .fuelConsumptionLiters(data.path("fuelConsumptionLiters").asDouble())
                    .carbonEmissionsKg(data.path("carbonEmissionsKg").asDouble())
                    .delayRisks(data.path("delayRisks").toString())
                    .weatherImpact(data.path("weatherImpact").toString())
                    .alternativeRoutes(data.path("alternativeRoutes").toString())
                    .optimizationSuggestions(data.path("optimizationSuggestions").toString())
                    .optimizationScore(data.path("optimizationScore").asInt())
                    .aiModelUsed("Gemini " + model)
                    .build();
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return generateMockOptimization(shipment);
        }
    }

    private RouteOptimization generateMockOptimization(Shipment shipment) {
        Random random = new Random(shipment.getPickupLocation().hashCode() + shipment.getDestination().hashCode());

        double baseDistance = 200 + random.nextInt(1800);
        double fuelRate = switch (shipment.getVehicleType()) {
            case TRUCK -> 0.35;
            case VAN -> 0.12;
            case BIKE -> 0.04;
            case DRONE -> 0.02;
            case SHIP -> 0.50;
            case RAIL -> 0.08;
        };

        double fuel = baseDistance * fuelRate;
        double carbon = fuel * 2.31;
        double costPerKm = switch (shipment.getVehicleType()) {
            case TRUCK -> 1.8;
            case VAN -> 1.2;
            case BIKE -> 0.5;
            case DRONE -> 3.0;
            case SHIP -> 0.9;
            case RAIL -> 0.7;
        };

        double priorityMultiplier = switch (shipment.getPriority()) {
            case LOW -> 1.0;
            case MEDIUM -> 1.2;
            case HIGH -> 1.5;
            case CRITICAL -> 2.0;
        };

        double cost = baseDistance * costPerKm * priorityMultiplier + shipment.getWeightKg() * 0.05;
        int hours = (int) (baseDistance / (60 + random.nextInt(40)));
        int minutes = random.nextInt(60);
        int score = 65 + random.nextInt(30);

        String delayRisks = """
                ["Heavy traffic expected during peak hours on highway segments - plan departure before 6 AM or after 8 PM", \
                "Construction work on alternate route may cause 30-45 minute delays", \
                "Border crossing documentation may add 1-2 hours processing time"]""";

        String weatherImpact = """
                "Current forecast shows partly cloudy conditions along the route. \
                Temperature range: 18-28°C. Light winds expected. \
                No severe weather warnings. Recommended to carry weather protection for %s cargo."
                """.trim().formatted(shipment.getCargoType().getDisplayName());

        String altRoutes = """
                [{"name":"Express Highway Route","distance":"%.0f km","time":"%d hours %d minutes",\
                "pros":"Faster with less traffic, better road conditions","cons":"Higher toll fees, limited rest stops"},\
                {"name":"Coastal Scenic Route","distance":"%.0f km","time":"%d hours %d minutes",\
                "pros":"Lower toll costs, more fuel stations","cons":"Slightly longer distance, winding roads"}]"""
                .formatted(
                        baseDistance * 0.9, hours - 1, minutes,
                        baseDistance * 1.15, hours + 1, (minutes + 30) % 60
                );

        String suggestions = """
                ["Consolidate shipment with nearby pickups to reduce per-unit cost by up to 25%%", \
                "Schedule departure at 5:00 AM to avoid peak traffic and reduce travel time by ~40 minutes", \
                "Consider using a %s for this weight class to optimize fuel efficiency", \
                "Pre-clear customs documentation to eliminate border crossing delays", \
                "Install real-time GPS tracking for live route deviation alerts"]"""
                .formatted(shipment.getWeightKg() > 5000 ? "rail transport" : "smaller van");

        return RouteOptimization.builder()
                .recommendedRoute("Depart from " + shipment.getPickupLocation()
                        + " via National Highway → Interstate Expressway → Regional Route 7 "
                        + "→ City Bypass Road → Local Distribution Center → Final delivery at "
                        + shipment.getDestination()
                        + ". Key waypoints include Central Logistics Hub for refueling and "
                        + "Regional Checkpoint for documentation verification.")
                .distanceKm(Math.round(baseDistance * 100.0) / 100.0)
                .estimatedTime(hours + " hours " + minutes + " minutes")
                .costEstimate(Math.round(cost * 100.0) / 100.0)
                .fuelConsumptionLiters(Math.round(fuel * 100.0) / 100.0)
                .carbonEmissionsKg(Math.round(carbon * 100.0) / 100.0)
                .delayRisks(delayRisks)
                .weatherImpact(weatherImpact)
                .alternativeRoutes(altRoutes)
                .optimizationSuggestions(suggestions)
                .optimizationScore(score)
                .aiModelUsed("Mock AI Engine v1.0")
                .build();
    }
}
