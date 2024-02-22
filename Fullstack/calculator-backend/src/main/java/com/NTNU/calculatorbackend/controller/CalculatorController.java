package com.NTNU.calculatorbackend.controller;

import com.NTNU.calculatorbackend.model.CalculationResult;
import com.NTNU.calculatorbackend.service.CalculatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CalculatorController {

    private final CalculatorService calculatorService;
    private static final Logger logger = LoggerFactory.getLogger(CalculatorController.class);

    public CalculatorController(CalculatorService calculatorService) {
        this.calculatorService = calculatorService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<CalculationResult> calculate(@RequestBody CalculationRequest request) {
        String expression = request.getExpression();
        logger.info("Received calculation request for expression: {}", expression);
        try {
            double result = calculatorService.evaluateExpression(expression);
            logger.info("Calculation result for expression {}: {}", expression, result);
            return ResponseEntity.ok(new CalculationResult(expression, result));
        } catch (Exception e) {
            logger.error("Error during calculation for expression {}: {}", expression, e.getMessage());
            return ResponseEntity.badRequest().body(new CalculationResult(expression, e));
        }
    }

    // DTO for calculation request
    static class CalculationRequest {
        private String expression;

        public String getExpression() {
            return expression;
        }

        public void setExpression(String expression) {
            this.expression = expression;
        }
    }
}
