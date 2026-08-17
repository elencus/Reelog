package org.reelog.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.http.HttpHeaders;


@Configuration
public class TmdbConfig {

    @Bean
    public RestClient tmdbRestClient(
            @Value("${tmdb.base-url}") String baseUrl,
            @Value("${tmdb.access-token}") String token) {

        if (token == null || token.isBlank()) {
            throw new IllegalStateException(
                    "TMDB_TOKEN is not set. Get your API Read Access Token from " +
                            "TMDB > Settings > API and export it as TMDB_TOKEN."
            );
        }

        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .defaultHeader(HttpHeaders.ACCEPT, "application/json")
                .build();
    }
}
