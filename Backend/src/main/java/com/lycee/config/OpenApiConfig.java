package com.lycee.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class OpenApiConfig {

    /** OpenAPI / Swagger UI security scheme name for HTTP Bearer (access JWT). */
    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI lyceeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Lycée Saint Alexandre Sauli de Muhura APIs")
                        .description("REST API documentation. For protected routes, open Authorize, choose bearerAuth, and paste the access JWT from sign-in or refresh (Swagger sends Authorization: Bearer automatically). POST /signin, /refresh, and /signout do not require a Bearer token.")
                        .version("v1"))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .name(BEARER_AUTH)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Short-lived access JWT from sign-in or refresh (`JwtResponse.accessToken`).")));
    }

    /**
     * SpringDoc can cache OpenAPI metadata and keep default tag names (*-controller) after edits.
     * This customizer forces numbered tags and a stable tag list for Swagger UI.
     */
    @Bean
    @Order(10)
    public OpenApiCustomizer numberedControllerTags() {
        Map<String, String> rename = new LinkedHashMap<>();
        rename.put("auth-controller", "1. Authentication");
        rename.put("babyeyi-pdf-controller", "2. Babyeyi");
        rename.put("chat-inquiry-controller", "3. Chat inquiries");
        rename.put("chat-conversation-controller", "4. Chat conversation");
        rename.put("chatbolt-controller", "5. Chatbolt");

        return openApi -> {
            openApi.setTags(List.of(
                    new Tag().name("1. Authentication"),
                    new Tag().name("2. Babyeyi"),
                    new Tag().name("3. Chat inquiries"),
                    new Tag().name("4. Chat conversation"),
                    new Tag().name("5. Chatbolt")
            ));
            if (openApi.getPaths() == null) {
                return;
            }
            openApi.getPaths().values().forEach(pathItem ->
                    pathItem.readOperations().forEach(operation -> {
                        if (operation.getTags() == null) {
                            return;
                        }
                        operation.setTags(operation.getTags().stream()
                                .map(t -> rename.getOrDefault(t, t))
                                .collect(Collectors.toList()));
                    }));
        };
    }

    /**
     * Ensures every operation documents at least five HTTP error outcomes in Swagger UI
     * (merged with SpringDoc defaults; existing entries for a status are kept).
     */
    @Bean
    @Order(20)
    public OpenApiCustomizer standardErrorResponseDocumentation() {
        return openApi -> {
            if (openApi.getPaths() == null) {
                return;
            }
            openApi.getPaths().values().forEach(pathItem ->
                    pathItem.readOperations().forEach(operation -> {
                        ApiResponses responses = operation.getResponses();
                        if (responses == null) {
                            responses = new ApiResponses();
                            operation.setResponses(responses);
                        }
                        addResponseIfAbsent(responses, "400", "Bad request — invalid input or validation failed.");
                        addResponseIfAbsent(responses, "401", "Unauthorized — JWT missing, expired, or invalid.");
                        addResponseIfAbsent(responses, "403", "Forbidden — authenticated user cannot perform this action.");
                        addResponseIfAbsent(responses, "404", "Not found — resource does not exist or is not visible.");
                        addResponseIfAbsent(responses, "500", "Internal server error — unexpected failure.");
                    }));
        };
    }

    private static void addResponseIfAbsent(ApiResponses responses, String code, String description) {
        if (responses.containsKey(code)) {
            return;
        }
        responses.addApiResponse(code, new ApiResponse().description(description));
    }
}
